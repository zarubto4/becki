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
import { IApplicableProduct } from '../backend/TyrionAPI';
import {BeckiValidators} from "../helpers/BeckiValidators";


export class ModalsProjectPropertiesModel extends ModalModel {
    constructor(
        public products: IApplicableProduct[],  // List of Product for Project registration (can be null)
        public name: string = '',               // Project name
        public description: string = '',        // Project description
        public product: string = null,            // duplicated values (can be null)
        public edit: boolean = false,           // true - its only for project edit. False is project Creation
        public exceptName: string = null        // user cannot save another project with same name - so we use this value for save control of same project
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
        this.form = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(4)], BeckiAsyncValidators.condition((value) => {
                return !(this.modalModel && this.modalModel.exceptName && this.modalModel.exceptName === value);
            }, BeckiAsyncValidators.projectNameTaken(this.backendService))],
            'description': [''],
            'product': ['', [BeckiValidators.condition(() => !this.modalModel.edit, Validators.required)]]
        });

        if (!this.modalModel.edit) {

            this.options = this.modalModel.products.map((trf) => {
                return {
                    value: trf.id,
                    label: trf.name
                };
            });
        }
        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['product'])).setValue(this.modalModel.product);
    }

    onSubmitClick(): void {
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.product = this.form.controls['product'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
