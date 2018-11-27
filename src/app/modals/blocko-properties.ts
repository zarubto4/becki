/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { IBProgram } from '../backend/TyrionAPI';


export class ModalsBlockoPropertiesModel extends ModalModel {
    constructor(public project_id: string, public blocko?: IBProgram) {
        super();
    }
}

@Component({
    selector: 'bk-modals-blocko-properties',
    templateUrl: './blocko-properties.html'
})
export class ModalsBlockoPropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsBlockoPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'name': [this.modalModel.blocko != null ? this.modalModel.blocko.name : '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.blocko && this.modalModel.blocko.name.length > 3 && this.modalModel.blocko.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'BProgram', this.modalModel.project_id)
                )
            ],
            'description': [this.modalModel.blocko != null ? this.modalModel.blocko.description : '', [Validators.maxLength(255)]],
            'tags': [this.modalModel.blocko != null ? this.modalModel.blocko.tags : []]
        });
    }

    onSubmitClick(): void {

        if (this.modalModel.blocko == null) {
            // @ts-ignore
            this.modalModel.blocko = {};
        }


        this.modalModel.blocko.name = this.form.controls['name'].value;
        this.modalModel.blocko.description = this.form.controls['description'].value;
        this.modalModel.blocko.tags = this.form.controls['tags'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
