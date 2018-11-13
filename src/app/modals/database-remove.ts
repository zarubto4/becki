/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { ImportResolver } from '@angular/compiler';

export class ModalsDatabaseRemoveModel extends ModalModel {
    constructor(public id: string = '') {
        super();
    }
}

@Component({
    selector: 'bk-modals-database-remove',
    templateUrl: './database-remove.html'
})
export class ModalsDatabaseRemoveComponent implements OnInit {

    @Input()
    modalModel: ModalsDatabaseRemoveModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'id': ['', [Validators.required]],
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['id'])).setValue(this.modalModel.id);
    }

    onSubmitClick(): void {
        this.modalModel.id = this.form.controls['id'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }

}
