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
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { formSelectComponentOptionsMaker } from '../components/FormSelectComponent';
import { IApplicableProduct } from '../backend/TyrionAPI';
import { ModalModel } from '../services/ModalService';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { IMyDpOptions } from 'mydatepicker';

export class ModalsCreateTypeOfBoardBatchModel extends ModalModel {
    constructor(
        public edit: boolean = false,
        public revision: string = '',
        public production_batch: string = '',
        public pcb_manufacture_name: string = '',
        public pcb_manufacture_id: string = '',
        public assembly_manufacture_name: string = '',
        public assembly_manufacture_id: string = '',
        public mac_address_start: number = 0,
        public mac_address_end: number = 0,
        public ean_number: number = 0,
        public date_of_assembly: string = '',
        public customer_product_name: string = '',
        public customer_company_name: string = '',
        public customer_company_made_description: string = '',
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-type-of-board-batch-create',
    templateUrl: './type-of-board-batch-create.html'
})
export class ModalsCreateTypeOfBoardBatchComponent implements OnInit {

    @Input()
    modalModel: ModalsCreateTypeOfBoardBatchModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    dateNow = new Date();
    dateOption: IMyDpOptions = { // can be found here: https://github.com/kekeh/mydatepicker/blob/master/README.md#options-attribute
        dateFormat: 'dd.mm.yyyy',
        showTodayBtn: true,
        disableUntil: {
            year: this.dateNow.getFullYear() + 1,
            month: this.dateNow.getMonth() + 12,
            day: this.dateNow.getDate() - 1
        },
        disableSince: {
            year: this.dateNow.getFullYear(),
            month: this.dateNow.getMonth() + 12,
            day: this.dateNow.getDate()
        },
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        inline: false
    };

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'revision': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
            'production_batch': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
            'assembly_manufacture_name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'assembly_manufacture_id': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'pcb_manufacture_name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'pcb_manufacture_id': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'mac_address_start': [ 0, [Validators.required, Validators.minLength(15), Validators.maxLength(15), BeckiValidators.number]],
            'mac_address_end': [ 0, [Validators.required, Validators.minLength(15), Validators.maxLength(15), BeckiValidators.number]],
            'ean_number': [0, [Validators.required, Validators.minLength(13), Validators.maxLength(13), BeckiValidators.number]],
            'date_of_assembly': ['', [Validators.required, Validators.minLength(4)]],
            'customer_product_name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(24)]],
            'customer_company_name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'customer_company_made_description': ['', [Validators.required, Validators.minLength(12), Validators.maxLength(60)]],
        });
    }

    ngOnInit() {

        (<FormControl>(this.form.controls['revision'])).setValue(this.modalModel.revision);
        (<FormControl>(this.form.controls['production_batch'])).setValue(this.modalModel.production_batch);
        (<FormControl>(this.form.controls['assembly_manufacture_name'])).setValue(this.modalModel.assembly_manufacture_name);
        (<FormControl>(this.form.controls['assembly_manufacture_id'])).setValue(this.modalModel.assembly_manufacture_id);
        (<FormControl>(this.form.controls['pcb_manufacture_name'])).setValue(this.modalModel.pcb_manufacture_name);
        (<FormControl>(this.form.controls['pcb_manufacture_id'])).setValue(this.modalModel.pcb_manufacture_id);
        (<FormControl>(this.form.controls['mac_address_start'])).setValue(this.modalModel.mac_address_start);
        (<FormControl>(this.form.controls['mac_address_end'])).setValue(this.modalModel.mac_address_end);
        (<FormControl>(this.form.controls['ean_number'])).setValue(this.modalModel.ean_number);
        (<FormControl>(this.form.controls['date_of_assembly'])).setValue(this.modalModel.date_of_assembly);
        (<FormControl>(this.form.controls['customer_product_name'])).setValue(this.modalModel.customer_product_name);
        (<FormControl>(this.form.controls['customer_company_name'])).setValue(this.modalModel.customer_company_name);
        (<FormControl>(this.form.controls['customer_company_made_description'])).setValue(this.modalModel.customer_company_made_description);
    }

    onSubmitClick(): void {
        this.modalModel.revision = this.form.controls['revision'].value;
        this.modalModel.production_batch = this.form.controls['production_batch'].value;
        this.modalModel.assembly_manufacture_name = this.form.controls['assembly_manufacture_name'].value;
        this.modalModel.assembly_manufacture_id = this.form.controls['assembly_manufacture_id'].value;
        this.modalModel.pcb_manufacture_name = this.form.controls['pcb_manufacture_name'].value;
        this.modalModel.pcb_manufacture_id = this.form.controls['pcb_manufacture_id'].value;
        this.modalModel.mac_address_start = this.form.controls['mac_address_start'].value;
        this.modalModel.mac_address_end = this.form.controls['mac_address_end'].value;
        this.modalModel.ean_number = this.form.controls['ean_number'].value;
        this.modalModel.date_of_assembly = this.form.controls['date_of_assembly'].value;
        this.modalModel.customer_product_name = this.form.controls['customer_product_name'].value;
        this.modalModel.customer_company_name = this.form.controls['customer_company_name'].value;
        this.modalModel.customer_company_made_description = this.form.controls['customer_company_made_description'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
