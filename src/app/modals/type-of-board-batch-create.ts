/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { IApplicableProduct } from '../backend/TyrionAPI';
import { ModalModel } from '../services/ModalService';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { IMyDpOptions } from 'mydatepicker';

export class ModalsCreateHardwareTypeBatchModel extends ModalModel {
    constructor(
        public edit: boolean = false,
        public revision: string = '',
        public production_batch: string = '',
        public pcb_manufacture_name: string = '',
        public pcb_manufacture_id: string = '',
        public assembly_manufacture_name: string = '',
        public assembly_manufacture_id: string = '',
        public mac_address_start: string = '',
        public mac_address_end: string = '',
        public ean_number: string = '',
        public date_of_assembly: number = 0,
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
export class ModalsCreateHardwareTypeBatchComponent implements OnInit {

    @Input()
    modalModel: ModalsCreateHardwareTypeBatchModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    dateNow = new Date();
    dateOption: IMyDpOptions = { // can be found here: https://github.com/kekeh/mydatepicker/blob/master/README.md#options-attribute
        dateFormat: 'dd.mm.yyyy',
        showTodayBtn: true,
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        inline: false
    };

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'revision': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
            'production_batch': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
            'assembly_manufacture_name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'assembly_manufacture_id': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'pcb_manufacture_name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'pcb_manufacture_id': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'mac_address_start': [ 0, [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
            'mac_address_end': [ 0, [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
            'ean_number': [0, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
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

        // console.log('ModalsCreateHardwareTypeBatchComponent: control', this.form.controls['date_of_assembly'].value);
        // console.log('ModalsCreateHardwareTypeBatchComponent: control', this.form.controls['date_of_assembly'].value.formatted);
        // console.log('ModalsCreateHardwareTypeBatchComponent: control', this.form.controls['date_of_assembly'].value.jsdate);

        if (this.form.controls['date_of_assembly'].value.formatted) {
            this.modalModel.date_of_assembly = this.form.controls['date_of_assembly'].value.formatted;
        }

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
