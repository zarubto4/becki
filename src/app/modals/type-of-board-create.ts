/**
 * Created by davidhradek on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IProcessor, IProducer } from '../backend/TyrionAPI';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { BackendService } from '../services/BackendService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { formSelectComponentOptionsMaker } from '../components/FormSelectComponent';
import { IApplicableProduct } from '../backend/TyrionAPI';
import { ModalModel } from '../services/ModalService';

export class ModalsCreateTypeOfBoardModel extends ModalModel {
    constructor(
        public processors: IProcessor[],
        public producers: IProducer[],
        public name: string = '',
        public description: string = '',
        public connectible_to_internet: boolean = false,
        public compiler_target_name: string = '',
        public processor: string = '',          // can be null (crate)
        public producer: string = '',           // can be null (crate)
        public edit: boolean = false            // true - its only for  edit. False for new Creation
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-type-of-board-create',
    templateUrl: './type-of-board-create.html'
})
export class ModalsCreateTypeOfBoardComponent implements OnInit {

    @Input()
    modalModel: ModalsCreateTypeOfBoardModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    producer_options: FormSelectComponentOption[] = null;
    processor_options: FormSelectComponentOption[] = null;

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'description': ['', [Validators.required, Validators.minLength(4)]],
            'name': ['', [Validators.required, Validators.minLength(4)]],
            'connectible_to_internet': ['', [Validators.required]],
            'compiler_target_name': ['', [Validators.required, Validators.minLength(4)]],
            'producer': ['', [Validators.required]],
            'processor': ['', [Validators.required]]
        });
    }

    checkboxChanged(value: boolean) {
        (<FormControl>(this.form.controls['connectible_to_internet'])).setValue(value);
    }

    ngOnInit() {

        this.processor_options = this.modalModel.processors.map((pv) => {
            return {
                label: pv.processor_name,
                value: pv.id
            };
        });

        this.producer_options = this.modalModel.producers.map((pv) => {
            return {
                label: pv.name,
                value: pv.id
            };
        });

        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['connectible_to_internet'])).setValue(this.modalModel.connectible_to_internet);
        (<FormControl>(this.form.controls['compiler_target_name'])).setValue(this.modalModel.compiler_target_name);
        (<FormControl>(this.form.controls['producer'])).setValue(this.modalModel.producer);
        (<FormControl>(this.form.controls['processor'])).setValue(this.modalModel.processor);
    }

    onSubmitClick(): void {
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.connectible_to_internet = this.form.controls['connectible_to_internet'].value;
        this.modalModel.compiler_target_name = this.form.controls['compiler_target_name'].value;
        this.modalModel.producer = this.form.controls['producer'].value;
        this.modalModel.processor = this.form.controls['processor'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
