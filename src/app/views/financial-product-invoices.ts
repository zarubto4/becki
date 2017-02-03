/**
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
import { ModalsGopayInline, ModalsGopayInlineComponent } from '../modals/gopay-inline';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';

@Component({
    selector: 'bk-view-financial-product-invoices',
    templateUrl: './financial-product-invoices.html'
})
export class FinancialProductInvoicesComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    product: IProduct = null;

    invoices: IInvoice[] = null;


    constructor(injector: Injector) {
        super(injector);
    };

    onAddCreditsClick(): void {

    }

    onInvoiceClick(invoice: IInvoice): void {
        this.router.navigate(['financial', this.id, 'invoices', invoice.id]);
    }

    onPayClick(invoice: IInvoice): void {
        this.backendService.sendInvoiceReimbursement(invoice.id).then(gopay => {
            let model = new ModalsGopayInline('gib monny', (gopay.gw_url));
            this.modalService.showModal(model).then((success) => {
                this.router.navigate(['/financial']);
            });
        });
    }

    onDownloadPDFClick(invoice: IInvoice): void {
        window.open(invoice.pdf_link, 'download');
    }

    onSendClick(invoice: IInvoice): void {
        this.blockUI();
        this.backendService.InvoiceResend(invoice.id).then(response => {
            this.unblockUI();
            this.addFlashMessage(new FlashMessageSuccess('The invoice has been resended on general invoice email.'));
        }).catch(() => {
            this.unblockUI();
            this.addFlashMessage(new FlashMessageError('The invoice can not been resend'));
        })
    }

    onPrintClick(): void {

    }

    onSettingsClick(): void {

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
