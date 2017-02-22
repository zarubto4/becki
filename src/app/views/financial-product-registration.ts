/**
  ~ © 2016 Becki Authors. See the AUTHORS file found in the top-level
  ~ directory of this distribution.
*/

/**
 * Created by dominik krisztof on 22/09/16.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IGeneralTariff, IGeneralTariffExtensions, ITariffRegister, IGoPayUrl } from '../backend/TyrionAPI';
import { FormGroup, Validators } from '@angular/forms';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { Subscription } from 'rxjs';
import { StaticOptionLists } from '../helpers/StaticOptionLists';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { GoPayLoaderService } from '../services/GoPayLoaderService';

@Component({
    selector: 'bk-view-product-registration',
    templateUrl: './financial-product-registration.html'
})
export class ProductRegistrationComponent extends BaseMainComponent implements OnInit, OnDestroy {

    form: FormGroup;

    routeParamsSubscription: Subscription;

    step: number = 1;

    tariffs: IGeneralTariff[];

    selectedTariff: IGeneralTariff;

    selectedExtensions: IGeneralTariffExtensions[] = [];

    inEu: boolean = false;

    optionsCountryList: FormSelectComponentOption[] = StaticOptionLists.countryList;

    optionsPaymentMethod: FormSelectComponentOption[] = [];
    optionsPaymentMode: FormSelectComponentOption[] = [];
    // optionsCurrencyType: FormSelectComponentOption[] = [{ label: 'USD', value: 'USD' }];

    goPayLoaderService: GoPayLoaderService;
    goPayLoaderServiceSubscription: Subscription;

    constructor(injector: Injector) {
        super(injector);
        this.goPayLoaderService = injector.get(GoPayLoaderService);
    };

    getTotalPrice(): number {
        let price = 0;
        price += this.selectedTariff.price.USD;
        this.selectedExtensions.map((pack) => {
            price += pack.price.USD;
        });

        return price;
    }

    makePrice(price: number): string {
        if (price === 0) {
            return 'Free';
        }
        if (Math.floor(price) === price) {
            return price + '$';
        } else {
            return price.toFixed(2) + '$';
        }
    }

    ngOnDestroy(): void {
        if (this.goPayLoaderServiceSubscription) {
            this.goPayLoaderServiceSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.blockUI();

        this.backendService.getAllTarifsForRegistrations()
            .then(tariffs => {
                this.tariffs = tariffs;
                // console.log(tariffs);

                this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {

                    if (params.hasOwnProperty('tariff')) {
                        let t = this.tariffs.find(tariff => tariff.identificator === params['tariff']);
                        if (t) {
                            this.chooseTariff(t);
                        } else {
                            this.fmError('Wanted tariff not found.');
                            this.router.navigate(['/financial/product-registration']);
                        }
                    }

                    if (params.hasOwnProperty('step')) {

                        let step = parseInt(params['step'], 10) || 1;

                        if (step === 1) {
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

    canActivateStep(step: number) {
        if (step === 1) {
            return true;
        }

        if (this.selectedTariff) {
            if (step === 2) {
                return true;
            }

            if (step === 3) {
                return true;
            }

            if (step === 4) {
                if (this.form.valid) {
                    return true;
                }
            }


        }

        return false;
    }

    stepClick(step: number): void {
        if (this.canActivateStep(step)) {
            if (step === 1) {
                this.router.navigate(['/financial/product-registration']);
            } else {
                this.router.navigate(['/financial/product-registration', {step: step}]);
            }
        }
    }

    stepClickElseTouchForm(step: number): void {
        if (this.canActivateStep(step)) {
            this.stepClick(step);
        } else {
            for (let key in this.form.controls) {
                if (!this.form.controls.hasOwnProperty(key)) {
                    continue;
                }
                this.form.controls[key].markAsTouched();
            }
        }
    }

    chooseTariff(tariff: IGeneralTariff): void {

        this.selectedTariff = tariff;

        this.optionsPaymentMethod = [];
        this.optionsPaymentMode = [];
        this.selectedExtensions = [];

        tariff.payment_methods.map(method => this.optionsPaymentMethod.push({
            label: method.user_description,
            value: method.json_identificator
        }));
        tariff.payment_modes.map(mode => this.optionsPaymentMode.push({
            label: mode.user_description,
            value: mode.json_identificator
        }));

        let input: { [key: string]: any; } = {
            'product_individual_name':  ['', [Validators.required, Validators.minLength(4)]],

            'invoice_email':            [this.backendService.personInfoSnapshot.mail || '', [Validators.required, BeckiValidators.email]],

            'street':                   ['', [Validators.required, Validators.minLength(4)]],
            'street_number':            ['', [BeckiValidators.regExp('street_number', /^[0-9]+([\/][0-9]+)?$/)]],
            'city':                     ['', [Validators.required, Validators.minLength(2)]],
            'zip_code':                 ['', [Validators.required, Validators.minLength(5)]],
            'country':                  ['', [Validators.required, Validators.minLength(4)]],
        };

        if (this.selectedTariff.required_payment_method) {
            let value = '';
            if (this.optionsPaymentMethod.length === 1) {
                value = this.optionsPaymentMethod[0].value;
            }
            input['payment_method'] =   [value, [Validators.required]]; // only if required_payment_method = true
        }
        if (this.selectedTariff.required_payment_mode) {
            // input['currency_type'] = ['', [Validators.required]];
            let value = '';
            if (this.optionsPaymentMode.length === 1) {
                value = this.optionsPaymentMode[0].value;
            }
            input['payment_mode'] =     [value, [Validators.required]]; // only if required_payment_mode = true
        }

        if (this.selectedTariff.company_details_required) {

            input['company_name'] =                 ['', [Validators.required, Validators.minLength(4)]];

            input['company_authorized_email'] =     ['', [Validators.required, BeckiValidators.email]];
            input['company_authorized_phone'] =     ['', [Validators.required, Validators.minLength(4)]]; // TODO: libphonenumber

            input['company_web'] =                  ['', [Validators.required, Validators.minLength(4)]];
            input['registration_no'] =              ['', [BeckiValidators.condition(() => !this.inEu, Validators.required)]];
            input['vat_number'] =                   [
                '', // např. GB365684514
                [BeckiValidators.condition(() => this.inEu, Validators.required)],
                BeckiAsyncValidators.condition(() => this.inEu, BeckiAsyncValidators.validateEntity(this.backendService, 'vat_number'))
            ];

        } else {
            input['full_name'] =                    [this.backendService.personInfoSnapshot.full_name || '',  [Validators.required, Validators.minLength(3)]];
        }

        this.form = this.formBuilder.group(input);

        this.router.navigate(['/financial/product-registration', {step: 2}]);
    }

    translatePaymentMode(value: string): string {
        let fpm = this.optionsPaymentMode.find((pm) => pm.value === value);
        if (fpm) {
            return fpm.label;
        }
        return 'Unknown';
    }

    translatePaymentMethod(value: string): string {
        let fpm = this.optionsPaymentMethod.find((pm) => pm.value === value);
        if (fpm) {
            return fpm.label;
        }
        return 'Unknown';
    }

    addExtension(selected: IGeneralTariffExtensions): void {
        if (this.selectedExtensions.indexOf(selected) === -1) {
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
            let country = this.optionsCountryList.find(fCountry => this.form && fCountry.value === this.form.controls['country'].value);
            this.inEu = country ? country.data : null;

            this.form.controls['registration_no'].updateValueAndValidity();
            this.form.controls['vat_number'].updateValueAndValidity();
        }
    }

    onConfirmClick(): void {

        if (!this.selectedTariff) { return; }
        if (!this.form) { return; }
        if (!this.form.valid) { return; }

        this.blockUI();

        let tariffData: ITariffRegister = {
            tariff_id: this.selectedTariff.id,
            extensions_ids: this.selectedExtensions.map((se) => se.id),

            product_individual_name: this.form.controls['product_individual_name'].value,

            invoice_email: this.form.controls['invoice_email'].value,

            street: this.form.controls['street'].value,
            street_number: this.form.controls['street_number'].value,
            city: this.form.controls['city'].value,
            zip_code: this.form.controls['zip_code'].value,
            country: this.form.controls['country'].value,

        };

        if (this.selectedTariff.required_payment_method) {
            tariffData['payment_method'] = this.form.controls['payment_method'].value;
        }

        if (this.selectedTariff.required_payment_mode) {
            tariffData['payment_mode'] = this.form.controls['payment_mode'].value;
        }

        if (this.selectedTariff.company_details_required) {
            tariffData['company_name'] = this.form.controls['company_name'].value;
            tariffData['company_authorized_email'] = this.form.controls['company_authorized_email'].value;
            tariffData['company_authorized_phone'] = this.form.controls['company_authorized_phone'].value;
            tariffData['company_web'] = this.form.controls['company_web'].value;

            if (this.inEu) {
                tariffData['vat_number'] = this.form.controls['vat_number'].value;
            } else {
                tariffData['registration_no'] = this.form.controls['registration_no'].value;
            }

        } else {
            tariffData['full_name'] = this.form.controls['full_name'].value;
        }

        this.backendService.createProduct(tariffData)
            .then(response => {
                if ((<any>response)._code_ === 200) {
                    this.fmWarning('Product was created but payment is required');
                    this.unblockUI();

                    let gwUrl = (<IGoPayUrl>response).gw_url;

                    this.goPayLoaderServiceSubscription = this.goPayLoaderService.goPay.subscribe((goPay) => {
                        goPay.checkout({
                            gatewayUrl: gwUrl,
                            inline: true
                        }, (checkoutResult) => {
                            // TODO: console.log(checkoutResult);
                            this.router.navigate(['/financial']);
                        });
                    });

                } else if ((<any>response)._code_ === 201) {
                    this.fmSuccess('Product was created, now you can create a new project');
                    this.unblockUI();
                    this.router.navigate(['/financial']);
                }
            })
            .catch(reason => {
                this.fmError('The product cannot be bought.', reason);
                this.unblockUI();
            });
    }
}





