/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiValidators } from '../helpers/BeckiValidators';

export class ModalsFinancialProductModel extends ModalModel {
    constructor(
        public edit: boolean = false,
        public name: string = ''
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-financial-product',
    templateUrl: './financial-product.html'
})
export class ModalsFinancialProductComponent implements OnInit {

    @Input()
    modalModel: ModalsFinancialProductModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(4)]],
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
    }

    onSubmitClick(): void {
        this.modalModel.name = this.form.controls['name'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
