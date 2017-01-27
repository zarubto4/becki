/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

/**
 * Created by dominik.krisztof on 10.11.16.
 */

import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IProduct } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';



@Component({
    selector: 'bk-view-financial-product',
    templateUrl: './financial-product.html',

})
export class FinancialProductComponent extends BaseMainComponent implements OnInit, OnDestroy {

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

    onAddCreditsClick(): void {
        alert('TODO!'); // TODO !!!
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }



    refresh(): void {
        this.blockUI();
        this.backendService.getAllProducts()
            .then(products => {
                this.product = products.find(product => '' + product.id === this.id); // TODO: make product id string in Tyrion!!! [DH]
                this.unblockUI();
            })
            .catch(error => {
                this.unblockUI();
            });

    }
}
