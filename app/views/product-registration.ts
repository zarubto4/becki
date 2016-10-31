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


    payment_method: BeckiFormSelectOption[] = [{label: "I want it free", value: "free"}];
    payment_mode: BeckiFormSelectOption[] = [{label: "I want it free", value: "free"}];
    options: BeckiFormSelectOption[] = [{label: "CZK", value: "CZK"}, {label: "EUR", value: "EUR"}];

    constructor(injector: Injector) {
        super(injector);

        this.step = 1;

        this.form = this.formBuilder.group({
            "city": ["", [Validators.required, Validators.minLength(5)]],

            "company_authorized_email": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.required), BeckiValidators.condition(()=>this.isCompany, Validators.minLength(4))]], //company only

            "company_authorized_phone": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.minLength(4)), BeckiValidators.condition(()=>this.isCompany, BeckiValidators.number)]], //company only

            "company_invoice_email": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.minLength(4)), BeckiValidators.condition(()=>this.isCompany, BeckiValidators.email)]], //company only

            "company_name": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.minLength(4))]], //company only

            "company_web": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.minLength(4))]], //company only

            "country": ["", [Validators.required, Validators.minLength(4)]],

            "vat_number": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.required)]], //Required: only if account is business & from EU!!! CZ28496639 The VAT_number must have at least 4 characters

            "currency_type": ["", [Validators.required]],

            "payment_method": ["", [Validators.required]], // * @description Required: only in if required_payment_mode is truevalues =>[bank, credit_card]

            "payment_mode": ["", [Validators.required]], //only if is requred payment is true

            "product_individual_name": ["", [Validators.required, Validators.minLength(5)]],

            "registration_no": ["", [BeckiValidators.condition(()=>this.isCompany, Validators.required)]], //Required: only if account is businessThe company_registration_no must have at least

            "street": ["", [Validators.required, Validators.minLength(5)]],

            "street_number": ["", [Validators.required, BeckiValidators.number]],

            "tariff_type": [""], //??

            "zip_code": ["", [Validators.required, Validators.minLength(5)]],

        })
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
                            return true;
                        }
                    })) {
                    this.checkPaymentModeDetails(params["tariff"]);
                    this.step = 2;
                } else {
                    this.step = 1;
                }
            })

        })
            .catch(error => console.log(error))


    }

    checkPaymentModeDetails(tarifIdentificator: String): void {
        this.form.controls["tariff_type"].setValue(tarifIdentificator);
        this.tariffForRegistration.find(pay => {
            this.payment_method = [];
            this.payment_mode = [];
            pay.payment_methods.map(method => this.payment_method.push({
                label: method.user_description,
                value: method.json_identificator
            }));
            pay.payment_modes.map(method => this.payment_mode.push({
                label: method.user_description,
                value: method.json_identificator
            }));
            if (pay.identificator == this.form.controls["tariff_type"].value) {
                this.paymentNeed = pay.required_payment_mode;
                this.isCompany = pay.company_details_required;
            } else {
                return false;
            }
        })
    }


    chooseTariff(tariff: IGeneralTariff): void {
        this.checkPaymentModeDetails(tariff.identificator);
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





