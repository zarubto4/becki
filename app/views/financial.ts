/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
/**
 * Created by dominik.krisztof on 02.11.16.
 */


import {Component, Injector, OnInit} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {IProduct} from "../backend/TyrionAPI";
import {FlashMessageError} from "../services/NotificationService";

@Component({
    selector: "view-financial",
    templateUrl: "app/views/financial.html"
})
export class FinancialComponent extends BaseMainComponent implements OnInit {

    products:IProduct[];

    test:boolean=false;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.refresh();
    }

    onProductClick():void{
        this.router.navigate(["/financial/Product"])
    }

    onAddProductClick():void{
        this.router.navigate(["/productRegistration"]);
    }

    refresh(): void {
        this.blockUI();
        this.backendService.getAllProducts()
            .then(products =>{
                this.products=products;
                this.unblockUI();
            })
            .catch(reason=>{
                this.addFlashMessage(new FlashMessageError("Projects cannot be loaded.", reason));
                this.unblockUI();
            })
    }
}




