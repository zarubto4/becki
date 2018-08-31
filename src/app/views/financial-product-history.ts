/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IProduct, IProductEvent } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';

@Component({
    selector: 'bk-view-financial-product-history',
    templateUrl: './financial-product-history.html'
})
export class FinancialProductHistoryComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    product: IProduct = null;

    productEvents: IProductEvent[];

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

    getEvents() {
        this.tyrionBackendService.eventsProduct(this.id, 1, 10).then(events =>  {
            this.productEvents = events;
        }).catch(error => {
            // this.addFlashMessage(new FlashMessageError(this.translate('flash_cellular_update_error'), error));
        });
    }

    onReferenceClicked(event: IProductEvent) {
        if (event.reference_type === 'INVOICE') {
            this.blockUI();
            this.tyrionBackendService.invoiceGet(event.reference).then(
                invoice => {
                    this.unblockUI();
                    if (invoice.invoice.update_permission) {
                        this.router.navigate(['financial', this.id, 'invoices', event.reference]);
                    } else if (invoice.invoice.invoice_number) {
                        window.open(invoice.invoice.public_html_url);
                    } else {
                        // this.addFlashMessage(new FlashMessageError(this.translate('flash_cellular_update_error'), error));
                    }
                }
            ) .catch(error => {
                // this.addFlashMessage(new FlashMessageError(this.translate('flash_cellular_update_error'), error));
                this.unblockUI();
            });

            return;
        }

        if (event.reference_type === 'EXTENSION') {
            this.router.navigate(['financial', this.id, 'extensions', event.reference]);
            return;
        }
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.productGet(this.id).then(product =>  {
            this.product = product;
            this.getEvents();
            this.unblockUI();
        }).catch(error => {
            this.unblockUI();
        });
    }
}
