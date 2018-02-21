/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IProduct } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsDeactivateModel } from '../modals/deactivate';
import { ModalsFinancialProductModel } from '../modals/financial-product';

@Component({
    selector: 'bk-view-financial-product',
    templateUrl: './financial-product.html'
})
export class FinancialProductComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    product_id: string;

    routeParamsSubscription: Subscription;

    product: IProduct = null;

    constructor(injector: Injector) {
        super(injector);
    };


    ngOnInit(): void {
        this.blockUI();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.product_id = params['product'];
            this.refresh();
            this.unblockUI();
        });
    }

    onPortletClick(action: string): void {
        if (action === 'edit_product') {
            this.onEditClick();
        }

        if (action === 'deactivate_product') {
            this.deactivateProduct();
        }

        if (action === 'activate_product') {
            this.activateProduct();
        }
    }

    onEditClick(): void {
        let model = new ModalsFinancialProductModel(
            true,
            this.product.name,
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.productEditDetails(this.product_id, {
                    name: model.name,
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_tariff_edit_success', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_tariff_edit_error', model.name, reason)));
                        this.refresh();
                    });
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    deactivateProduct(): void {
        this.modalService.showModal(new ModalsDeactivateModel(this.product.name, false, this.translate('label_modal_body_text'))).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.productDeactivate(this.product_id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_product_deactivated')));
                        this.onFinanceClick();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_deactivate_product'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    activateProduct(): void {
        this.modalService.showModal(new ModalsDeactivateModel(this.product.name, true, null)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.productActivate(this.product_id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_product_activated')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_activate_product'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }


    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.productGet(this.product_id).then(product => {
            this.product = product;
            this.unblockUI();
        })
            .catch(error => {
                this.unblockUI();
            });

    }
}
