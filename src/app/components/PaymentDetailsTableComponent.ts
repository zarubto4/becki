import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPaymentDetails } from '../backend/TyrionAPI';
import { ModalsPaymentDetailsModel } from '../modals/payment-details';
import { FlashMessageError, NotificationService } from '../services/NotificationService';
import { TranslationService } from '../services/TranslationService';
import { TyrionBackendService } from '../services/BackendService';
import { ModalService } from '../services/ModalService';
import { BlockUIService } from '../services/BlockUIService';
import { PaymentDetailsOptions } from './PaymentDetailsFormComponent';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-payment-details-table',
    templateUrl: './PaymentDetailsTableComponent.html'
})
export class PaymentDetailsTableComponent  {

    @Input() edit = false;

    @Input() title: string;

    _paymentDetails: IPaymentDetails;

    @Input()
    set paymentDetails(data: IPaymentDetails) {
        this._paymentDetails = data;
        this.empty = data.payment_method === null;
    }

    get paymentDetails(): IPaymentDetails {
        return this._paymentDetails;
    }

    @Output() paymentDetailsChange = new EventEmitter<IPaymentDetails>();

    empty: boolean;

    constructor(private tyrionBackendService: TyrionBackendService, private modalService: ModalService,
        private notificationService: NotificationService, private blockUIService: BlockUIService, private translationService: TranslationService) {
    }

    editPaymentDetails() {
        if (!this.edit || !this.paymentDetails.id) {
            return;
        }

        const paymentOptions: PaymentDetailsOptions = {
            payment_methods: this.paymentDetails.payment_methods,
            payment_details_required: true
        };

        let model = new ModalsPaymentDetailsModel (this.empty, paymentOptions, this.paymentDetails);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUIService.blockUI();
                this.tyrionBackendService.paymentEditDetails(this.paymentDetails.id, model.paymentDetails)
                    .then((paymentDetails) => {
                        this.paymentDetails = paymentDetails;
                        this.blockUIService.unblockUI();
                        this.paymentDetailsChange.emit(paymentDetails);
                    })
                    .catch((reason: IError) => {
                        this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_product_edit_error', this), reason));
                        this.blockUIService.unblockUI();
                    });
            }
        });
    }
}
