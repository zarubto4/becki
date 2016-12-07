/**
 * Created by dominik.krisztof on 01.12.16.
 */
/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {OnInit, Component, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {IProduct, IInvoice} from "../backend/TyrionAPI";
import {Subscription} from "rxjs";


@Component({
    selector: "view-financial-product-invoices",
    templateUrl: "app/views/financial-product-invoices.html"
})
export class FinancialProductInvoicesComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: number;

    routeParamsSubscription: Subscription;

    product: IProduct = null;

    mocinvoice: IInvoice[] =[{date_of_create: "11.5.2016", id: 445, invoice_number: "dkiodifj45", payment_method: "bank", payment_status: "pay", pdf_link: "www.google.com", require_payment: true},{date_of_create: "11.5.2016", id: 445, invoice_number: "dkiodifj45", payment_method: "credit", payment_status: "pay", pdf_link: "www.google.com", require_payment: true},{date_of_create: "11.5.2016", id: 445, invoice_number: "dkiodifj45", payment_method: "bank", payment_status: "pay", pdf_link: "www.google.com", require_payment: false}];


    constructor(injector: Injector) {
        super(injector)
    };

    onAddCreditsClick():void{

    }

    onInvoiceClick(invoice:IInvoice):void{
        this.router.navigate(["financial",this.id,"invoices",invoice.id]); //todo špatně routuje
    }

    onPayClick(invoice:IInvoice):void{

    }

    onDownloadPDFClick():void{

    }
    onSendClick():void{

    }
    onPrintClick():void{

    }
    onSettingsClick():void{

    }

    ngOnInit(): void {
        this.blockUI();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["product"];
            this.refresh();
            this.unblockUI();
        });

    }



    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }



    refresh():void{
        this.blockUI();
        this.backendService.getAllProducts().then(products =>{
            this.product = products.find(product => product.id == this.id );
            console.log(this.product);
            this.unblockUI();
        }).catch(error =>{

            this.unblockUI();
        })

    }
}