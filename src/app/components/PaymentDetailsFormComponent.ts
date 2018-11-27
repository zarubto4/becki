import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslationService } from '../services/TranslationService';
import { TyrionBackendService } from '../services/BackendService';
import { FormSelectComponentOption } from './FormSelectComponent';

@Component({
    selector: 'bk-payment-details-form',
    templateUrl: './PaymentDetailsFormComponent.html'
})
export class PaymentDetailsFormComponent implements OnInit {

    @Input() allowTypeSelection = true;

    @Input() disabled = false;

    @Output() valid = new EventEmitter<boolean>();

    private _paymentDetailsData: PaymentDetailsData;

    @Input()
    set paymentDetails(data: PaymentDetailsData) {
        if (data === this.paymentDetails) {
            return;
        }
        this._paymentDetailsData = data;

        if (!this._paymentDetailsData) {
            return;
        }

        if (this.optionsPaymentMethod.length > 0) {
            this.formGroup.controls['payment_method'].setValue(this.paymentDetails.payment_method);
        }
    }

    get paymentDetails(): PaymentDetailsData {
        return this._paymentDetailsData;
    }

    @Output() paymentDetailsChange = new EventEmitter<PaymentDetailsData>();

    @Input()
    set paymentOptions(paymentOptions: PaymentDetailsOptions) {
        this.optionsPaymentMethod = [];

        // represent null as a correct selectable value 'NOT_SET'
        const methods = paymentOptions.payment_details_required ? paymentOptions.payment_methods : ['NOT_SET', ...paymentOptions.payment_methods];
        methods.map(method => this.optionsPaymentMethod.push({
            label: this.translationService.translateTable(method, this, 'payment_method'),
            value: method
        }));

        this.formGroup.controls['payment_method'].setValue(this.paymentDetails ? this.paymentDetails.payment_method : null);
    }

    optionsPaymentMethod: FormSelectComponentOption[] = [];

    formGroup: FormGroup;

    constructor(private formBuilder: FormBuilder, private tyrionBackendService: TyrionBackendService, private translationService: TranslationService) {

        this.formGroup = this.formBuilder.group({
            'payment_method': ['', [Validators.required]]
        });
    }

    ngOnInit() {
        // listen for form changed
        this.formGroup.valueChanges.subscribe(val => {
            setTimeout(() => {
                // because of Tyrion and database - we represent 'not set' as null
                if (val.payment_method === 'NOT_SET') {
                    val.payment_method = null;
                }

                this._paymentDetailsData = val;
                this.paymentDetailsChange.emit(this._paymentDetailsData);
                this.valid.emit(this.formGroup.valid);
            });
        });

        // check if form is valid
        // setTimeout: because of ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
            this.formGroup.updateValueAndValidity();
            this.valid.emit(this.formGroup.valid);
        });
    }
}

export interface PaymentDetailsData {
    payment_method: ('INVOICE_BASED'|'CREDIT_CARD');
}

export interface PaymentDetailsOptions {
    payment_methods: ('INVOICE_BASED'|'CREDIT_CARD')[];

    payment_details_required: boolean;
}
