/**
  ~ © 2016 Becki Authors. See the AUTHORS file found in the top-level
  ~ directory of this distribution.
*/

/**
 * Created by dominik krisztof on 22/09/16.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IGeneralTariff, ITariffRegister, IGeneralTariffExtensions } from '../backend/TyrionAPI';
import { FlashMessageSuccess, FlashMessageWarning, FlashMessageError } from '../services/NotificationService';
import { FormGroup, Validators } from '@angular/forms';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { Subscription } from 'rxjs';
import { StaticOptionLists } from '../helpers/StaticOptionLists';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';

@Component({
    selector: 'bk-view-product-registration',
    templateUrl: './financial-product-registration.html'
})
export class ProductRegistrationComponent extends BaseMainComponent implements OnInit {

    form: FormGroup;

    routeParamsSubscription: Subscription;

    tariffForRegistration: IGeneralTariff[];

    serverResponse: any;

    step: number;

    activeClass: { [key: string]: boolean } = {};

    selectedExtensions: IGeneralTariffExtensions[] = [];

    selectedTariff: IGeneralTariff;

    userCompany: boolean = false;

    inEu: boolean = false;

    countryList: FormSelectComponentOption[] = StaticOptionLists.countryList;

    payment_method: FormSelectComponentOption[];
    payment_mode: FormSelectComponentOption[];
    currency_type: FormSelectComponentOption[];

    constructor(injector: Injector) {
        super(injector);

        this.step = 1;

    };

    stepClick(step: number, fromUser: boolean): void {
        if (fromUser && step > this.step) {
            this.addFlashMessage(new FlashMessageError('You have to choose a tariff'));
            return;
        }
        this.step = step;
    }

    getWholePrice(): string {
        let price = 0;
        price += this.selectedTariff.price.EUR;
        this.selectedExtensions.map(pack => price += pack.price.EUR);

        return price.toString().substring(0, price.toString().indexOf('.') + 3);
    }
    ngOnInit(): void {
        this.blockUI();

        this.backendService.getAllTarifsForRegistrations()
            .then(tariffs => {
                this.tariffForRegistration = tariffs;
                // console.log(tariffs);
            }).then(() => {
                this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
                    if (params.hasOwnProperty('tariff') && this.tariffForRegistration.find(tariff => tariff.identificator === params['tariff'])) {
                        this.step = 2;
                    } else {
                        this.step = 1;
                    }
                    this.unblockUI();
                });
            }).catch(error => {
                // console.log(error);
                this.unblockUI();
            });


    }




    chooseTariff(tariff: IGeneralTariff): void {
        this.selectedTariff = tariff;

        this.payment_method = [];
        this.payment_mode = [];
        this.selectedExtensions = [];
        this.currency_type = [];
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
        // console.log(tariff.extensions);


        this.currency_type = [{ label: 'CZK', value: 'CZK' }, { label: 'EUR', value: 'EUR' }]; // TODO pak smazat až bude měna dodávána

        let input: { [key: string]: any; } = {
            'city': ['', [Validators.required, Validators.minLength(5)]],

            'country': ['', [Validators.required, Validators.minLength(4)]],

            'product_individual_name': ['', [Validators.required, Validators.minLength(5)]],

            'street': ['', [Validators.required, Validators.minLength(5)]],

            'street_number': ['', [Validators.required, BeckiValidators.number]],

            'tariff_type': [tariff.id], // TODO nemá toto být bokem? páč se jedná o hodnotu se kterou uživatel nepracuje a ani se mu nezobrazuje

            'zip_code': ['', [Validators.required, Validators.minLength(5)]],

            'extensions_ids': ['', ],

        };

        if (this.selectedTariff.required_payment_method) {

            input['payment_method'] = ['', [Validators.required]]; // * @description Required: only in if required_payment_mode is truevalues =>[bank, credit_card]

        }
        if (this.selectedTariff.required_payment_mode) {

            input['currency_type'] = ['', [Validators.required]];

            input['payment_mode'] = ['', [Validators.required]]; // only if is requred payment is true


        }

        if (this.selectedTariff.company_details_required || this.userCompany) {

            input['company_authorized_email'] = ['', [Validators.required, Validators.minLength(4), BeckiValidators.email]]; // company only

            input['company_authorized_phone'] = ['', [Validators.minLength(4), BeckiValidators.number]]; // company only

            input['company_invoice_email'] = ['', [Validators.minLength(4), BeckiValidators.email]]; // company only

            input['company_name'] = ['', [Validators.minLength(4)]]; // company only

            input['company_web'] = ['', [Validators.minLength(4)]]; // company only

            input['registration_no'] = ['', [BeckiValidators.condition(() => !this.inEu, Validators.required)]];

            input['vat_number'] = [
                '',
                [BeckiValidators.condition(() => this.inEu, Validators.required)],
                BeckiAsyncValidators.condition(() => this.inEu, BeckiAsyncValidators.validateEntity(this.backendService, 'vat_number'))
            ]; // GB365684514 např.

        }
        this.form = null;
        this.form = this.formBuilder.group(input);
        this.step = 2;

    }

    addExtension(selected: IGeneralTariffExtensions): void {
        if (this.selectedExtensions.indexOf(selected) > -1) {
            let index = this.selectedExtensions.indexOf(selected);
            this.selectedExtensions.splice(index, 1);              // not supported in Internet Explorer 7 and 8. but did we want users who still uses IE7/8?
        } else {
            this.selectedExtensions.push(selected);
        }
    }

    checkInEu(): void {
        let country = this.countryList.find(fCountry => this.form && fCountry.value === this.form.controls['country'].value);
        this.inEu = country ? country.data : null;

        this.form.controls['registration_no'].updateValueAndValidity();
        this.form.controls['vat_number'].updateValueAndValidity();

    }

    onSubmitClick(): void {
        this.blockUI();

        let tariffData: any = {
            tariff_id: this.form.controls['tariff_type'].value,
            product_individual_name: this.form.controls['product_individual_name'].value,

            street: this.form.controls['street'].value,
            street_number: this.form.controls['street_number'].value,
            city: this.form.controls['city'].value,
            zip_code: this.form.controls['zip_code'].value,
            country: this.form.controls['country'].value,
            currency_type: this.form.controls['currency_type'].value,

            extensions_ids: this.form.controls['extensions_ids'].value, // TODO vložit sem hodnotu z pole
        };


        if (this.selectedTariff.required_payment_method) {
            let payMethodTariffData: any = {
                payment_method: this.form.controls['payment_method'].value,
            };

            tariffData = Object.assign(tariffData, payMethodTariffData);
        }
        if (this.selectedTariff.required_payment_mode) {
            let payModeTariffData: any = {

                payment_mode: this.form.controls['payment_mode'].value,
            };

            tariffData = Object.assign(tariffData, payModeTariffData);
        }

        if (this.inEu) {
            let companyTariffData: any = {
                vat_number: this.form.controls['vat_number'].value
            };
            tariffData = Object.assign(tariffData, companyTariffData);
        } else {
            let companyTariffData: any = {

                registration_no: this.form.controls['registration_no'].value
            };
            tariffData = Object.assign(tariffData, companyTariffData);

        }

        if (this.selectedTariff.company_details_required) {
            let companyTariffData: any = {

                company_name: this.form.controls['company_name'].value,
                company_authorized_email: this.form.controls['company_authorized_email'].value,
                company_authorized_phone: this.form.controls['company_authorized_phone'].value,
                company_web: this.form.controls['company_web'].value,
                company_invoice_email: this.form.controls['company_invoice_email'].value,
            };
            tariffData = Object.assign(tariffData, companyTariffData);

        }


        // console.log(tariffData);


        this.backendService.createProduct(<ITariffRegister>tariffData)
            .then(tarif => {
                this.unblockUI();
                this.serverResponse = tarif;
                if ((<any>tarif).gw_url) { // TODO podle čísla HTTP hlavičky se vrací 3 typy
                    this.addFlashMessage(new FlashMessageWarning('Product was created but payment is required, click', '<a href={{(IGoPayUrl)response.gw_url}}>here</a>'));
                    this.router.navigate(['/financial']);
                } else {
                    this.addFlashMessage(new FlashMessageSuccess('Product was created, now you can create a new project'));
                    this.router.navigate(['/financial']);
                }
            })
            .catch(reason => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(`The product cannot be bought.`, reason));
            });
    }
}





