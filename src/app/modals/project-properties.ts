/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption, formSelectComponentOptionsMaker } from '../components/FormSelectComponent';
import { IApplicableProduct, IProject } from '../backend/TyrionAPI';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { ModalsRemovalModel } from './removal';


export class ModalsProjectPropertiesModel extends ModalModel {
    public product_id: string;
    constructor(
        public products: IApplicableProduct[],  // List of Product for Project registration (can be null)
        public project?: IProject
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-project-properties',
    templateUrl: './project-properties.html'
})
export class ModalsProjectPropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsProjectPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options: FormSelectComponentOption[] = null;

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {

        if (this.modalModel.products) {
            this.options = this.modalModel.products.map((trf) => {
                return {
                    value: trf.id,
                    label: trf.name
                };
            });
        }

        this.form = this.formBuilder.group({
            'name': [this.modalModel.project != null ? this.modalModel.project.name : '',
                [
                    Validators.required,
                    Validators.minLength(4)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.project && this.modalModel.project.name.length > 3 && this.modalModel.project.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'Project')
                )
            ],
            'description': [this.modalModel.project != null ? this.modalModel.project.description : ''],
            'product': [this.modalModel.project ? this.modalModel.project.product.id : '', [BeckiValidators.condition(() => this.modalModel.project == null, Validators.required)]],
            'tags': [this.modalModel.project != null ? this.modalModel.project.tags.slice() : []]
        });
    }

    onSubmitClick(): void {
        if (this.modalModel.project == null) {
            // @ts-ignore
            this.modalModel.project = {};
        }
        this.modalModel.project.name        = this.form.controls['name'].value;
        this.modalModel.project.description = this.form.controls['description'].value;
        this.modalModel.product_id          = this.form.controls['product'].value;
        this.modalModel.project.tags        = this.form.controls['tags'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
