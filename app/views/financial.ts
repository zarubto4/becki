/**
 * Created by dominik.krisztof on 02.11.16.
 */


import {Component, Injector, OnInit} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {IApplicableProduct, IGeneralTariff, IAdditionalPackage, IProject} from "../backend/TyrionAPI";
import {FlashMessageError} from "../services/FlashMessagesService";

@Component({
    selector: "view-financial",
    templateUrl: "app/views/financial.html"
})
export class FinancialComponent extends BaseMainComponent implements OnInit {



    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {

    }




}




