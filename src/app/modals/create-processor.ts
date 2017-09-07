/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiValidators } from '../helpers/BeckiValidators';


export class ModalsCreateProcessorModel extends ModalModel {
    constructor(
        public description: string = '',
        public processor_code: string = '',
        public processor_name: string = '',
        public speed: number = 0,
        public edit: boolean = false
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-create-processor',
    templateUrl: './create-processor.html'
})
export class ModalsCreateProcessorComponent implements OnInit {

    @Input()
    modalModel: ModalsCreateProcessorModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'description': ['', [Validators.required, Validators.minLength(8)]],
            'processor_code': ['', [Validators.required, Validators.minLength(4)]],
            'processor_name': ['', [Validators.required, Validators.minLength(4)]],
            'speed': [0, [Validators.required, BeckiValidators.number]]
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['processor_code'])).setValue(this.modalModel.processor_code);
        (<FormControl>(this.form.controls['processor_name'])).setValue(this.modalModel.processor_name);
        (<FormControl>(this.form.controls['speed'])).setValue(this.modalModel.speed);
    }

    onSubmitClick(): void {
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.processor_code = this.form.controls['processor_code'].value;
        this.modalModel.processor_name = this.form.controls['processor_name'].value;
        this.modalModel.speed = this.form.controls['speed'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
