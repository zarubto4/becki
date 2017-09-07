/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

/**
 * Created by dominik.krisztof on 30.11.16.
 */

import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IProduct, IProductExtension } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';


@Component({
    selector: 'bk-view-financial-product-extensions',
    templateUrl: './financial-product-extensions.html'
})
export class FinancialProductExtensionsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    product: IProduct = null;

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
    editExtension(extension: IProductExtension) {

    }

    removeExtension(extension: IProductExtension) {

    }

    refresh(): void {
        this.blockUI();
        this.backendService.productGet(this.id).then(product =>  {
            this.product = product;
            this.unblockUI();
        }).catch(error =>  {

            this.unblockUI();
        });

    }
}
