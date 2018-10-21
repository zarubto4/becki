import { Component, Input } from '@angular/core';


@Component({
    selector: 'bk-payment-method-component',
    /* tslint:disable */
    template: `
        <span *ngIf="method == 'INVOICE_BASED'" class="font-green-jungle bold">
            <i class="fa fa-lg fa-fw fa-exchange"></i> {{method|bkTranslateTable:this:'payment_method'}}
        </span>
        <span *ngIf="method == 'CREDIT_CARD'" class="font-red-flamingo bold">
            <i class="fa fa-lg fa-fw fa-credit-card"></i> {{method|bkTranslateTable:this:'payment_method'}}
        </span>
       
        <span *ngIf="!method" class="font-red-flamingo bold">
            <i class="fa fa-lg fa-fw fa-question"></i> {{'NOT_SET'|bkTranslateTable:this:'payment_method'}}
        </span>
    `
    /* tslint:enable */
})

export class PaymentMethodComponent {

    @Input()
    method: string = '';

}
