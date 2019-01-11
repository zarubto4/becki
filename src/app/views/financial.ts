/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
/**
 * Created by dominik.krisztof on 02.11.16.
 */


import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IProduct } from '../backend/TyrionAPI';
import { FlashMessageSuccess } from '../services/NotificationService';
import { ModalsFinancialProductModel } from '../modals/financial-product';
import { IError } from '../services/_backend_class/Responses';


@Component({
    selector: 'bk-view-financial',
    templateUrl: './financial.html'
})
export class FinancialComponent extends _BaseMainComponent implements OnInit {

    products: IProduct[];

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    onEditClick(product: IProduct): void {
        let model = new ModalsFinancialProductModel(
            true,
            product.name,
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.productEditDetails(product.id, {
                    name: model.name,
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_products_edit_success', model.name)));
                        this.refresh();
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.productsGetUserOwnList()
            .then(products => {
                this.products = products;
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });
    }

    onDrobDownEmiter (action: string, product: IProduct): void {

        if (action === 'edit_product') {
            this.onEditClick(product);
        }
    }
}




