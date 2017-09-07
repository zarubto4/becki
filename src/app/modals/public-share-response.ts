/**
 * Created by davidhradek on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { ModalModel } from '../services/ModalService';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BackendService } from '../services/BackendService';

export class ModalsPublicShareResponseModel extends ModalModel {
    constructor(
        public version_name: string = '',
        public version_description: string = '',
        public program_name: string = '',
        public program_description: string = '',
        public decision: boolean = false,
        public reason: string = ''
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-public-share-response',
    templateUrl: './public-share-response.html'
})
export class ModalsPublicShareResponseComponent implements OnInit {

    @Input()
    modalModel: ModalsPublicShareResponseModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'version_name': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(12)]],
            'version_description': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(160)]],
            'program_name': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
            'program_description': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
            'reason': [''],
        });
    }

    ngOnInit() {

        (<FormControl>(this.form.controls['version_name'])).setValue(this.modalModel.version_name);
        (<FormControl>(this.form.controls['version_description'])).setValue(this.modalModel.version_description);
        (<FormControl>(this.form.controls['program_name'])).setValue(this.modalModel.program_name);
        (<FormControl>(this.form.controls['program_description'])).setValue(this.modalModel.program_description);
        (<FormControl>(this.form.controls['reason'])).setValue(this.modalModel.reason);
    }

    onSubmitClick(): void {
        this.modalModel.version_name = this.form.controls['version_name'].value;
        this.modalModel.version_description = this.form.controls['version_description'].value;
        this.modalModel.program_name = this.form.controls['program_name'].value;
        this.modalModel.program_description = this.form.controls['program_description'].value;
        this.modalModel.reason = this.form.controls['reason'].value;
        this.modalClose.emit(true);
    }

    onApproveClick(value: boolean): void {
        this.modalModel.decision = value;
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
