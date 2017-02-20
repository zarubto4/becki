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
        // console.log(product);
        this.router.navigate(['/financial', product.id]);
    }

    onAddProductClick(): void {
        this.router.navigate(['/financial/product-registration']);
    }


    onSettingsClick(): void {
        alert('TODO!'); // TODO !!!
    }

    onRemoveClick(product: IProduct): void {
      /*  this.modalService.showModal(new ModalsRemovalModel(product.product_individual_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteProduct(product.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The project has been removed.'));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The project cannot be removed.', reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });*/ // TODO vyřešit mazání Produktů/deaktivaci
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
                this.addFlashMessage(new FlashMessageError('Projects cannot be loaded.', reason));
                this.unblockUI();
            });
    }
}




