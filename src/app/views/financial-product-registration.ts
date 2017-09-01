/**
  ~ © 2016 Becki Authors. See the AUTHORS file found in the top-level
  ~ directory of this distribution.
*/

/**
 * Created by dominik krisztof on 22/09/16.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { ITariff, IProductExtension, IProductNew, IInvoice, IProduct, ICustomer } from '../backend/TyrionAPI';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { Subscription } from 'rxjs';
import { StaticOptionLists } from '../helpers/StaticOptionLists';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { GoPayLoaderService } from '../services/GoPayLoaderService';
import { ModalsBillingInformationModel } from '../modals/billing-information';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';


@Component({
    selector: 'bk-view-product-registration',
    templateUrl: './financial-product-registration.html'
})
export class ProductRegistrationComponent extends BaseMainComponent implements OnInit, OnDestroy {

    formPaymentDetail: FormGroup;        // Default registration informations - IPaymentDetails
    formCustomerDetail: FormGroup;       // Only for select in option List
    formNewTariffProduct: FormGroup;     //
    formCustomer: FormGroup;             // Only for select in option List

    routeParamsSubscription: Subscription;

    step: number = -1;           // Step in creating new product
    totalStep: number = 4;      // Number of steps if type of registration not required 4 but only 3 - shorter and faster registration

    tariffs: ITariff[];         // List of tarrifs for choice
    selectedTariff: ITariff;    // Selected Tariff

    selectedCustomerId: string = null; // When user select customer

    selectedExtensions: IProductExtension[] = [];

    inEu: boolean = false;

    registrationType: string = null;
    companies: ICustomer[] = null;

    optionsCountryList: FormSelectComponentOption[] = StaticOptionLists.countryList;

    optionsPaymentMethod: FormSelectComponentOption[] = [];
    optionsPaymentMode: FormSelectComponentOption[] = [];
    optionsCompanies: FormSelectComponentOption[] = [];
    // optionsCurrencyType: FormSelectComponentOption[] = [{ label: 'USD', value: 'USD' }];

    goPayLoaderService: GoPayLoaderService;
    goPayLoaderServiceSubscription: Subscription;

    // integrator or do_it_yourself - Flag Register
    extensionTab: string = 'optional_extensions';

    constructor(injector: Injector) {
        super(injector);
        this.goPayLoaderService = injector.get(GoPayLoaderService);
    };



    makePrice(price: number): string {
        if (price === 0) {
            return  this.translate('label_free');
        }

        price = price / 1000;

        if (Math.floor(price) === price) {
            return price.toFixed(2) + '$';
        } else {
            return price.toFixed(2) + '$';
        }
    }

    onExtensionToggleTab(tab: string) {
        this.extensionTab = tab;
    }

    ngOnDestroy(): void {
        if (this.goPayLoaderServiceSubscription) {
            this.goPayLoaderServiceSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.blockUI();

        this.backendService.tariffsGetAll()
            .then(tariffs => {
                this.tariffs = tariffs;
                this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {

                    if (params.hasOwnProperty('tariff')) {
                        let t = this.tariffs.find(tariff => tariff.identifier === params['tariff']);
                        if (t) {
                            this.chooseTariff(t);
                        } else {
                            this.fmError(this.translate('label_want_tariff_not_found'));
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
                                this.router.navigate(['/financial/product-registration', { step: 1 }]);
                            }
                        }

                    } else {
                        this.step = 1;
                    }

                    this.unblockUI();
                });

            }).catch(error => {
                this.fmError(this.translate('label_cant_load_tarrif', error));
                this.unblockUI();
            });

        // Selector For Company
        this.formCustomer = this.formBuilder.group({
            'company_id': ['', [Validators.required]]
        });

        // Form for PaymentDetail
        this.formNewTariffProduct = this.formBuilder.group({
            'product_individual_name': ['', [Validators.required, Validators.minLength(4)]],
        });

        this.setFormPaymentDetail();
        this.setFormCustomerDetail();
        this.refreshCompaniesForDecision();

    }

    setFormPaymentDetail(): void {
        this.formPaymentDetail = this.formBuilder.group({
            'city': ['', [Validators.required]],
            'company_authorized_email': ['', [Validators.required, BeckiValidators.email]],
            'company_authorized_phone': ['', [Validators.required, Validators.minLength(5)]],
            'company_name': ['', [Validators.required, Validators.minLength(5)]],
            'company_web': ['', [Validators.required, BeckiValidators.url]],
            'country': ['', [Validators.required]],
            'invoice_email': ['', [Validators.required, BeckiValidators.email]],
            'street': ['', [Validators.required]],
            'street_number': ['', [Validators.required]],
            'registration_no': ['', [BeckiValidators.condition(() => !this.inEu, Validators.required)]],
            'vat_number': ['', [BeckiValidators.condition(() => this.inEu, Validators.required)], BeckiAsyncValidators.condition(() => this.inEu, BeckiAsyncValidators.validateEntity(this.backendService, 'vat_number'))],
            'zip_code': ['', [Validators.required]]
        });
    }

    setFormCustomerDetail(): void {
        this.formCustomerDetail = this.formBuilder.group({
            'city': ['', [Validators.required]],
            'company_authorized_email': ['', [Validators.required, BeckiValidators.email]],
            'company_authorized_phone': ['', [Validators.required, Validators.minLength(5)]],
            'company_name': ['', [Validators.required, Validators.minLength(5)]],
            'company_web': ['', [Validators.required, BeckiValidators.url]],
            'country': ['', [Validators.required]],
            'invoice_email': ['', [Validators.required, BeckiValidators.email]],
            'street': ['', [Validators.required]],
            'street_number': ['', [Validators.required]],
            'registration_no' : ['', [BeckiValidators.condition(() => !this.inEu, Validators.required)]],
            'vat_number' : ['', [BeckiValidators.condition(() => this.inEu, Validators.required)], BeckiAsyncValidators.condition(() => this.inEu, BeckiAsyncValidators.validateEntity(this.backendService, 'vat_number'))],
            'zip_code': ['', [Validators.required]]
        });
    }

    checkCustomerInEu(): void {

        let country = this.optionsCountryList.find(fCountry => this.formCustomerDetail && fCountry.value === this.formCustomerDetail.controls['country'].value);
        this.inEu = country ? country.data : null;

        this.formCustomerDetail.controls['registration_no'].updateValueAndValidity();
        this.formCustomerDetail.controls['vat_number'].updateValueAndValidity();

    }

    checkInEu(): void {
        if (this.selectedTariff.company_details_required) {
            let country = this.optionsCountryList.find(fCountry => this.formPaymentDetail && fCountry.value === this.formPaymentDetail.controls['country'].value);
            this.inEu = country ? country.data : null;

            this.formPaymentDetail.controls['registration_no'].updateValueAndValidity();
            this.formPaymentDetail.controls['vat_number'].updateValueAndValidity();
        }
    }

    canActivateStep(step: number) {

        if (step === 1 ) {
            return true;
        }

        if (step === 2 ) {
            return true;
        }

        if (step === 3 ) {
            return this.selectedTariff != null;
        }

        if (step === 4) {
            return this.selectedTariff != null;
        }

        if (step === 5) {
            return this.selectedTariff != null && this.totalStep === 4;
        }

        if (step === 6 && this.totalStep === 3) {
            return true;
        }

        if (step === 6 && this.totalStep === 4) {
            if (this.formPaymentDetail.valid) {
                return true;
            }
        }

        return false;
    }

    stepClick(step: number): void {
        if (this.canActivateStep(step)) {
            if (step === 1) {
                this.step = 1;
                this.router.navigate(['/financial/product-registration']);

            } else {
                this.step = step;
                this.router.navigate(['/financial/product-registration', { step: step }]);
            }
        }
    }

    setType(registrationType: string): void {

        this.registrationType = registrationType;

        if (registrationType === 'integrator') {
            this.step = 2;
            return;
        }

        if (registrationType === 'do_it_yourself') {
            this.step = 3;
            return;
        }

    }

    stepClickElseTouchForm(step: number): void {
        if (this.canActivateStep(step)) {
            this.stepClick(step);
        } else {
            for (let key in this.formPaymentDetail.controls) {
                if (!this.formPaymentDetail.controls.hasOwnProperty(key)) {
                    continue;
                }
                this.formPaymentDetail.controls[key].markAsTouched();
            }
        }
    }

    chooseTariff(tariff: ITariff): void {

        this.selectedTariff = tariff;

        this.optionsPaymentMethod = [];
        this.optionsPaymentMode = [];
        this.selectedExtensions = [];

        tariff.payment_methods.map(method => this.optionsPaymentMethod.push({
            label: method.user_description,
            value: method.json_identifier
        }));

        // Only if user change tariff after choice -- just set for default
        this.extensionTab = 'optional_extensions';


        if (this.selectedTariff.company_details_required) {
            this.setFormPaymentDetail();
        }

        if (tariff.company_details_required || tariff.payment_method_required || tariff.payment_details_required) {
            (<FormControl>(this.formNewTariffProduct.controls['product_individual_name'])).setValue('');
            this.totalStep = 4;
        } else {
            (<FormControl>(this.formNewTariffProduct.controls['product_individual_name'])).setValue('My ' + this.selectedTariff.name);
            this.totalStep = 3;
        }

        this.router.navigate(['/financial/product-registration', { step: 4 }]);
    }

    translatePaymentMode(value: string): string {
        let fpm = this.optionsPaymentMode.find((pm) => pm.value === value);
        if (fpm) {
            return fpm.label;
        }
        return this.translate('text_unknown');
    }

    translatePaymentMethod(value: string): string {
        let fpm = this.optionsPaymentMethod.find((pm) => pm.value === value);
        if (fpm) {
            return fpm.label;
        }
        return this.translate('text_unknown');
    }

    addExtension(selected: IProductExtension): void {
        if (this.selectedExtensions.indexOf(selected) === -1) {
            this.selectedExtensions.push(selected);
        }
    }

    removeExtension(selected: IProductExtension): void {
        if (this.selectedExtensions.indexOf(selected) > -1) {
            let index = this.selectedExtensions.indexOf(selected);
            this.selectedExtensions.splice(index, 1); // not supported in Internet Explorer 7 and 8. but did we want users who still uses IE7/8?
        }
    }

    setCustomer(): void {
        this.selectedCustomerId = this.formPaymentDetail.controls['formCustomer'].value;
        this.step = 1;
    }

    onCreateCompany(): void {

        this.backendService.companyCreate({
            city: this.formCustomerDetail.controls['city'].value,
            company_authorized_email: this.formCustomerDetail.controls['company_authorized_email'].value,
            company_authorized_phone:this.formCustomerDetail.controls['company_authorized_phone'].value,
            company_name: this.formCustomerDetail.controls['company_name'].value,
            company_web: this.formCustomerDetail.controls['company_web'].value,
            country: this.formCustomerDetail.controls['country'].value,
            invoice_email: this.formCustomerDetail.controls['invoice_email'].value,
            street: this.formCustomerDetail.controls['street'].value,
            street_number: this.formCustomerDetail.controls['street_number'].value,
            registration_no: this.formCustomerDetail.controls['registration_no'].value,
            vat_number:  this.formCustomerDetail.controls['vat_number'].value,
            zip_code:  this.formCustomerDetail.controls['zip_code'].value
        })
            .then((iCustomer) => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_company_create_success', iCustomer.payment_details.company_name)));
                this.unblockUI();
                this.refreshCompaniesForDecision();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_company_create_error', reason)));
                this.unblockUI();
                this.refreshCompaniesForDecision();
            });
    }

    refreshCompaniesForDecision(): void {
        this.blockUI();
        this.backendService.companiesGetAll()
            .then((companies) => {
                this.companies = companies;

                this.optionsCompanies = companies.map((pv) => {
                    return {
                        label: pv.payment_details.company_name,
                        value: pv.id
                    };
                });

                this.unblockUI();
            }).catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_company_load_error', reason)));
                this.unblockUI();
            });
    }


    onConfirmClick(): void {

        if (!this.selectedTariff) { return; }

        if (this.selectedTariff.company_details_required || this.selectedTariff.payment_method_required || this.selectedTariff.payment_details_required) {

            if (!this.formPaymentDetail) {
                return;
            }
            if (!this.formPaymentDetail.valid) {
                return;
            }
        }

        this.blockUI();

        let tariffData: IProductNew = {
            tariff_id: this.selectedTariff.id,
            extension_ids: this.selectedExtensions.map((se) => se.id),

            name: this.formPaymentDetail.controls['product_individual_name'].value,

            invoice_email: this.formPaymentDetail.controls['invoice_email'].value,

            street: this.formPaymentDetail.controls['street'].value,
            street_number: this.formPaymentDetail.controls['street_number'].value,
            city: this.formPaymentDetail.controls['city'].value,
            zip_code: this.formPaymentDetail.controls['zip_code'].value,
            country: this.formPaymentDetail.controls['country'].value,

        };

        if (this.selectedTariff.payment_details_required) {
            tariffData['payment_method'] = this.formPaymentDetail.controls['payment_method'].value;
        }

        /*
        if (this.selectedTariff.payment_mode_required) {
            tariffData['payment_mode'] = this.formPaymentDetail.controls['payment_mode'].value;
        }
        */

        if (this.selectedTariff.company_details_required) {
            tariffData['company_name'] = this.formPaymentDetail.controls['company_name'].value;
            tariffData['company_authorized_email'] = this.formPaymentDetail.controls['company_authorized_email'].value;
            tariffData['company_authorized_phone'] = this.formPaymentDetail.controls['company_authorized_phone'].value;
            tariffData['company_web'] = this.formPaymentDetail.controls['company_web'].value;

            if (this.inEu) {
                tariffData['vat_number'] = this.formPaymentDetail.controls['vat_number'].value;
            } else {
                tariffData['registration_no'] = this.formPaymentDetail.controls['registration_no'].value;
            }

        } else {
            tariffData['full_name'] = this.formPaymentDetail.controls['full_name'].value;
        }

        this.backendService.productCreate(tariffData)
            .then(response => {
                if ((<any>response)._code_ === 200) {
                    this.fmWarning(this.translate('flash_product_created_prepaid'));
                    this.unblockUI();
                } else if ((<any>response)._code_ === 201) {
                    this.fmSuccess(this.translate('flash_product_created'));
                    this.unblockUI();
                    this.router.navigate(['/financial']);
                }
            })
            .catch(reason => {
                this.fmError(this.translate('flash_cant_buy_product', reason));
                this.unblockUI();
            });
    }
}




