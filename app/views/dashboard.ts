/**
 * Created by davidhradek on 03.08.16.
 */

import {Component, Injector, OnInit} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {IApplicableProduct, IGeneralTariff, IAdditionalPackage, IProject} from "../backend/TyrionAPI";
import {FlashMessageError} from "../services/FlashMessagesService";

@Component({
    selector: "view-dashboard",
    templateUrl: "app/views/dashboard.html"
})
export class DashboardComponent extends BaseMainComponent implements OnInit {

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
    }


}




