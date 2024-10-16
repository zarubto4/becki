/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiValidators } from '../helpers/BeckiValidators';


export class ModalsInstanceApiPropertiesModel extends ModalModel {
    constructor(public description: string = '', public edit: boolean = false, public mesh_prefix_required: boolean = false, public prefix: string = '') {
        super();
    }
}

@Component({
    selector: 'bk-modals-instance-api-properties',
    templateUrl: './instance-api-properties.html'
})
export class ModalsInstanceApiPropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsInstanceApiPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {

        this.form = this.formBuilder.group({
            'description': ['', [Validators.required, Validators.minLength(4)]],
            'prefix': ['', [BeckiValidators.condition(() => this.modalModel.mesh_prefix_required, Validators.required), Validators.minLength(4), Validators.maxLength(16)]],
        });

        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['prefix'])).setValue(this.modalModel.prefix);
    }

    onSubmitClick(): void {
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.prefix = this.form.controls['prefix'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
