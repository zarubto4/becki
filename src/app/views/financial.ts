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

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    onProductClick(product: IProduct): void {
        this.router.navigate(['/financial', product.id]);
    }

    onAddProductClick(): void {
        this.router.navigate(['/financial/product-registration']);
    }

    onSettingsClick(): void {
        alert('TODO!'); // TODO !!!
    }

    onEditClick(product: IProduct): void { }

    refresh(): void {
        this.blockUI();
        this.backendService.productsGetUserOwnList()
            .then(products => {
                this.products = products;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_products_cant_load', reason)));
                this.unblockUI();
            });
    }
}




