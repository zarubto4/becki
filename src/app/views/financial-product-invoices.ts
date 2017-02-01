/**
 * Created by dominik.krisztof on 01.12.16.
 */
/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { OnInit, Component, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IProduct, IInvoice } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';


@Component({
    selector: 'bk-view-financial-product-invoices',
    templateUrl: './financial-product-invoices.html'
})
export class FinancialProductInvoicesComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    product: IProduct = null;

    invoices: IInvoice[] = null;


    constructor(injector: Injector) {
        super(injector);
    };

    onAddCreditsClick(): void {

    }

    onInvoiceClick(invoice: IInvoice): void {
        this.router.navigate(['financial', this.id, 'invoices', invoice.id]); // TODO špatně routuje
    }

    onPayClick(invoice: IInvoice): void {

                this.backendService.sendInvoiceReimbursement(invoice.id).then(gopay=>console.log(gopay));
    }

    onDownloadPDFClick(invoice: IInvoice): void {
        window.open(invoice.pdf_link, '_blank');
    }

    onSendClick(): void {

    }

    onPrintClick(): void {

    }

    onSettingsClick(): void {

    }

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


    refresh(): void {
        this.blockUI();
        this.backendService.getAllProducts().then(products => {
            this.product = products.find(product => product.id === this.id);
            this.invoices = this.product.invoices;
            this.unblockUI();
        }).catch(error => {
            this.unblockUI();
        });

    }
}
