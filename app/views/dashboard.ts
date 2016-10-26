/**
 * Created by davidhradek on 03.08.16.
 */

import {Component, Injector, OnInit} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {
    IApplicableProduct, IGeneralTariff,
    IAdditionalPackage, IProject
} from "../backend/TyrionAPI";
import {FlashMessageError} from "../services/FlashMessagesService";

@Component({
    selector: "view-dashboard",
    directives: [LayoutMain],
    templateUrl: "app/views/dashboard.html"
})
export class DashboardComponent extends BaseMainComponent implements OnInit {

    products: IApplicableProduct[];

    tariffForRegistration:IGeneralTariff[];

    packageForRegistration:IAdditionalPackage[];

    projects:IProject[];

    noProducts = true;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh():void{
        this.backendService.getAllProjects()
            .then(projects => this.projects = projects)
            .catch(reason => this.addFlashMessage(new FlashMessageError("Projects cannot be loaded.", reason)));

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



  registerTariff(tarrif:IGeneralTariff):void {
      this.router.navigate(["/productRegistration", tarrif.identificator])
    }




    }




