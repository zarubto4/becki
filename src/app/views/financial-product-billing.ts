/**
 * Created by dominik.krisztof on 01.12.16.
 */
/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { ICustomer, IPaymentDetails, IProduct } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { FlashMessageError } from '../services/NotificationService';
import { ModalsBillingInformationModel } from '../modals/billing-information';
import { ModalsCompanyInformationModel } from '../modals/company-information';

@Component({
    selector: 'bk-view-financial-product-billing',
    templateUrl: './financial-product-billing.html'
})
export class FinancialProductBillingComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    product: IProduct = null;
    productPaymentDetails: IPaymentDetails = null;

    customer: ICustomer = null;
    customerPaymentDetails: IPaymentDetails = null;

    constructor(injector: Injector) {
        super(injector);
    };


    ngOnInit(): void {
        this.blockUI();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['product'];
            this.refresh();
            this.unblockUI();
        });

    }



    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }


    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.productGet(this.id).then(product => {
            this.product = product;
            this.productPaymentDetails = this.product.payment_details;
            this.customer = this.product.customer;
            this.customerPaymentDetails = this.customer.payment_details;

            this.unblockUI();
        }).catch(error => {

            this.unblockUI();
        });

    }

    onBillingEditClick(): void {
        let model = new ModalsBillingInformationModel(
            true,
            this.productPaymentDetails.city,
            this.productPaymentDetails.company_authorized_email,
            this.productPaymentDetails.company_authorized_phone,
            this.productPaymentDetails.company_name,
            this.productPaymentDetails.company_web,
            this.productPaymentDetails.country,
            this.productPaymentDetails.invoice_email,
            this.productPaymentDetails.street,
            this.productPaymentDetails.street_number,
            this.productPaymentDetails.company_registration_no,
            this.productPaymentDetails.company_vat_number,
            this.productPaymentDetails.zip_code
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.productEditPaymentDetails(this.productPaymentDetails.id, {
                    city: model.city,
                    company_authorized_email: model.company_authorized_email,
                    company_authorized_phone: model.company_authorized_phone,
                    company_name: model.company_name,
                    company_web: model.company_web,
                    country: model.country,
                    invoice_email: model.invoice_email,
                    street: model.street,
                    street_number: model.street_number,
                    company_registration_no: model.company_registration_no,
                    company_vat_number: model.company_vat_number,
                    zip_code: model.zip_code,
                    method: 'bank_transfer'     // TODO
                })
                    .then(() => {
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_product_edit_error'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onCompanyEditClick(): void {
        let model = new ModalsCompanyInformationModel(
            true,
            this.productPaymentDetails.city,
            this.productPaymentDetails.company_authorized_email,
            this.productPaymentDetails.company_authorized_phone,
            this.productPaymentDetails.company_name,
            this.productPaymentDetails.company_web,
            this.productPaymentDetails.country,
            this.productPaymentDetails.invoice_email,
            this.productPaymentDetails.street,
            this.productPaymentDetails.street_number,
            this.productPaymentDetails.company_registration_no,
            this.productPaymentDetails.company_vat_number,
            this.productPaymentDetails.zip_code
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.companyUpdate(this.customer.id, {
                    city: model.city,
                    company_authorized_email: model.company_authorized_email,
                    company_authorized_phone: model.company_authorized_phone,
                    company_name: model.company_name,
                    company_web: model.company_web,
                    country: model.country,
                    invoice_email: model.invoice_email,
                    street: model.street,
                    street_number: model.street_number,
                    company_registration_no: model.company_registration_no,
                    company_vat_number: model.company_vat_number,
                    zip_code: model.zip_code,
                })
                    .then(() => {
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_company_edit_error'), reason));
                        this.refresh();
                    });
            }
        });
    }


}
