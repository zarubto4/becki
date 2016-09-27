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
import {ModalsAddProductModel} from "../modals/add-product";

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



  registerTariff():void {
        var model = new ModalsAddProductModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.createTarif({tariff_type: model.tariff_type, product_individual_name: model.product_individual_name, currency_type: model.currency_type, payment_mode: model.payment_mode, payment_method: model.payment_method, street: model.street, street_number: model.street_number, city: model.city, zip_code: model.zip_code, country: model.country, registration_no: model.registration_no, vat_number: model.vat_number, company_name: model.company_name, company_authorized_email: model.company_authorized_email, company_authorized_phone: model.company_authorized_phone, company_web: model.company_web, company_invoice_email: model.company_invoice_email,})
                    .then(tarif => {


                        /*
                         //TODO rozeznat, zda je response IProduct nebo IGoPayUrl a podle toho se zachovat
                         if(tarif.typeof = IProduct) {
                         this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("Product was created, now you can create a new project"));
                         }else if (tarif.typeof = IGoPayUrl){
                         this.flashMessagesService.addFlashMessage(new FlashMessageWarning("Product was created but payment is requred, click",null,<a href={{(IGoPayUrl)response.gw_url}}>here</a>));
                         }
                         })
                         */

                        this.addFlashMessage(new FlashMessageSuccess(`The product was bought.`));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(`The product cannot be bought.`, reason));
                        this.refresh();
                    });
            }
            this.refresh();
        });
    }




    }




