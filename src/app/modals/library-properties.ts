/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { ILibrary } from '../backend/TyrionAPI';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';


export class ModalsLibraryPropertiesModel extends ModalModel {
    constructor(
        public project_id: string,
        public library?: ILibrary
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-library-properties',
    templateUrl: './library-properties.html'
})
export class ModalsLibraryPropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsLibraryPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'name': [this.modalModel.library != null ? this.modalModel.library.name : '',
                [
                    [
                        Validators.required,
                        Validators.minLength(4),
                        Validators.maxLength(32)
                    ],
                    BeckiAsyncValidators.condition(
                        (value) => {
                            return !(this.modalModel && this.modalModel.library && this.modalModel.library.name.length > 3 && this.modalModel.library.name === value);
                        },
                        BeckiAsyncValidators.nameTaken(this.backendService, 'CLibrary',  this.modalModel.project_id)
                    )
                ],
            ],
            'description': [this.modalModel.library != null ? this.modalModel.library.description : '', [Validators.maxLength(255)]],
            'tags': [this.modalModel.library != null ? this.modalModel.library.tags.slice() : []]
        });
    }

    onSubmitClick(): void {

        if (this.modalModel.library == null) {
            // @ts-ignore
            this.modalModel.library = {};
        }

        this.modalModel.library.name = this.form.controls['name'].value;
        this.modalModel.library.description = this.form.controls['description'].value;
        this.modalModel.library.tags = this.form.controls['tags'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
