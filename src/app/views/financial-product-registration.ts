/**
  ~ © 2016 Becki Authors. See the AUTHORS file found in the top-level
  ~ directory of this distribution.
*/

/**
 * Created by dominik krisztof on 22/09/16.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { ITariff, IProductExtension, IProductNew, IInvoice, IProduct, ICustomer } from '../backend/TyrionAPI';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { Subscription } from 'rxjs';
import { StaticOptionLists } from '../helpers/StaticOptionLists';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { GoPayLoaderService } from '../services/GoPayLoaderService';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';


@Component({
    selector: 'bk-view-product-registration',
    templateUrl: './financial-product-registration.html',
})
export class ProductRegistrationComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    formPaymentDetail: FormGroup;        // Default registration informations - IPaymentDetails
    formCustomerSelectedCompany: FormGroup; // Only for select in option List
    formCustomerRegistration: FormGroup; // Only for select in option List
    formCustomer: FormGroup;             // Only for select in option List

    routeParamsSubscription: Subscription;

    step: number = -1;           // Step in creating new product
    totalStep: number = 4;      // Number of steps if type of registration not required 4 but only 3 - shorter and faster registration

    tariffs: ITariff[];         // List of tariffs for choice
    selectedTariff: ITariff;    // Selected Tariff

    selectedExtensions: IProductExtension[] = [];

    inEu: boolean = false;

    registrationType: string = 'do_it_yourself';
    companies: ICustomer[] = null;
    selectedCompanies: ICustomer = null;

    optionsCountryList: FormSelectComponentOption[] = StaticOptionLists.countryList;

    optionsPaymentMethod: FormSelectComponentOption[] = [];
    optionsCompanies: FormSelectComponentOption[] = [];


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
            return this.translate('label_free');
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

        Promise.all<any>([this.tyrionBackendService.tariffsGetAll(), this.tyrionBackendService.companiesGetAll()])
            .then((values: [ITariff[], ICustomer[]]) => {
                this.tariffs = values[0];
                this.companies = values[1];
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

                        if (this.companies.length < 1) {
                            this.step = 1;
                        } else {
                            this.step = 2;
                        }
                    }

                    this.unblockUI();
                });

            }).catch(error => {
                this.fmError(this.translate('label_cant_load_tariff', error));
                this.unblockUI();
            });

        // Selector For Company
        this.formCustomer = this.formBuilder.group({
            'company_id': ['', [Validators.required]]
        });

        this.setFormPaymentDetail();
        this.setFormCustomerDetail();
        this.setFormCompanySelector();
        this.refreshCompaniesForDecision();
    }

    setFormPaymentDetail(): void {

        this.formPaymentDetail = this.formBuilder.group({
            'product_individual_name': ['', [Validators.required]],
            'payment_method': [''],
            'city': ['', [Validators.required]],
            'company_authorized_email': ['', [Validators.required, BeckiValidators.email]],
            'company_authorized_phone': ['', [Validators.required, Validators.minLength(5)]],
            'company_name': ['', [Validators.required, Validators.minLength(5)]],
            'company_web': ['', [Validators.required, BeckiValidators.url]],
            'country': ['', [Validators.required]],
            'invoice_email': ['', [Validators.required, BeckiValidators.email]],
            'street': ['', [Validators.required]],
            'street_number': ['', [Validators.required]],
            'company_registration_no': ['', [BeckiValidators.condition(() => !this.inEu, Validators.required)]],
            'company_vat_number': ['', [BeckiValidators.condition(() => this.inEu, Validators.required)], BeckiAsyncValidators.condition(() => this.inEu, BeckiAsyncValidators.validateEntity(this.tyrionBackendService, 'vat_number'))],
            'zip_code': ['', [Validators.required, Validators.minLength(4)]]
        });


        if (this.selectedCompanies != null && this.registrationType === 'do_it_yourself') {

            (<FormControl>(this.formPaymentDetail.controls['company_name'])).setValue(this.selectedCompanies.payment_details.company_name);
            (<FormControl>(this.formPaymentDetail.controls['street'])).setValue(this.selectedCompanies.payment_details.street);
            (<FormControl>(this.formPaymentDetail.controls['street_number'])).setValue(this.selectedCompanies.payment_details.street_number);
            (<FormControl>(this.formPaymentDetail.controls['city'])).setValue(this.selectedCompanies.payment_details.city);
            (<FormControl>(this.formPaymentDetail.controls['zip_code'])).setValue(this.selectedCompanies.payment_details.zip_code);
            (<FormControl>(this.formPaymentDetail.controls['country'])).setValue(this.selectedCompanies.payment_details.country);
            (<FormControl>(this.formPaymentDetail.controls['company_registration_no'])).setValue(this.selectedCompanies.payment_details.company_registration_no);
            (<FormControl>(this.formPaymentDetail.controls['company_vat_number'])).setValue(this.selectedCompanies.payment_details.company_vat_number);
            (<FormControl>(this.formPaymentDetail.controls['company_web'])).setValue(this.selectedCompanies.payment_details.company_web);
            (<FormControl>(this.formPaymentDetail.controls['company_authorized_email'])).setValue(this.selectedCompanies.payment_details.company_authorized_email);
            (<FormControl>(this.formPaymentDetail.controls['company_authorized_phone'])).setValue(this.selectedCompanies.payment_details.company_authorized_phone);
            (<FormControl>(this.formPaymentDetail.controls['invoice_email'])).setValue(this.selectedCompanies.payment_details.invoice_email);

            return;
        }

        // Set everything to null
        (<FormControl>(this.formPaymentDetail.controls['company_name'])).setValue('');
        (<FormControl>(this.formPaymentDetail.controls['street'])).setValue('');
        (<FormControl>(this.formPaymentDetail.controls['street_number'])).setValue('');
        (<FormControl>(this.formPaymentDetail.controls['city'])).setValue('');
        (<FormControl>(this.formPaymentDetail.controls['zip_code'])).setValue('');
        (<FormControl>(this.formPaymentDetail.controls['country'])).setValue('');
        (<FormControl>(this.formPaymentDetail.controls['company_registration_no'])).setValue('');
        (<FormControl>(this.formPaymentDetail.controls['company_vat_number'])).setValue('');
        (<FormControl>(this.formPaymentDetail.controls['company_web'])).setValue('');
        (<FormControl>(this.formPaymentDetail.controls['company_authorized_email'])).setValue('');
        (<FormControl>(this.formPaymentDetail.controls['company_authorized_phone'])).setValue('');
        (<FormControl>(this.formPaymentDetail.controls['invoice_email'])).setValue('');

    }

    setFormCustomerDetail(): void {
        this.formCustomerRegistration = this.formBuilder.group({
            'city': ['', [Validators.required]],
            'company_authorized_email': ['', [Validators.required, BeckiValidators.email]],
            'company_authorized_phone': ['', [Validators.required, Validators.minLength(5)]],
            'company_name': ['', [Validators.required, Validators.minLength(5)]],
            'company_web': ['', [Validators.required, BeckiValidators.url]],
            'country': ['', [Validators.required]],
            'invoice_email': ['', [Validators.required, BeckiValidators.email]],
            'street': ['', [Validators.required]],
            'street_number': ['', [Validators.required]],
            'company_registration_no': ['', [BeckiValidators.condition(() => !this.inEu, Validators.required), Validators.minLength(4), Validators.maxLength(20)]],
            'company_vat_number': ['', [BeckiValidators.condition(() => this.inEu, Validators.required)], BeckiAsyncValidators.condition(() => this.inEu, BeckiAsyncValidators.validateEntity(this.tyrionBackendService, 'vat_number'))],
            'zip_code': ['', [Validators.required]]
        });

        this.formCustomerSelectedCompany = this.formBuilder.group({
            'city': [''],
            'company_authorized_email': [''],
            'company_authorized_phone': [''],
            'company_name': [''],
            'company_web': [''],
            'country': [''],
            'invoice_email': [''],
            'street': [''],
            'street_number': [''],
            'company_registration_no': [''],
            'company_vat_number': [''],
            'zip_code': ['']
        });
    }

    setFormCompanySelector(): void {
        this.formCustomer = this.formBuilder.group({
            'company': ['', [Validators.required]]
        });
    }

    checkCustomerInEu(): void {

        let country = this.optionsCountryList.find(fCountry => this.formCustomerRegistration && fCountry.value === this.formCustomerRegistration.controls['country'].value);
        this.inEu = country ? country.data : null;

        (<FormControl>(this.formCustomerRegistration.controls['company_registration_no'])).setValue('');
        (<FormControl>(this.formCustomerRegistration.controls['company_vat_number'])).setValue('');

        this.formCustomerRegistration.controls['company_registration_no'].updateValueAndValidity();
        this.formCustomerRegistration.controls['company_vat_number'].updateValueAndValidity();

    }

    checkInEu(): void {

        let country = this.optionsCountryList.find(fCountry => this.formPaymentDetail && fCountry.value === this.formPaymentDetail.controls['country'].value);
        this.inEu = country ? country.data : null;

        (<FormControl>(this.formPaymentDetail.controls['company_registration_no'])).setValue('');
        (<FormControl>(this.formPaymentDetail.controls['company_vat_number'])).setValue('');

        this.formPaymentDetail.controls['company_registration_no'].updateValueAndValidity();
        this.formPaymentDetail.controls['company_vat_number'].updateValueAndValidity();

    }

    canActivateStep(step: number) {

        if (step === 1) {
            return true;
        }

        if (step === 2) {
            return true;
        }

        if (step === 3) {
            return true;
        }

        if (step === 4) {
            return true;
        }

        if (step === 5) {
            return this.selectedTariff != null;
        }

        if (step === 6) {
            return this.selectedTariff != null;
        }

        if (step === 7 && this.totalStep === 3) {
            return true;
        }

        if (step === 7 && this.totalStep === 4) {
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
                this.selectedCompanies = null;
                this.router.navigate(['/financial/product-registration']);

            } else {
                this.step = step;
                this.router.navigate(['/financial/product-registration', { step: step }]);
            }
        }
    }

    changeType(registrationType: string): void {

        this.registrationType = registrationType;
        this.setFormPaymentDetail();

    }

    setType(registrationType: string): void {

        this.registrationType = registrationType;

        if (registrationType === 'integrator') {
            this.step = 3;
            return;
        }

        if (registrationType === 'do_it_yourself') {
            this.step = 4;
            return;
        }

    }

    chooseTariff(tariff: ITariff): void {

        this.selectedTariff = tariff;

        this.optionsPaymentMethod = [];
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

        if (this.registrationType === 'integrator' || this.selectedCompanies != null || tariff.company_details_required || tariff.payment_method_required || tariff.payment_details_required) {
            (<FormControl>(this.formPaymentDetail.controls['product_individual_name'])).setValue('');
            this.totalStep = 4;
        } else {
            (<FormControl>(this.formPaymentDetail.controls['product_individual_name'])).setValue('My ' + this.selectedTariff.name);
            this.totalStep = 3;
        }

        this.router.navigate(['/financial/product-registration', { step: 4 }]);
    }

    getTotalPrice(): number {
        let price = 0;
        price += this.selectedTariff.price;
        this.selectedExtensions.map((pack) => {
            price += pack.price;
        });

        return price;
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

    setCompanyOwner(): void {

        for (let company in this.companies) {

            if (!this.companies.hasOwnProperty(company)) {
                continue;
            }

            if (this.companies[company].id === this.formCustomer.controls['company'].value) {
                this.selectedCompanies = this.companies[company];
                this.step = 4;

                (<FormControl>(this.formCustomerSelectedCompany.controls['company_name'])).setValue(this.selectedCompanies.payment_details.company_name);
                (<FormControl>(this.formCustomerSelectedCompany.controls['street'])).setValue(this.selectedCompanies.payment_details.street);
                (<FormControl>(this.formCustomerSelectedCompany.controls['street_number'])).setValue(this.selectedCompanies.payment_details.street_number);
                (<FormControl>(this.formCustomerSelectedCompany.controls['city'])).setValue(this.selectedCompanies.payment_details.city);
                (<FormControl>(this.formCustomerSelectedCompany.controls['zip_code'])).setValue(this.selectedCompanies.payment_details.zip_code);
                (<FormControl>(this.formCustomerSelectedCompany.controls['country'])).setValue(this.selectedCompanies.payment_details.country);
                (<FormControl>(this.formCustomerSelectedCompany.controls['company_registration_no'])).setValue(this.selectedCompanies.payment_details.company_registration_no);
                (<FormControl>(this.formCustomerSelectedCompany.controls['company_vat_number'])).setValue(this.selectedCompanies.payment_details.company_vat_number);
                (<FormControl>(this.formCustomerSelectedCompany.controls['company_web'])).setValue(this.selectedCompanies.payment_details.company_web);
                (<FormControl>(this.formCustomerSelectedCompany.controls['company_authorized_email'])).setValue(this.selectedCompanies.payment_details.company_authorized_email);
                (<FormControl>(this.formCustomerSelectedCompany.controls['company_authorized_phone'])).setValue(this.selectedCompanies.payment_details.company_authorized_phone);
                (<FormControl>(this.formCustomerSelectedCompany.controls['invoice_email'])).setValue(this.selectedCompanies.payment_details.invoice_email);

                this.setFormPaymentDetail();
            }
        }

    }

    onCreateCompany(): void {

        this.tyrionBackendService.companyCreate({
            city: this.formCustomerRegistration.controls['city'].value,
            company_authorized_email: this.formCustomerRegistration.controls['company_authorized_email'].value,
            company_authorized_phone: this.formCustomerRegistration.controls['company_authorized_phone'].value,
            company_name: this.formCustomerRegistration.controls['company_name'].value,
            company_web: this.formCustomerRegistration.controls['company_web'].value,
            country: this.formCustomerRegistration.controls['country'].value,
            invoice_email: this.formCustomerRegistration.controls['invoice_email'].value,
            street: this.formCustomerRegistration.controls['street'].value,
            street_number: this.formCustomerRegistration.controls['street_number'].value,
            company_registration_no: this.formCustomerRegistration.controls['company_registration_no'].value,
            company_vat_number: this.formCustomerRegistration.controls['company_vat_number'].value,
            zip_code: this.formCustomerRegistration.controls['zip_code'].value
        })
            .then((iCustomer) => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_company_create_success', iCustomer.payment_details.company_name)));

                this.selectedCompanies = iCustomer;

                this.step = 4;
                this.unblockUI();
                this.refreshCompaniesForDecision();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_company_create_error'), reason));
                this.unblockUI();
                this.refreshCompaniesForDecision();
            });
    }

    refreshCompaniesForDecision(): void {
        this.blockUI();
        this.tyrionBackendService.companiesGetAll()
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
                this.addFlashMessage(new FlashMessageError(this.translate('flash_company_load_error'), reason));
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

        let tariffDataForRegistration: IProductNew = null;

        // Tariff si dělá firma sama pro sebe
        if (this.selectedCompanies && this.registrationType === 'do_it_yourself') {

            tariffDataForRegistration = {
                tariff_id: this.selectedTariff.id,
                extension_ids: this.selectedExtensions.map((se) => se.id),
                name: this.formPaymentDetail.controls['product_individual_name'].value, // Financial Product Name
                customer_id: this.selectedCompanies.id,
            };

        }

        // Tariff firma bude spravovat ale bude mít klienta
        if (this.selectedCompanies && this.registrationType === 'integrator') {

            tariffDataForRegistration = {
                tariff_id: this.selectedTariff.id,
                extension_ids: this.selectedExtensions.map((se) => se.id),

                name: this.formPaymentDetail.controls['product_individual_name'].value, // Financial Product Name

                invoice_email: this.formPaymentDetail.controls['invoice_email'].value,
                integrator_registration: true,

                street: this.formPaymentDetail.controls['street'].value,
                street_number: this.formPaymentDetail.controls['street_number'].value,
                city: this.formPaymentDetail.controls['city'].value,
                zip_code: this.formPaymentDetail.controls['zip_code'].value,
                country: this.formPaymentDetail.controls['country'].value,

                customer_id: this.selectedCompanies.id,

                company_name: this.formPaymentDetail.controls['company_name'].value,
                company_authorized_email: this.formPaymentDetail.controls['company_authorized_email'].value,
                company_authorized_phone: this.formPaymentDetail.controls['company_authorized_phone'].value,
                company_web: this.formPaymentDetail.controls['company_web'].value,
                company_vat_number: this.formPaymentDetail.controls['company_vat_number'].value,
                company_registration_no: this.formPaymentDetail.controls['company_registration_no'].value
            };

        }

        // Jsem nový klient
        if (this.selectedCompanies == null) {

            tariffDataForRegistration = {
                tariff_id: this.selectedTariff.id,
                extension_ids: this.selectedExtensions.map((se) => se.id),

                name: this.formPaymentDetail.controls['product_individual_name'].value, // Financial Product Name

                invoice_email: this.formPaymentDetail.controls['invoice_email'].value,

                street: this.formPaymentDetail.controls['street'].value,
                street_number: this.formPaymentDetail.controls['street_number'].value,
                city: this.formPaymentDetail.controls['city'].value,
                zip_code: this.formPaymentDetail.controls['zip_code'].value,
                country: this.formPaymentDetail.controls['country'].value,

                company_name: this.formPaymentDetail.controls['company_name'].value,
                company_authorized_email: this.formPaymentDetail.controls['company_authorized_email'].value,
                company_authorized_phone: this.formPaymentDetail.controls['company_authorized_phone'].value,
                company_web: this.formPaymentDetail.controls['company_web'].value,
                company_vat_number: this.formPaymentDetail.controls['company_vat_number'].value,
                company_registration_no: this.formPaymentDetail.controls['company_registration_no'].value
            };

        }


        this.tyrionBackendService.productCreate(tariffDataForRegistration)
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
                this.fmError(this.translate('flash_cant_buy_product'), reason);
                this.unblockUI();
            });
    }
}




