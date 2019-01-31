/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { TyrionBackendService } from '../services/BackendService';
import moment = require('moment/moment');

export class ModalsVersionDialogModel extends ModalModel {
    constructor(public parent_object_id: string, public type: ('BlockVersion' | 'WidgetVersion' | 'BProgramVersion' | 'CProgramVersion' | 'GridProgramVersion'|'Snapshot'), public object?: any) {
        super();
    }
}

@Component({
    selector: 'bk-modals-version-dialog',
    templateUrl: './version-dialog.html'
})
export class ModalsVersionDialogComponent implements OnInit {

    @Input()
    modalModel: ModalsVersionDialogModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }


    ngOnInit() {
        this.form = this.formBuilder.group({
            'name': [this.modalModel.object != null ? this.modalModel.object.name : moment().format('YYYY-MM-DD HH:mm:ss'),
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.object && this.modalModel.object.name.length > 3 && this.modalModel.object.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, this.modalModel.type, this.modalModel.parent_object_id)
                )
            ],
            'description': [this.modalModel.object != null ? this.modalModel.object.description : '', [Validators.maxLength(255)]],
            'tags': [this.modalModel.object != null ? this.modalModel.object.tags : []],
        });
    }

    onSubmitClick(): void {

        if (this.modalModel.object == null) {
            // @ts-ignore
            this.modalModel.object = {};
        }

        this.modalModel.object.name = this.form.controls['name'].value;
        this.modalModel.object.description = this.form.controls['description'].value;
        this.modalModel.object.tags = this.form.controls['tags'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }


}
