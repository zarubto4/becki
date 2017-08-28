/**
 * Created by davidhradek on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import {BeckiValidators} from "../helpers/BeckiValidators";

export class ModalsTariffModel extends ModalModel {
    constructor(
        public edit: boolean = false,
        public company_details_required: boolean = false,
        public color: string = '',
        public credit_for_beginning: number = 0,
        public description: string = '',
        public name: string = '',
        public identifier: string = '',
        public payment_method_required: boolean = false,
        public payment_details_required: boolean = false,
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-tariff',
    templateUrl: './tariff.html'
})
export class ModalsTariffComponent implements OnInit {

    @Input()
    modalModel: ModalsTariffModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({

            'company_details_required': ['', [ ]],
            'color': ['', [Validators.required]],
            'credit_for_beginning': ['', [Validators.required, BeckiValidators.number]],
            'description': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
            'identifier': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
            'payment_method_required': ['', [ ]],
            'payment_details_required': ['', [ ]]
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['company_details_required'])).setValue(this.modalModel.company_details_required);
        (<FormControl>(this.form.controls['color'])).setValue(this.modalModel.color);
        (<FormControl>(this.form.controls['credit_for_beginning'])).setValue(this.modalModel.credit_for_beginning);
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['identifier'])).setValue(this.modalModel.identifier);
        (<FormControl>(this.form.controls['payment_method_required'])).setValue(this.modalModel.payment_method_required);
        (<FormControl>(this.form.controls['payment_details_required'])).setValue(this.modalModel.payment_details_required);
    }

    onSubmitClick(): void {
        this.modalModel.company_details_required = this.form.controls['company_details_required'].value;
        this.modalModel.color = this.form.controls['color'].value;
        this.modalModel.credit_for_beginning = this.form.controls['credit_for_beginning'].value;
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.identifier = this.form.controls['identifier'].value;
        this.modalModel.payment_method_required = this.form.controls['payment_method_required'].value;
        this.modalModel.payment_details_required = this.form.controls['payment_details_required'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
