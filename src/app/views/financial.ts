/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
/**
 * Created by dominik.krisztof on 02.11.16.
 */


import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IProduct } from '../backend/TyrionAPI';
import { FlashMessageError } from '../services/NotificationService';


@Component({
    selector: 'bk-view-financial',
    templateUrl: './financial.html'
})
export class FinancialComponent extends BaseMainComponent implements OnInit {

    products: IProduct[];

    // TODO in future here will be not boolean, but new ENUM acording new Tyrion API
    productStatusTranslate: { [key: string]: string } = {
        'false': 'All activities such as running instances in cloud or hardware data services are temporarily suspended. ' +
                 'During the inactivity, no fees are charged. This product can not be removed by user. Only by technical support. After six months of inactivity, it will be archived.',
        'true':  'The financial product is activated. '
    };

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    onProductClick(product: IProduct): void {
        // console.log(product);
        this.router.navigate(['/financial', product.id]);
    }

    onAddProductClick(): void {
        this.router.navigate(['/financial/product-registration']);
    }

    onEditClick(product: IProduct): void {}

    refresh(): void {
        this.blockUI();
        this.backendService.getAllProducts()
            .then(products =>  {
                this.products = products;
                this.unblockUI();
            })
            .catch(reason =>  {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_products_cant_load', reason)));
                this.unblockUI();
            });
    }
}




