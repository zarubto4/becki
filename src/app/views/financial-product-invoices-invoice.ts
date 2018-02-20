/**
 * Created by dominik.krisztof on 01.12.16.
 */

import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IProduct, IInvoiceFullDetails } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';


@Component({
    selector: 'bk-view-financial-product-invoices-invoice',
    templateUrl: './financial-product-invoices-invoice.html'
})
export class FinancialProductInvoicesInvoiceComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    invoiceId: string;

    fullIvoice: IInvoiceFullDetails;

    routeParamsSubscription: Subscription;

    product: IProduct = null;

    constructor(injector: Injector) {
        super(injector);
    };

    getWholePrice(): string {
        let price = 0;
        this.fullIvoice.invoice_items.map(item => price += item.unit_price);

        return price.toString().substring(0, price.toString().indexOf('.') + 3);
    }

    ngOnInit(): void {
        this.blockUI();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['product'];
            this.invoiceId = params['invoice'];
            this.refresh();
            this.unblockUI();
        });

    }



    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }



    refresh(): void {
        this.blockUI();

        this.tyrionBackendService.invoiceGet(this.invoiceId).then(invoice =>  {
            this.fullIvoice = invoice;
            // console.log(invoice);
            this.unblockUI();
        }).catch(error =>  {

            this.unblockUI();
        });

        this.tyrionBackendService.productsGetUserOwnList().then(products =>  {
            this.product = products.find(product => product.id === this.id);
            this.unblockUI();
        }).catch(error =>  {

            this.unblockUI();
        });

    }
}
