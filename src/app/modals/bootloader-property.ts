/**
 * Created by davidhradek on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';


export class ModalsBootloaderPropertyModel extends ModalModel {
    constructor(
        public description: string = '',
        public name: string = '',
        public changing_note: string = '',
        public version_identificator: string = '',
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-bootloader-property',
    templateUrl: './bootloader-property.html'
})
export class ModalsBootloaderPropertyComponent implements OnInit {

    @Input()
    modalModel: ModalsBootloaderPropertyModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'description': ['', [Validators.required, Validators.minLength(4)]],
            'name': ['', [Validators.required, Validators.minLength(4)]],
            'changing_note': ['', [Validators.required, Validators.minLength(4)]],
            'version_identificator': ['', [Validators.required]]
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['changing_note'])).setValue(this.modalModel.changing_note);
        (<FormControl>(this.form.controls['version_identificator'])).setValue(this.modalModel.version_identificator);
    }

    onSubmitClick(): void {
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.changing_note = this.form.controls['changing_note'].value;
        this.modalModel.version_identificator = this.form.controls['version_identificator'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
