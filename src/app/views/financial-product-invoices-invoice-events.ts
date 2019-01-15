/*
 * © 2016-2018 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import {
    IExtensionFinancialEvent, IExtensionFinancialEventSearch, IInvoice, IInvoiceFullDetails, IProduct,
    IProductExtension
} from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { FlashMessageError } from '../services/NotificationService';
import { IError } from '../services/_backend_class/Responses';


@Component({
    selector: 'bk-view-financial-product-invoices-invoice-events',
    templateUrl: './financial-product-invoices-invoice-events.html'
})
export class FinancialProductInvoicesInvoiceEventsComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    routeParamsSubscription: Subscription;

    idProduct: string;

    idInvoice: string;

    financialEvents: IExtensionFinancialEvent[] = [];

    product: IProduct = null;

    invoice: IInvoice = null;

    constructor(injector: Injector) {
        super(injector);
    };


    ngOnInit(): void {
        this.blockUI();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.idProduct = params['product'];
            this.idInvoice = params['invoice'];
            this.refresh();
            this.unblockUI();
        });

    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {

        const search: IExtensionFinancialEventSearch = {
            invoice_id: this.idInvoice
        };

        this.blockUI();
        Promise.all<any>([this.tyrionBackendService.productGet(this.idProduct), this.tyrionBackendService.invoiceGet(this.idInvoice),
            this.tyrionBackendService.productGetExtensionFinancialEvents(search)])
            .then((values: [IProduct, IInvoiceFullDetails, IExtensionFinancialEvent[]]) => {
                this.product = values[0];
                this.invoice = values[1].invoice;
                this.unblockUI();

                if (!this.invoice.update_permission) {
                    this.router.navigate(['financial', this.idProduct, 'invoices']);
                }

                this.financialEvents = values[2];
            })
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError('Product cannot be loaded.', reason));
                this.unblockUI();
            });
    }
}
