/**
 * Created by dominik.krisztof on 01.12.16.
 */
/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { ICustomer, IProduct } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { ContactFormData } from '../components/ContactFormComponent';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-financial-product-billing',
    templateUrl: './financial-product-billing.html'
})
export class FinancialProductBillingComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    product: IProduct = null;
    owner: ICustomer = null;

    constructor(injector: Injector) {
        super(injector);
    };

    createContactData(data: ContactFormData) {
        this.blockUI();
        this.tyrionBackendService.contactCreateCustomer(this.product.owner.id, data)
            .then((contact) => {
                this.owner.contact = contact;
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });
    }


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
            this.owner = this.product.owner;

            this.unblockUI();
        }).catch((reason: IError) => {
            this.fmError(reason);
            this.unblockUI();
        });

    }

}
