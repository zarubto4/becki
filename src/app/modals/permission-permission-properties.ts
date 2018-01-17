/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';



export class ModalsPermissionPermissionPropertyModel extends ModalModel {
    constructor(public description: string = '') {
        super();
    }
}

@Component({
    selector: 'bk-modals-permission-permission-properties',
    templateUrl: './permission-permission-properties.html'
})
export class ModalsPermissionPermissionPropertyComponent implements OnInit {

    @Input()
    modalModel: ModalsPermissionPermissionPropertyModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'description': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]]
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
    }

    onSubmitClick(): void {
        this.modalModel.description = this.form.controls['description'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
