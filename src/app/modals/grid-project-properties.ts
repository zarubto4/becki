/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IGridProject } from '../backend/TyrionAPI';


export class ModalsGridProjectPropertiesModel extends ModalModel {
    constructor(public project_id: string, public project?: IGridProject) {
        super();
    }
}

@Component({
    selector: 'bk-modals-grid-project-properties',
    templateUrl: './grid-project-properties.html'
})
export class ModalsGridProjectPropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsGridProjectPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'name': [this.modalModel.project != null ? this.modalModel.project.name : '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.project && this.modalModel.project.name.length > 3 && this.modalModel.project.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'GridProject',  this.modalModel.project_id)
                )
            ],
            'description': [this.modalModel.project != null ? this.modalModel.project.description : '', [Validators.maxLength(255)]],
            'tags': [this.modalModel.project != null ? this.modalModel.project.tags.slice() : []]
        });
    }

    onSubmitClick(): void {

        if (this.modalModel.project == null) {
            // @ts-ignore
            this.modalModel.project = {};
        }

        this.modalModel.project.name = this.form.controls['name'].value;
        this.modalModel.project.description = this.form.controls['description'].value;
        this.modalModel.project.tags = this.form.controls['tags'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
