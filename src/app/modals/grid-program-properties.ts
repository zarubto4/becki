/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IGridProgram } from '../backend/TyrionAPI';


export class ModalsGridProgramPropertiesModel extends ModalModel {
    constructor(public grid_project_id: string, public program?: IGridProgram) {
        super();
    }
}

@Component({
    selector: 'bk-modals-grid-program-properties',
    templateUrl: './grid-program-properties.html'
})
export class ModalsGridProgramPropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsGridProgramPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'name': [this.modalModel.program != null ? this.modalModel.program.name : '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.program && this.modalModel.program.name.length > 3 && this.modalModel.program.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'GridProgram', null, this.modalModel.grid_project_id)
                )
            ],
            'description': [this.modalModel.program != null ? this.modalModel.program.description : '', [Validators.maxLength(255)]],
            'tags': [this.modalModel.program != null ? this.modalModel.program.tags : []]
        });
    }

    onSubmitClick(): void {

        if (this.modalModel.program == null) {
            // @ts-ignore
            this.modalModel.program = {};
        }

        this.modalModel.program.name = this.form.controls['name'].value;
        this.modalModel.program.description = this.form.controls['description'].value;
        this.modalModel.program.tags = this.form.controls['tags'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
