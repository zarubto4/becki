/**
 * Created by dominik.krisztof on 01.12.16.
 */

import {OnInit, Component, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {IProduct, IInvoiceFullDetails} from "../backend/TyrionAPI";
import {Subscription} from "rxjs";


@Component({
    selector: "view-financial-product-invoices-invoice",
    templateUrl: "app/views/financial-product-invoices-invoice.html"
})
export class FinancialProductInvoicesInvoiceComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: number;

    invoiceId:number;

    fullIvoice:IInvoiceFullDetails;

    routeParamsSubscription: Subscription;

    product: IProduct = null;

    constructor(injector: Injector) {
        super(injector)
    };

    getWholePrice():string{
        var price=0;
        this.fullIvoice.invoice_items.map(item => price+= item.unit_price);

        return price.toString().substring(0,price.toString().indexOf('.')+3);
    }

    ngOnInit(): void {
        this.blockUI();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["product"];
            this.invoiceId = params["invoice"];
            this.refresh();
            this.unblockUI();
        });

    }



    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }



    refresh():void{
        this.blockUI();

        this.backendService.getInvoice(this.invoiceId).then(invoice =>{
            this.fullIvoice = invoice;
            this.unblockUI();
        }).catch(error =>{

            this.unblockUI();
        })

        this.backendService.getAllProducts().then(products =>{
            this.product = products.find(product => product.id == this.id );
            this.unblockUI();
        }).catch(error =>{

            this.unblockUI();
        })

    }
}