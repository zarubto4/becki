/*
 * © 2016-2018 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IProduct, IProductExtension } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { FlashMessageError } from '../services/NotificationService';
import { IError } from '../services/_backend_class/Responses';


@Component({
    selector: 'bk-view-financial-product-extensions',
    templateUrl: './financial-product-extensions.html'
})
export class FinancialProductExtensionsComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    product: IProduct = null;

    extensions: IProductExtension[] = [];

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

    onDrobDownEmiter (action: string, extension: IProductExtension): void {
        if (action === 'deactivate_extension') {
            this.onExtensionDeactivate(extension);
        }

        if (action === 'activate_extension') {
            this.onExtensionActivate(extension);
        }
    }

    onExtensionActivate(extension: IProductExtension): void {
        this.tyrionBackendService.productExtensionActivate(extension.id)
            .then(() => {
                this.refresh();
            })
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.refresh();
            });
    }

    onExtensionDeactivate(extension: IProductExtension): void {
        this.tyrionBackendService.productExtensionDeactivate(extension.id)
            .then(() => {
                this.refresh();
            })
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.refresh();
            });
    }

    onExtensionClick(extension: IProductExtension) {
        this.router.navigate(['financial', this.id, 'extensions', extension.id]);
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([this.tyrionBackendService.productGet(this.id), this.tyrionBackendService.productExtensionGetListProduct(this.id)])
            .then((values: [IProduct, IProductExtension[]]) => {
                this.product = values[0];
                this.extensions = values[1];
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError('Product cannot be loaded.', reason));
                this.unblockUI();
            });
    }
}
