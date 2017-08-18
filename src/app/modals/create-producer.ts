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
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';


export class ModalsCreateProducerModel extends ModalModel {
    constructor(public description: string = '', public name: string = '',) {
        super();
    }
}

@Component({
    selector: 'bk-modals-create-producer',
    templateUrl: './create-producer.html'
})
export class ModalsCreateProducerComponent implements OnInit {

    @Input()
    modalModel: ModalsCreateProducerModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'description': ['', [Validators.required, Validators.minLength(4)]],
            'name': ['', [Validators.required, Validators.minLength(4)]]
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
    }

    onSubmitClick(): void {
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.name = this.form.controls['name'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
