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
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsDeactivateModel } from '../modals/deactivate';

@Component({
    selector: 'bk-view-financial-product',
    templateUrl: './financial-product.html'
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

    onEditClick(): void {
        alert('TODO!'); // TODO !!!
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    deactivateProduct(): void {
        this.modalService.showModal(new ModalsDeactivateModel(this.product.name, false, this.translate('label_modal_body_text'))).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.productDeactivate(this.product.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_product_deactivated')));
                        this.router.navigate(['/financial']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_deactivate_product', reason)));
                        this.refresh(); // also unblockUI
                    });
            }
        });
        // TODO: remove it after translate t
        // tslint:enable
    }

    activateProduct(): void {
        this.modalService.showModal(new ModalsDeactivateModel(this.product.name, true, null)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.productActivate(this.product.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_product_activated')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_activate_product', reason)));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }


    refresh(): void {
        this.blockUI();
        this.backendService.productsGetUserOwnList()
            .then(products => {
                this.product = products.find(product => '' + product.id === this.id); // TODO: make product id string in Tyrion!!! [DH]
                this.unblockUI();
            })
            .catch(error => {
                this.unblockUI();
            });

    }
}
