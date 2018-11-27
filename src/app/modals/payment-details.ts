/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { ModalModel } from '../services/ModalService';
import { PaymentDetailsData, PaymentDetailsOptions } from '../components/PaymentDetailsFormComponent';

export class ModalsPaymentDetailsModel extends ModalModel {
    constructor(
        public create: boolean,
        public paymentOptions: PaymentDetailsOptions,
        public paymentDetails: PaymentDetailsData
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-payment-details',
    templateUrl: './payment-details.html'
})
export class ModalsPaymentDetailsComponent implements OnInit {

    @Input()
    modalModel: ModalsPaymentDetailsModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    paymentOptions: PaymentDetailsOptions;

    paymentDetails: PaymentDetailsData = null;

    valid = true;

    constructor() {}

    ngOnInit() {
        this.paymentDetails = this.modalModel.paymentDetails;
    }

    onSubmitClick(): void {
        this.modalModel.paymentDetails = this.paymentDetails;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
