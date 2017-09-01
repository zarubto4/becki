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


@Component({
    selector: 'bk-view-financial-product-billing',
    templateUrl: './financial-product-billing.html'
})
export class FinancialProductBillingComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    product: IProduct = null;
    paymentDetails: IPaymentDetails = null;
    customer: ICustomer = null;

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
        this.backendService.productsGetUserOwnList().then(products =>  {
            this.product = products.find(product => product.id === this.id);
            this.paymentDetails = this.product.payment_details;
            this.customer = this.product.customer;
            this.unblockUI();
        }).catch(error =>  {

            this.unblockUI();
        });

    }
}
