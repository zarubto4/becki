/**
 * Created by dominik krisztof on 22/09/16.
 */

import {Component, Injector, OnInit} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {IApplicableProduct, IIndividualsTariff, IAdditionalPackage} from "../backend/TyrionAPI";
import {FlashMessageSuccess, FlashMessageWarning, FlashMessageError} from "../services/FlashMessagesService";
import {FormGroup, Validators, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {BeckiValidators} from "../helpers/BeckiValidators";
import {BeckiFormSelectOption, beckiFormSelectOptionsMaker} from "../components/BeckiFormSelect";

@Component({
    selector: "product-registration",
    directives: [LayoutMain, REACTIVE_FORM_DIRECTIVES],
    templateUrl: "app/views/product-registration.html"
})
export class ProductRegistrationComponent extends BaseMainComponent implements OnInit {

    form: FormGroup;

    tariffForRegistration: IIndividualsTariff[];

    packageForRegistration: IAdditionalPackage[];

    isCompany:boolean = false;

    toggleIsCompany() {
        this.isCompany = !this.isCompany;
        Object.keys(this.form.controls).forEach((key)=>{
            this.form.controls[key].updateValueAndValidity();
        });
    }

    options:BeckiFormSelectOption[] = [{label:"CZK",value:"CZK"},{label:"EUR",value:"EUR"}];

    constructor(injector: Injector) {
        super(injector);


        this.form = this.formBuilder.group({ //TODO vybrat z tohodle to, co není povinný a co je provinný pro company a podle toho se zařídít
            "city": ["", [Validators.required, Validators.minLength(5)]],

            "company_authorized_email": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.required), BeckiValidators.condition(()=>this.isCompany, Validators.minLength(4))]], //company only

            "company_authorized_phone": ["", [BeckiValidators.condition(()=>this.isCompany,Validators.minLength(4)),BeckiValidators.condition(()=>this.isCompany,BeckiValidators.number)]], //company only

            "company_invoice_email": ["", [BeckiValidators.condition(()=>this.isCompany,Validators.minLength(4)),BeckiValidators.condition(()=>this.isCompany, BeckiValidators.email)]], //company only

            "company_name": ["", [BeckiValidators.condition(()=>this.isCompany,Validators.minLength(4))]], //company only

            "company_web": ["", [BeckiValidators.condition(()=>this.isCompany,Validators.minLength(4))]], //company only

            "country": ["", [Validators.required]],

            "currency_type": [""],

            //??

            "payment_method": ["", [Validators.required]], //     * @description Required: only in if required_payment_mode is true  values =>[bank, credit_card]
            //??

            "payment_mode": ["", [Validators.required]], //only if is requred payment is true

            "product_individual_name": ["", [Validators.required, Validators.minLength(5)]],

            //??
            "registration_no": ["", [Validators.required]], //Required: only if account is businessThe company_registration_no must have at least

            "street": ["", [Validators.required, Validators.minLength(5)]],

            "street_number": [""],

            "tariff_type": [""], //??

            //??
            "vat_number": ["", [Validators.required]], //Required: only if account is business & from EU!!! CZ28496639 The VAT_number must have at least 4 characters

            "zip_code": ["", [Validators.required, Validators.minLength(5)]],

        })
    };

    ngOnInit(): void {
        this.backendService.getAllTarifsForRegistrations()
            .then(products => {
                this.tariffForRegistration = products.tariffs;
                this.packageForRegistration = products.packages;
            })
            .catch(error => console.log(error))
    }


    onSubmitClick(): void {
                this.backendService.createTarif({
                    tariff_type: this.form.controls["tariff_type"].value,
                    product_individual_name: this.form.controls["product_individual_name"].value,
                    currency_type: this.form.controls["currency_type"].value,
                    payment_mode: this.form.controls["payment_mode"].value,
                    payment_method: this.form.controls["payment_method"].value,
                    street: this.form.controls["street"].value,
                    street_number: this.form.controls["street_number"].value,
                    city: this.form.controls["city"].value,
                    zip_code: this.form.controls["zip_code"].value,
                    country: this.form.controls["country"].value,
                    registration_no: this.form.controls["registration_no"].value,
                    vat_number: this.form.controls["vat_number"].value,
                    company_name: this.form.controls["company_name"].value,
                    company_authorized_email: this.form.controls["company_authorized_email"].value,
                    company_authorized_phone: this.form.controls["company_authorized_phone"].value,
                    company_web: this.form.controls["company_web"].value,
                    company_invoice_email: this.form.controls["company_invoice_email"].value,
                })
                    .then(tarif => {
                        if (tarif.gw_url) {
                            this.flashMessagesService.addFlashMessage(new FlashMessageWarning("Product was created but payment is requred, click", "<a href={{(IGoPayUrl)response.gw_url}}>here</a>"));
                        } else {
                            this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("Product was created, now you can create a new project"));
                        }
                    })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The product cannot be bought.`, reason));
            })
    }
}





