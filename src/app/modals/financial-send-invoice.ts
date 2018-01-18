/**
 * Created by dominikKrisztof on 1.2.17.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiValidators } from './../helpers/BeckiValidators';


export class ModalsSendInvoiceModel extends ModalModel {
    constructor(public name: string = '', public invoiceID: string = '', public email: string = '') {
        super();
    }
}

@Component({
    selector: 'bk-modals-send-invoice',
    templateUrl: './financial-send-invoice.html'
})
export class ModalsSendInvoiceComponent implements OnInit {

    @Input()
    modalModel: ModalsSendInvoiceModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    differentEmail: boolean= false;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'email': [this.modalModel.email,
            [BeckiValidators.condition(() => this.differentEmail, Validators.required), BeckiValidators.condition(() => this.differentEmail, BeckiValidators.email)]]
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['email'])).setValue(this.modalModel.email);
    }

    checkboxChanged(value: boolean) {
        this.differentEmail = value;
    }

    onSubmitClick(): void {
        this.modalModel.email = this.form.controls['email'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
