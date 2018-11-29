/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IDatabase } from '../backend/TyrionAPI';
import { BeckiValidators } from '../helpers/BeckiValidators';

export class ModalsDatabaseNameDescriptionModel extends ModalModel {
    public firstCollection: string = null;
    constructor(public project_id: string, public database?: IDatabase) {
        super();
    }
}

@Component({
    selector: 'bk-modals-database-edit',
    templateUrl: './database-edit.html'
})
export class ModalsDatabaseEditComponent implements OnInit {

    @Input()
    modalModel: ModalsDatabaseNameDescriptionModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'name': [this.modalModel.database != null ? this.modalModel.database.name : '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.database && this.modalModel.database.name.length > 3 && this.modalModel.database.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'Database',  this.modalModel.project_id)
                )
            ],
            'description': [this.modalModel.database != null ? this.modalModel.database.description : '', [Validators.maxLength(255)]],
            'firstCollection': ['',
                [
                    BeckiValidators.condition(() => !(this.modalModel && this.modalModel.database), Validators.required),
                    BeckiValidators.condition(() => !(this.modalModel && this.modalModel.database), Validators.minLength(4)),
                    BeckiValidators.condition(() => !(this.modalModel && this.modalModel.database), Validators.maxLength(32)),
                    BeckiValidators.condition(() => !(this.modalModel && this.modalModel.database), Validators.pattern('([a-z0-9_-]*)*'))
                ]
            ]

        });
    }

    onSubmitClick(): void {
        if (this.modalModel.database == null) {
            // @ts-ignore
            this.modalModel.database = {};
        }

        this.modalModel.database.name = this.form.controls['name'].value;
        this.modalModel.database.description = this.form.controls['description'].value;
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
