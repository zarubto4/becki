/**
 ~ © 2016 Becki Authors. See the AUTHORS file found in the top-level
 ~ directory of this distribution.
 */
import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { ICustomer, IProduct, IProductNew, ITariff, ITariffExtension } from '../backend/TyrionAPI';
import { FormGroup, Validators } from '@angular/forms';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { Subscription } from 'rxjs';
import { ContactFormData } from '../components/ContactFormComponent';
import { PaymentDetailsData, PaymentDetailsOptions } from '../components/PaymentDetailsFormComponent';


@Component({
    selector: 'bk-view-product-registration',
    templateUrl: './financial-product-registration.html',
})
export class ProductRegistrationComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    step: string;           // Step in creating new product
    routeParamsSubscription: Subscription;

    // first page - TODO not yet available
    registrationType: string = 'do_it_yourself';  // integrator or do_it_yourself - Flag Register

    // step: tariff
    tariffs: ITariff[];         // List of tariffs for choice
    selectedTariff: ITariff;    // Selected Tariff

    // step: extensions
    extensionTab: string = 'recommended_extensions';
    selectedExtensions: ITariffExtension[] = [];

    // step: customer
    customers: ICustomer[] = null;
    optionsCustomers: FormSelectComponentOption[] = [];
    selectedCustomer: ICustomer = null;
    newCustomer = false;
    noCustomer = false;

    contact: ContactFormData;
    contactCustomerValid = false;

    paymentOptions: PaymentDetailsOptions;
    paymentDetailsData: PaymentDetailsData;
    paymentDetailsDataValid = false;

    productInfoFormGroup: FormGroup;


    alreadyCreatedProducts: IProduct[] = null;

    constructor(injector: Injector) {
        super(injector);

        this.productInfoFormGroup =  this.formBuilder.group({
            'product_name': ['', [Validators.required, Validators.minLength(5)]],
            'customer_id': ['', []]
        });
    };

    ngOnInit(): void {
        this.blockUI();

        Promise.all<any>([this.tyrionBackendService.tariffsGetAll(), this.tyrionBackendService.customersGetAll()])
            .then((values: [ITariff[], ICustomer[]]) => {
                this.tariffs = values[0];
                this.customers = values[1].filter(c => c.contact);
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

                    this.stepClick(params['step']);
                    this.unblockUI();
                });

            }).catch(error => {
                this.fmError(this.translate('label_cant_load_tariff', error));
                this.unblockUI();
            });
    }

    ngOnDestroy(): void {
    }


    stepClick(step: string): void {
        if (step == null || !this.canActivateStep(step)) {
            step = 'tariff';
        }

        this.step = step;
        this.router.navigate(['/financial/product-registration', {step: step}]);
    }

    canActivateStep(step: string) {
        if (step === 'registration_type') {
            return true;
        }

        if (step === 'tariff') {
            return this.registrationType === 'integrator' || this.registrationType === 'do_it_yourself';
        }

        if (step === 'extensions') {
            return this.selectedTariff != null;
        }

        if (step === 'customer') {
            return this.selectedTariff != null;
        }

        // if (step === 'integratorClient') {
        //     return this.selectedTariff != null;
        // }

        if (step === 'confirmation') {
            const okProductInfo = this.productInfoFormGroup.valid;
            if (!okProductInfo) {
                return false;
            }

            const okCustomer = (!this.selectedTariff.owner_details_required && this.noCustomer) ||
                (!this.newCustomer && this.selectedCustomer) || (this.newCustomer && this.contactCustomerValid);
            if (!okCustomer) {
                return false;
            }

            const okPaymentDetails = !this.selectedTariff.payment_details_required || this.paymentDetailsDataValid;
            if (!okPaymentDetails) {
                return false;
            }

            return true;
        }

        return true;
    }


    /* first page_ select registration type ---------------------------------------------------------------------------*/
    // TODO not yet available
    setType(registrationType: string): void {
        this.registrationType = registrationType;
        this.stepClick('tariff');
    }

    /* step: tariff --- ----------------------------------------------------------------------------------------------*/
    chooseTariff(tariff: ITariff): void {
        this.selectedTariff = tariff;

        this.productInfoFormGroup.controls['product_name'].setValue(tariff.name);

        this.paymentOptions = {
            payment_methods: tariff.payment_methods,
            payment_details_required: tariff.payment_details_required
        };

        this.optionsCustomers = tariff.owner_details_required ? [] : [{
            label: 'Not yet set',
            value: 'NOT_SET'
        }];

        this.optionsCustomers.push({
            label: 'New customer',
            value: 'NEW'
        });

        if (this.customers) {
            const opCustomers = this.customers.map((pv) => {
                return {
                    label: pv.contact.name,
                    value: pv.id
                };
            });

            this.optionsCustomers.push(...opCustomers);
        }

        // if the field for selecting customer is invalid or empty, select first value
        const customerIdValue = this.productInfoFormGroup.controls['customer_id'].value;
        if (!customerIdValue || this.optionsCustomers.filter(i => i.value === customerIdValue).length === 0) {
            this.productInfoFormGroup.controls['customer_id'].setValue(this.optionsCustomers[0].value);
        }
        this.setOwner();

        this.stepClick('extensions');
    }



    /* step: extensions ----------------------------------------------------------------------------------------------*/
    onExtensionToggleTab(tab: string) {
        this.extensionTab = tab;
    }


    addExtension(selected: ITariffExtension): void {
        if (this.selectedExtensions.indexOf(selected) === -1) {
            this.selectedExtensions.push(selected);
        }
    }

    removeExtension(selected: ITariffExtension): void {
        if (this.selectedExtensions.indexOf(selected) > -1) {
            let index = this.selectedExtensions.indexOf(selected);
            this.selectedExtensions.splice(index, 1); // not supported in Internet Explorer 7 and 8. but did we want users who still uses IE7/8?
        }
    }

    /* step: customer ------------------------------------------------------------------------------------------------*/
    setOwner(): void {
        const selectedCustomerId = this.productInfoFormGroup.controls['customer_id'].value;

        this.newCustomer = selectedCustomerId === 'NEW';
        this.noCustomer = selectedCustomerId === 'NOT_SET';

        if (!this.newCustomer && !this.noCustomer) {
            for (let company in this.customers) {

                // TODO ???
                if (!this.customers.hasOwnProperty(company)) {
                    continue;
                }

                if (this.customers[company].id === this.productInfoFormGroup.controls['customer_id'].value) {
                    this.selectedCustomer = this.customers[company];
                    this.contact = this.customers[company].contact;
                    return;
                }
            }
        }

        this.selectedCustomer = null;
        this.contact = null;
    }

    /* step: confirmation --------------------------------------------------------------------------------------------*/
    getTotalPrice(): number {
        let price = 0;
        price += this.selectedTariff.price;
        this.selectedExtensions.map((pack) => {
            price += pack.price;
        });

        return price;
    }

    onConfirmClick(): void {
        if (!this.selectedTariff) {
            return;
        }

        if (this.selectedTariff.owner_details_required && this.contact == null && this.selectedCustomer == null) {
            return;
        }

        if (this.selectedTariff.payment_details_required && !this.paymentDetailsDataValid) {
            return;
        }

        this.blockUI();

        let tariffDataForRegistration: IProductNew  = {
            tariff_id: this.selectedTariff.id,
            extension_ids: this.selectedExtensions.map((se) => se.id),
            name: this.productInfoFormGroup.controls['product_name'].value, // Financial Product Name
            owner_id: this.selectedCustomer ? this.selectedCustomer.id : null,
            owner_new_contact: this.selectedCustomer ? null : this.contact,
            payment_details: this.paymentDetailsData
        };

        this.tyrionBackendService.productCreate(tariffDataForRegistration)
            .then(response => {
                if ((<any>response)._code_ === 200) {
                    this.fmWarning(this.translate('flash_product_created_prepaid'));
                    this.unblockUI();
                } else if ((<any>response)._code_ === 201) {
                    this.fmSuccess(this.translate('flash_product_created'));
                    this.unblockUI();

                    // This is a first Product - redirect to dashboard
                    if (this.alreadyCreatedProducts === null || this.alreadyCreatedProducts.length === 0) {
                        this.onDashboardClick();
                    } else {
                        this.onFinanceClick();
                    }
                }
            })
            .catch(reason => {
                this.fmError(this.translate('flash_cant_buy_product'), reason);
                this.unblockUI();
            });
    }
}




