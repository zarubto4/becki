import { Response } from '@angular/http';

/**
  ~ © 2016 Becki Authors. See the AUTHORS file found in the top-level
  ~ directory of this distribution.
*/

/**
 * Created by dominik krisztof on 22/09/16.
 */

import { Component, OnInit, Injector } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IGeneralTariff, IGeneralTariffExtensions, ITariffRegister, IGoPayUrl } from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageWarning, FlashMessageSuccess } from '../services/NotificationService';
import { FormGroup, Validators } from '@angular/forms';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { Subscription } from 'rxjs';
import { StaticOptionLists } from '../helpers/StaticOptionLists';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { ModalsGopayInlineModel, ModalsGopayInlineComponent } from '../modals/gopay-inline';

@Component({
    selector: 'bk-view-product-registration',
    templateUrl: './financial-product-registration.html'
})
export class ProductRegistrationComponent extends BaseMainComponent implements OnInit {

    form: FormGroup;

    routeParamsSubscription: Subscription;

    step: number = 1;

    tariffs: IGeneralTariff[];

    selectedTariff: IGeneralTariff;

    selectedExtensions: IGeneralTariffExtensions[] = [];

    

    inEu: boolean = false;

    countryList: FormSelectComponentOption[] = StaticOptionLists.countryList;

    payment_method: FormSelectComponentOption[];
    payment_mode: FormSelectComponentOption[];
    currency_type: FormSelectComponentOption[];

    constructor(injector: Injector) {
        super(injector);
    };

    getWholePrice(): string {
        let price = 0;
        price += this.selectedTariff.price.USD;
        this.selectedExtensions.map(pack => price += pack.price.USD);

        return price.toString().substring(0, price.toString().indexOf('.') + 3);
    }

    ngOnInit(): void {
        this.blockUI();

        this.backendService.getAllTarifsForRegistrations()
            .then(tariffs => {
                this.tariffs = tariffs;
                // console.log(tariffs);
                
                this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {

                    console.log(params);

                    if (params.hasOwnProperty('tariff')) {
                        let t = this.tariffs.find(tariff => tariff.identificator === params['tariff']);
                        if (t) {
                            this.chooseTariff(t);
                        } else {
                            this.fmError("Wanted tariff not found.");
                            this.router.navigate(['/financial/product-registration']);
                        }
                    }

                    if (params.hasOwnProperty('step')) {

                        let step = parseInt(params['step'], 10) || 1;

                        if (step == 1) {
                            this.router.navigate(['/financial/product-registration']);
                        } else {
                            if (this.canActivateStep(step)) {
                                this.step = step;
                            } else {
                                this.router.navigate(['/financial/product-registration', {step: 1}]);
                            }
                        }

                    } else {
                        this.step = 1;
                    }
                    
                    this.unblockUI();
                });

            }).catch(error => {
                this.fmError('Cannot load tariffs.', error);
                this.unblockUI();
            });

    }

    canActivateStep(step:number) {
        if (step == 1) {
            return true;
        }

        if (this.selectedTariff) {
            if (step == 2) {
                return true;
            }

            if (step == 3) {
                return true;
            }


        }

        return false;
    }

    stepClick(step: number): void {
        if (this.canActivateStep(step)) {
            if (step == 1) {
                this.router.navigate(['/financial/product-registration']);
            } else {
                this.router.navigate(['/financial/product-registration', {step: step}]);
            }
        }
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


        this.currency_type = [{ label: 'USD', value: 'USD' }]; // TODO pak smazat až bude měna dodávána

        let input: { [key: string]: any; } = {
            'city': ['', [Validators.required, Validators.minLength(5)]],

            'country': ['', [Validators.required, Validators.minLength(4)]],

            'product_individual_name': ['', [Validators.required, Validators.minLength(5)]],

            'street': ['', [Validators.required, Validators.minLength(5)]],

            'street_number': ['', [Validators.required, BeckiValidators.number]],

            'tariff_type': [tariff.id],

            'zip_code': ['', [Validators.required, Validators.minLength(5)]],

            'extensions_ids': [''],

        };

        if (this.selectedTariff.required_payment_method) {

            input['payment_method'] = ['', [Validators.required]]; // * @description Required: only in if required_payment_mode is truevalues =>[bank, credit_card]

        }
        if (this.selectedTariff.required_payment_mode) {

            input['currency_type'] = ['', [Validators.required]];

            input['payment_mode'] = ['', [Validators.required]]; // only if is requred payment is true


        }

        if (this.selectedTariff.company_details_required) {

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

        this.router.navigate(['/financial/product-registration', {step:2}]);

    }

    addExtension(selected: IGeneralTariffExtensions): void {
        if (this.selectedExtensions.indexOf(selected) == -1) {
            this.selectedExtensions.push(selected);
        }
    }

    removeExtension(selected: IGeneralTariffExtensions): void {
        if (this.selectedExtensions.indexOf(selected) > -1) {
            let index = this.selectedExtensions.indexOf(selected);
            this.selectedExtensions.splice(index, 1); // not supported in Internet Explorer 7 and 8. but did we want users who still uses IE7/8?
        }
    }

    checkInEu(): void {
        if (this.selectedTariff.company_details_required) {
            let country = this.countryList.find(fCountry => this.form && fCountry.value === this.form.controls['country'].value);
            this.inEu = country ? country.data : null;

            this.form.controls['registration_no'].updateValueAndValidity();
            this.form.controls['vat_number'].updateValueAndValidity();
        }
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
            extensions_ids: '[' + this.selectedExtensions.forEach(extension => { return extension.id + ', '; }) + ']',
            // TODO vylepšit extensions_ids, co udělat pokud je pole prázdné? jak udělat aby poslední objekt nepřidával čárku?
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


        if (this.selectedTariff.company_details_required) {
            let companyTariffData;
            if (this.inEu) {
                companyTariffData = {

                    company_name: this.form.controls['company_name'].value,
                    company_authorized_email: this.form.controls['company_authorized_email'].value,
                    company_authorized_phone: this.form.controls['company_authorized_phone'].value,
                    company_web: this.form.controls['company_web'].value,
                    company_invoice_email: this.form.controls['company_invoice_email'].value,
                    vat_number: this.form.controls['vat_number'].value,
                };
            } else {
                companyTariffData = {

                    company_name: this.form.controls['company_name'].value,
                    company_authorized_email: this.form.controls['company_authorized_email'].value,
                    company_authorized_phone: this.form.controls['company_authorized_phone'].value,
                    company_web: this.form.controls['company_web'].value,
                    company_invoice_email: this.form.controls['company_invoice_email'].value,
                    registration_no: this.form.controls['registration_no'].value,
                };
            }
            tariffData = Object.assign(tariffData, companyTariffData);
        }




        this.backendService.createProduct(<ITariffRegister>tariffData)
            .then(response => {
                if ((<any>response)._code_ === 200) {
                    this.addFlashMessage(new FlashMessageWarning('Product was created but payment is required'));
                    // modální okno ModalsGopayInlineModel bude potřebovat vylepšit
                    let model = new ModalsGopayInlineModel('Payment', (<IGoPayUrl>response).gw_url); // není jisté jestli gopayurl vrací to co má
                    this.modalService.showModal(model).then((success) => {
                        this.router.navigate(['/financial']);
                    });
                } else if ((<any>response)._code_ === 201) {
                    this.addFlashMessage(new FlashMessageSuccess('Product was created, now you can create a new project'));
                    this.router.navigate(['/financial']);
                }
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The product cannot be bought.`, reason));
            });
    }
}





