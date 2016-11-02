/**
 * Created by dominik krisztof on 22/09/16.
 */

import {Component, Injector, OnInit} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {IGeneralTariff, IAdditionalPackage} from "../backend/TyrionAPI";
import {FlashMessageSuccess, FlashMessageWarning, FlashMessageError} from "../services/FlashMessagesService";
import {FormGroup, Validators} from "@angular/forms";
import {BeckiValidators} from "../helpers/BeckiValidators";
import {BeckiFormSelectOption} from "../components/BeckiFormSelect";
import {Subscription} from "rxjs";
import {StaticOptionLists} from "../helpers/StaticOptionLists";

@Component({
    selector: "product-registration",
    templateUrl: "app/views/product-registration.html"
})
export class ProductRegistrationComponent extends BaseMainComponent implements OnInit {

    form: FormGroup;

    routeParamsSubscription: Subscription;

    tariffForRegistration: IGeneralTariff[];

    packageForRegistration: IAdditionalPackage[];

    serverResponse: any;

    step: number;


    isCompany: boolean = false;

    paymentNeed: boolean = false;

    activeClass: {[key: string]: boolean} = {};

    toggleIsCompany() {
        this.isCompany = !this.isCompany;
        Object.keys(this.form.controls).forEach((key)=> {
            this.form.controls[key].updateValueAndValidity();
        });
    }

    countryList: BeckiFormSelectOption[] = StaticOptionLists.countryList;


    payment_method: BeckiFormSelectOption[];
    payment_mode: BeckiFormSelectOption[];
    currency_type: BeckiFormSelectOption[];

    constructor(injector: Injector) {
        super(injector);

        this.step = 1;

    };

    stepClick(step: number): void {
        if (step == 2 && this.form.controls["tariff_type"].value == null) {
            this.flashMessagesService.addFlashMessage(new FlashMessageError("You have to choose a tariff"));
            return;
        }
        this.step = step;
    }

    ngOnInit(): void {


        this.backendService.getAllTarifsForRegistrations()
            .then(products => {
                this.tariffForRegistration = products.tariffs;
                this.packageForRegistration = products.packages;
            }).then(()=> {
            this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
                if (params.hasOwnProperty("tariff") && this.tariffForRegistration.find(tariff => {
                        if (tariff.identificator == params["tariff"]) {
                            this.chooseTariff(tariff);
                            return true;
                        }
                    })) {
                    this.step = 2;
                } else {
                    this.step = 1;
                }
            })

        })
            .catch(error => console.log(error))


    }

    chooseTariff(tariff: IGeneralTariff): void {

        this.payment_method = [];
        this.payment_mode = [];
        tariff.payment_methods.map(method => this.payment_method.push({
            label: method.user_description,
            value: method.json_identificator
        }));
        tariff.payment_modes.map(method => this.payment_mode.push({
            label: method.user_description,
            value: method.json_identificator
        }));
        /* tariff.price.map(method => this.currency_type.push( //TODO https://youtrack.byzance.cz/youtrack/issue/TYRION-397
        /*    label: method.user_description,
            value: method.json_identificator
        })); */


        this.paymentNeed = tariff.required_payment_mode;
        this.isCompany = tariff.company_details_required;

        var input: {[key: string]: any;} = {
            "city": ["", [Validators.required, Validators.minLength(5)]],

            "country": ["", [Validators.required, Validators.minLength(4)]],

            "product_individual_name": ["", [Validators.required, Validators.minLength(5)]],

            "street": ["", [Validators.required, Validators.minLength(5)]],

            "street_number": ["", [Validators.required, BeckiValidators.number]],

            "tariff_type": [tariff.identificator], //TODO nemá toto být bokem? páč se jedná o hodnotu se kterou uživatel nepracuje a ani se mu nezobrazuje

            "zip_code": ["", [Validators.required, Validators.minLength(5)]],

        };

        if (this.paymentNeed) {

            input["currency_type"] = ["", [Validators.required]];

            input["payment_method"] = ["", [Validators.required]];// * @description Required: only in if required_payment_mode is truevalues =>[bank, credit_card]

            input["payment_mode"] = ["", [Validators.required]];//only if is requred payment is true
        }

        if (this.isCompany) {

            input["company_authorized_email"] = ["", [Validators.required, this.isCompany, Validators.minLength(4)]]; //company only

            input["company_authorized_phone"] = ["", [Validators.minLength(4), BeckiValidators.number]]; //company only

            input["company_invoice_email"] = ["", [Validators.minLength(4), BeckiValidators.email]]; //company only

            input["company_name"] = ["", [Validators.minLength(4)]]; //company only

            input["company_web"] = ["", [Validators.minLength(4)]]; //company only

            input["registration_no"] = ["", [Validators.required]]; //Required: only if account is businessThe company_registration_no must have at least

            input["vat_number"] = ["", [Validators.required]]; //Required: only if account is business & from EU!!! CZ28496639 The VAT_number must have at least 4 characters
        }

        this.form = this.formBuilder.group(input);
        this.step = 2;
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
                this.step = 3;
                this.serverResponse = tarif;
                if ((<any>tarif).gw_url) {
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





