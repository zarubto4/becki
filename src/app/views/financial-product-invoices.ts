/*
 * © 2016-2008 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IProduct, IInvoice } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsSendInvoiceModel } from './../modals/financial-send-invoice';
import { TyrionApiBackend } from '../backend/BeckiBackend';
import { ModalService } from '../services/ModalService';
import { TyrionBackendService } from '../services/BackendService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-financial-product-invoices',
    templateUrl: './financial-product-invoices.html'
})
export class FinancialProductInvoicesComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    private routeParamsSubscription: Subscription;

    private id: string;

    product: IProduct = null;

    invoices: IInvoice[] = null;

    // private goPayLoaderService: GoPayLoaderService;
    //
    // private goPayLoaderServiceSubscription: Subscription;

    private actions: FinancialProductInvoiceActions;

    constructor(injector: Injector, http: HttpClient) {
        super(injector);
        this.actions = new FinancialProductInvoiceActions(this, injector, http);
        // this.goPayLoaderService = injector.get(GoPayLoaderService);
    };

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
        // if (this.goPayLoaderServiceSubscription) {
        //     this.goPayLoaderServiceSubscription.unsubscribe();
        // }
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([this.tyrionBackendService.productGet(this.id), this.tyrionBackendService.productGetInvoices(this.id)])
            .then((values: [IProduct, IInvoice[]]) => {
                this.product =  values[0];
                this.invoices =  values[1];
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError('Data cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onInvoiceClick(invoice: IInvoice): void {
        this.router.navigate(['financial', this.id, 'invoices', invoice.id]);
    }

    onDropDownEmiter(action: string, invoice: IInvoice): void {
        this.actions.doAction(action, invoice, this.product).then(result => this.refresh());
    }
}

export class FinancialProductInvoiceActions {
    protected tyrionBackendService: TyrionBackendService = null;
    protected modalService: ModalService = null;

    constructor(private page: _BaseMainComponent, private injector: Injector, private http: HttpClient) {
        this.tyrionBackendService = injector.get(TyrionBackendService);
        this.modalService = injector.get(ModalService);
    }

    doAction(action: string, invoice: IInvoice, product: IProduct): Promise<IInvoice> {
        if (action === 'DOWNLOAD_INVOICE_PDF') {
            return this.onDownloadInvoicePDFClick(invoice);
        }

        if (action === 'DOWNLOAD_PROFORMA_PDF') {
            return this.onDownloadProFormaPDFClick(invoice);
        }

        if (action === 'SEND_INVOICE') {
            return this.onSendInvoice(invoice, product);
        }

        if (action === 'CONFIRM_INVOICE') {
            return this.onConfirmInvoice(invoice);
        }

        if (action === 'SYNCHRONIZE_FAKTUROID') {
            return this.onSynchronizeFakturoid(invoice);
        }

        if (action === 'OPEN_FAKTUROID_INVOICE') {
            return this.onOpenFakturoidInvoice(invoice);
        }
    }

    private onDownloadInvoicePDFClick(invoice: IInvoice): Promise<IInvoice> {
        return this.downloadFile(invoice, 'invoice');
    }

    private onDownloadProFormaPDFClick(invoice: IInvoice): Promise<IInvoice> {
        return this.downloadFile(invoice, 'proforma');
    }

    private downloadFile(invoice: IInvoice, type: string): Promise<IInvoice> {
        return new Promise<IInvoice>((resolve, reject) => {
            this.page.blockUI();
            this.http
                .get(invoice.proforma_pdf_link, {
                    responseType: 'blob',
                    headers: new HttpHeaders({'X-Auth-Token': TyrionApiBackend.getToken()})
                })
                .subscribe(res => {
                    let url = window.URL.createObjectURL(res);
                    window.open(url, '_blank');
                }, error => {
                    this.page.unblockUI();
                    this.page.addFlashMessage(new FlashMessageError(this.page.translate('flash_invoice_cant_be_downloaded')));
                    resolve(invoice);
                }, () => {
                    this.page.unblockUI();
                    reject();
                });
        });
    }

    private onSendInvoice(invoice: IInvoice, product: IProduct): Promise<IInvoice> {
        return new Promise<IInvoice>((resolve, reject) => {
            this.page.blockUI();
            let model = new ModalsSendInvoiceModel('Send invoice', invoice.id, product.owner.contact.invoice_email);
            this.modalService.showModal(model).then((success) => {
                if (!success) {
                    return;
                }
                const email = model.email;
                this.tyrionBackendService.invoiceResend(invoice.id, {email}).then(response => {
                    this.page.unblockUI();
                    this.page.addFlashMessage(new FlashMessageSuccess(this.page.translate('flash_invoice_been_resend')));
                    resolve(invoice);
                }).catch(() => {
                    this.page.unblockUI();
                    this.page.addFlashMessage(new FlashMessageError(this.page.translate('flash_invoice_cant_be_resend')));
                    reject();
                });
            });
        });
    }

    private onConfirmInvoice(invoice: IInvoice): Promise<IInvoice> {
        return new Promise<IInvoice>((resolve, reject) => {
            this.page.blockUI();
            this.tyrionBackendService.invoiceConfirm(invoice.id).then(response => {
                this.page.unblockUI();
                this.page.addFlashMessage(new FlashMessageSuccess(this.page.translate('flash_invoice_been_confirmed')));
                resolve(response);
            }).catch(() => {
                this.page.unblockUI();
                this.page.addFlashMessage(new FlashMessageError(this.page.translate('flash_invoice_cant_be_confirmed')));
                reject();
            });
        });
    }

    private onSynchronizeFakturoid(invoice: IInvoice): Promise<IInvoice> {
        return new Promise<IInvoice>((resolve, reject) => {
            this.page.blockUI();
            this.tyrionBackendService.invoiceSynchronizeWithFakturoid(invoice.id).then(response => {
                this.page.unblockUI();
                this.page.addFlashMessage(new FlashMessageSuccess(this.page.translate('flash_invoice_been_synchronized')));
                resolve(response);
            }).catch(() => {
                this.page.unblockUI();
                this.page.addFlashMessage(new FlashMessageError(this.page.translate('flash_invoice_cant_be_synchronized')));
                reject();
            });
        });
    }

    private onOpenFakturoidInvoice(invoice: IInvoice): Promise<IInvoice> {
        return new Promise<IInvoice>((resolve, reject) => {
            window.open(invoice.public_html_url);
            resolve(invoice);
        });
    }
}
