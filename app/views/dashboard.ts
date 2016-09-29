/**
 * Created by davidhradek on 03.08.16.
 */

import {Component, Injector, OnInit} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {BeckiBackend} from "../backend/BeckiBackend";
import {
    IApplicableProduct, ITariff, IGoPayUrl, IProduct, IIndividualsTariff,
    IAdditionalPackage
} from "../backend/TyrionAPI";
import {FlashMessageSuccess, FlashMessageWarning, FlashMessageError} from "../services/FlashMessagesService";

@Component({
    selector: "view-dashboard",
    directives: [LayoutMain],
    templateUrl: "app/views/dashboard.html"
})
export class DashboardComponent extends BaseMainComponent implements OnInit {

    products: IApplicableProduct[];

    tariffForRegistration:IIndividualsTariff[];

    packageForRegistration:IAdditionalPackage[];

    noProducts = true;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh():void{
        this.backendService.getAllTarifsUserApplicables().then(products => {
            this.products = products;
        });
        if (typeof this.products === null) {
            this.noProducts = true;
        }else{
            this.noProducts = false;
        }
        this.backendService.getAllTarifsForRegistrations()
            .then(products => {
                this.tariffForRegistration=products.tariffs;
                this.packageForRegistration=products.packages;
            })
            .catch(error => console.log(error))
    }



  registerTariff(tarrif:IIndividualsTariff):void {
      this.router.navigate(["/productRegistration", tarrif.identificator])
    }




    }




