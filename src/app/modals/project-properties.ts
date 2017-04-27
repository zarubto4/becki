/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption, formSelectComponentOptionsMaker } from '../components/FormSelectComponent';
import { IApplicableProduct } from '../backend/TyrionAPI';


export class ModalsProjectPropertiesModel extends ModalModel {
    constructor(
        public products: IApplicableProduct[],
        public name: string = '',
        public description: string = '',
        public product: string = '',
        public edit: boolean = false,
        public exceptName: string = null
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

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(4)], BeckiAsyncValidators.condition((value) => {
                return !(this.modalModel && this.modalModel.exceptName && this.modalModel.exceptName === value);
            }, BeckiAsyncValidators.projectNameTaken(this.backendService))],
            'description': [''],
            'product': ['', [Validators.required]]
        });
    }

    ngOnInit() {
        // TODO vypsat do závorky o který product type se jedná? něco jako  product_individual_name+(product_type)?
        this.options = formSelectComponentOptionsMaker(this.modalModel.products, 'id', '%name% (%tariff%)', true);
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
