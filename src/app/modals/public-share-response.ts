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
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { BeckiValidators } from '../helpers/BeckiValidators';

export class ModalsPublicShareResponseModel extends ModalModel {
    constructor(
        public version_name: string = '',
        public version_description: string = '',
        public program_name: string = '',
        public program_description: string = '',
        public decision: boolean = false,
        public reason: string = '',
        public choice_list: FormSelectComponentOption[] = null,  // For group of widgets for example
        public choice_object: string = ''                        //  For selected group for example
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
            'version_name': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            'version_description': ['', [BeckiValidators.condition(() => (this.modalModel && this.modalModel.decision), Validators.required), Validators.maxLength(160)]],
            'program_name': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            'program_description': ['', [BeckiValidators.condition(() => (this.modalModel && this.modalModel.decision), Validators.required), Validators.maxLength(160)]],
            'reason': [''],
            'choice_object' : ['', [BeckiValidators.condition(() => (this.modalModel && this.modalModel.choice_list != null && this.modalModel.decision), Validators.required)]]
        });
    }

    ngOnInit() {

        (<FormControl>(this.form.controls['version_name'])).setValue(this.modalModel.version_name);
        (<FormControl>(this.form.controls['version_description'])).setValue(this.modalModel.version_description);
        (<FormControl>(this.form.controls['program_name'])).setValue(this.modalModel.program_name);
        (<FormControl>(this.form.controls['program_description'])).setValue(this.modalModel.program_description);
        (<FormControl>(this.form.controls['reason'])).setValue(this.modalModel.reason);

        if (this.modalModel.choice_list != null) {
            (<FormControl>(this.form.controls['choice_object'])).setValue(this.modalModel.choice_object);
        }
    }

    onSubmitClick(): void {
        this.modalModel.version_name = this.form.controls['version_name'].value;
        this.modalModel.version_description = this.form.controls['version_description'].value;
        this.modalModel.program_name = this.form.controls['program_name'].value;
        this.modalModel.program_description = this.form.controls['program_description'].value;
        this.modalModel.reason = this.form.controls['reason'].value;
        this.modalModel.choice_object = this.form.controls['choice_object'].value;
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
