/*
 * Created by dominik.krisztof on 01.12.16.
 */
/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IProduct, IInvoice } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsSendInvoiceModel } from './../modals/financial-send-invoice';
import { GoPayLoaderService } from '../services/GoPayLoaderService';

@Component({
    selector: 'bk-view-financial-product-invoices',
    templateUrl: './financial-product-invoices.html'
})
export class FinancialProductInvoicesComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    product: IProduct = null;

    invoices: IInvoice[] = null;

    goPayLoaderService: GoPayLoaderService;
    goPayLoaderServiceSubscription: Subscription;

    constructor(injector: Injector) {
        super(injector);
        this.goPayLoaderService = injector.get(GoPayLoaderService);
    };

    onAddCreditsClick(): void {

    }

    onInvoiceClick(invoice: IInvoice): void {
        this.router.navigate(['financial', this.id, 'invoices', invoice.id]);
    }

    onPayClick(invoice: IInvoice): void {
        this.backendService.sendInvoiceReimbursement(invoice.id).then(gopay => {

            let gwUrl = gopay.gw_url;

            this.goPayLoaderServiceSubscription = this.goPayLoaderService.goPay.subscribe((goPay) => {
                goPay.checkout({
                    gatewayUrl: gwUrl,
                    inline: true
                }, (checkoutResult) => {
                    this.router.navigate(['/financial']);
                });
            });

        });
    }

    onDownloadInvoicePDFClick(invoice: IInvoice): void {
        window.open(invoice.invoice_pdf_link, 'download');
    }

    onDownloadProFormaPDFClick(invoice: IInvoice): void {
        window.open(invoice.proforma_pdf_link, 'download');
    }

    onSendClick(invoice: IInvoice): void {

        let model = new ModalsSendInvoiceModel('Send invoice', invoice.id, this.product.payment_details.invoice_email);
        this.modalService.showModal(model).then((success) => {
            this.backendService.resendInvoice(invoice.id, {}).then(response => {
                // this.unblockUI();
                this.addFlashMessage(new FlashMessageSuccess('The invoice has been resended on general invoice email.'));
            }).catch(() => {
                // this.unblockUI();
                this.addFlashMessage(new FlashMessageError('The invoice can not been resend'));
            });
        });
    }

    onPrintClick(): void {

    }

    ngOnInit(): void {
        this.blockUI();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['product'];
            this.refresh();
            this.unblockUI();
        });

    }


    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.goPayLoaderServiceSubscription) {
            this.goPayLoaderServiceSubscription.unsubscribe();
        }
    }


    refresh(): void {
        this.blockUI();
        this.backendService.getAllProducts().then(products => {
            this.product = products.find(product => product.id === this.id);
            this.invoices = this.product.invoices;
            this.unblockUI();
        }).catch(error => {
            this.unblockUI();
        });

    }
}
