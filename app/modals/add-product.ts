/**
 * Created by dominikkrisztof on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, OnInit} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {BackendService} from "../services/BackendService";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {ModalModel} from "../services/ModalService";
import {BeckiValidators} from "../helpers/BeckiValidators";


export class ModalsAddProductModel implements ModalModel {
    constructor(public tariff_type: string = "", public product_individual_name: string = "", public currency_type: string = "", public payment_mode: string = "", public payment_method: string = "", public street: string = "", public street_number: string = "", public city: string = "", public zip_code: string = "", public country: string = "", public registration_no: string = "", public vat_number: string = "", public company_name: string = "", public company_authorized_email: string = "", public company_authorized_phone: string = "", public company_web: string = "", public company_invoice_email: string = "") {
    }
}


@Component({
    selector: "modals-add-product",
    templateUrl: "app/modals/add-product.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput]
})

export class ModalsAddProductComponent implements OnInit {

    @Input()
    modalModel: ModalsAddProductModel;


    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    isCompany: boolean = false;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {


        this.form = this.formBuilder.group({ //TODO vybrat z tohodle to, co není povinný a co je provinný pro company a podle toho se zařídít
            "city": ["", [Validators.required, Validators.minLength(4)]],

            "company_authorized_email": ["", [Validators.minLength(4)]], //company only

            "company_authorized_phone": ["", [Validators.minLength(4),BeckiValidators.number]], //company only

            "company_invoice_email": ["", [Validators.minLength(4), BeckiValidators.email]], //company only

            "company_name": ["", [Validators.minLength(4)]],

            "company_web": ["", [Validators.minLength(4)]],

            "country": ["", [Validators.required]],

            "currency_type": [""],

            //??

            "payment_method": ["", [Validators.required]], //     * @description Required: only in if required_payment_mode is true  values =>[bank, credit_card]
            //??

            "payment_mode": ["", [Validators.required]], //only if is requred payment is true

            "product_individual_name": ["", [Validators.required, Validators.minLength(4)]],

            //??
            "registration_no": ["", [Validators.required]], //Required: only if account is businessThe company_registration_no must have at least

            "street": ["", [Validators.required, Validators.minLength(4)]],

            "street_number": [""],

            "tariff_type": [""], //??

            //??
            "vat_number": ["", [Validators.required]], //Required: only if account is business & from EU!!! CZ28496639 The VAT_number must have at least 4 characters

            "zip_code": ["", [Validators.required, Validators.minLength(4)]],

        })
    }

    ngOnInit() {
        (<FormControl>(this.form.controls["tariff_type"])).setValue(this.modalModel.tariff_type);
        (<FormControl>(this.form.controls["product_individual_name"])).setValue(this.modalModel.product_individual_name);
        (<FormControl>(this.form.controls["currency_type"])).setValue(this.modalModel.currency_type);
        (<FormControl>(this.form.controls["payment_mode"])).setValue(this.modalModel.payment_mode);
        (<FormControl>(this.form.controls["payment_method"])).setValue(this.modalModel.payment_method);
        (<FormControl>(this.form.controls["street"])).setValue(this.modalModel.street);
        (<FormControl>(this.form.controls["street_number"])).setValue(this.modalModel.street_number);
        (<FormControl>(this.form.controls["city"])).setValue(this.modalModel.city);
        (<FormControl>(this.form.controls["zip_code"])).setValue(this.modalModel.zip_code);
        (<FormControl>(this.form.controls["country"])).setValue(this.modalModel.country);
        (<FormControl>(this.form.controls["registration_no"])).setValue(this.modalModel.registration_no);
        (<FormControl>(this.form.controls["vat_number"])).setValue(this.modalModel.vat_number);
        (<FormControl>(this.form.controls["company_name"])).setValue(this.modalModel.company_name);
        (<FormControl>(this.form.controls["company_authorized_email"])).setValue(this.modalModel.company_authorized_email);
        (<FormControl>(this.form.controls["company_authorized_phone"])).setValue(this.modalModel.company_authorized_phone);
        (<FormControl>(this.form.controls["company_web"])).setValue(this.modalModel.company_web);
        (<FormControl>(this.form.controls["company_invoice_email"])).setValue(this.modalModel.company_invoice_email);
    }

    onSubmitClick(): void {
        this.modalModel.tariff_type = this.form.controls["tariff_type"].value;
        this.modalModel.product_individual_name = this.form.controls["product_individual_name"].value;
        this.modalModel.currency_type = this.form.controls["currency_type"].value;
        this.modalModel.payment_mode = this.form.controls["payment_mode"].value;
        this.modalModel.payment_method = this.form.controls["payment_method"].value;
        this.modalModel.street = this.form.controls["street"].value;
        this.modalModel.street_number = this.form.controls["street_number"].value;
        this.modalModel.city = this.form.controls["city"].value;
        this.modalModel.zip_code = this.form.controls["zip_code"].value;
        this.modalModel.country = this.form.controls["country"].value;
        this.modalModel.registration_no = this.form.controls["registration_no"].value;
        this.modalModel.vat_number = this.form.controls["vat_number"].value;
        this.modalModel.company_name = this.form.controls["company_name"].value;
        this.modalModel.company_authorized_email = this.form.controls["company_authorized_email"].value;
        this.modalModel.company_authorized_phone = this.form.controls["company_authorized_phone"].value;
        this.modalModel.company_web = this.form.controls["company_web"].value;
        this.modalModel.company_invoice_email = this.form.controls["company_invoice_email"].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
