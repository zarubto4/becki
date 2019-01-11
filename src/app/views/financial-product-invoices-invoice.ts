/**
 * Created by dominik.krisztof on 01.12.16.
 */

import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IProduct, IInvoiceFullDetails } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { FinancialProductInvoiceActions } from './financial-product-invoices';
import { HttpClient } from '@angular/common/http';
import { IError } from '../services/_backend_class/Responses';


@Component({
    selector: 'bk-view-financial-product-invoices-invoice',
    templateUrl: './financial-product-invoices-invoice.html'
})
export class FinancialProductInvoicesInvoiceComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    routeParamsSubscription: Subscription;

    idProduct: string;

    idInvoice: string;

    fullInvoice: IInvoiceFullDetails = null;

    product: IProduct = null;

    private actions: FinancialProductInvoiceActions;

    constructor(injector: Injector, http: HttpClient) {
        super(injector);
        this.actions = new FinancialProductInvoiceActions(this, injector, http);
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

    onPortletClick(action: string): void {
        this.actions.doAction(action, this.fullInvoice.invoice, this.product).then(response => this.refresh());
    }

    showEvents(): void  {
        this.router.navigate(['financial', this.idProduct, 'invoices', this.idInvoice, 'financial-events']);
    }

    private refresh(): void {
        this.blockUI();

        Promise.all<any>([this.tyrionBackendService.invoiceGet(this.idInvoice), this.tyrionBackendService.productGet(this.idProduct)])
            .then((values: [IInvoiceFullDetails, IProduct]) => {
                this.fullInvoice =  values[0];
                this.product =  values[1];
                this.unblockUI();

                if (!this.fullInvoice.invoice.update_permission) {
                    this.router.navigate(['financial', this.idProduct, 'invoices']);
                }
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });
    }
}
