/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';

export class ModalsDatabaseModel extends ModalModel {
    constructor(public name: string = '', public description: string = '', public firstCollection: string = '') {
        super();
    }
}

@Component({
    selector: 'bk-modals-database-new',
    templateUrl: './database-new.html'
})
export class ModalsDatabaseNewComponent implements OnInit {

    @Input()
    modalModel: ModalsDatabaseModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'description': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]],
            'firstCollection': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30), Validators.pattern('([A-Z][a-z0-9]*)*')]]
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['firstCollection'])).setValue(this.modalModel.firstCollection);
    }

    onSubmitClick(): void {
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.firstCollection = this.form.controls['firstCollection'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }

}
