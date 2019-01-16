/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IProduct, IProductExtension } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-financial-product-extensions-extension',
    templateUrl: './financial-product-extensions-extension.html'
})
export class FinancialProductExtensionsExtensionComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    routeParamsSubscription: Subscription;

    idExtension: string;

    idProduct: string;

    extension: IProductExtension = null;

    product: IProduct = null;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.blockUI();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.idExtension = params['productExtension'];
            this.idProduct = params['product'];
            this.refresh();
            this.unblockUI();
        });

    }

    onPortletClick(action: string): void {
        if (action === 'deactivate_extension') {
            this.onExtensionDeactivate();
        }

        if (action === 'activate_extension') {
            this.onExtensionActivate();
        }
    }

    onExtensionActivate(): void {
        this.tyrionBackendService.productExtensionActivate(this.extension.id)
            .then(() => {
                this.refresh();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.refresh();
            });
    }

    onExtensionDeactivate(): void {
        this.tyrionBackendService.productExtensionDeactivate(this.extension.id)
            .then(() => {
                this.refresh();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.refresh();
            });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([this.tyrionBackendService.productExtensionGet(this.idExtension), this.tyrionBackendService.productGet(this.idProduct)])
            .then((values: [IProductExtension, IProduct]) => {
                this.extension =  values[0];
                this.product =  values[1];
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });
    }
}
