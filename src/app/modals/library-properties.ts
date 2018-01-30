/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption, formSelectComponentOptionsMaker } from '../components/FormSelectComponent';
import { ITypeOfBoard } from '../backend/TyrionAPI';


export class ModalsLibraryPropertiesModel extends ModalModel {
    constructor(
        public name: string = '',
        public description: string = '',
        public edit: boolean = false,
        public exceptName: string = null
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
        let input: { [key: string]: any } = {
            'name': [this.modalModel.name, [Validators.required, Validators.minLength(4), Validators.maxLength(32)]],
            'description': [this.modalModel.description]
        };

        this.form = this.formBuilder.group(input);
    }

    onSubmitClick(): void {
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.description = this.form.controls['description'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
