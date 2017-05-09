/**
 * Created by davidhradek on 28.11.16.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { IBProgramVersion, IBProgramVersionShortDetail } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';


export class ModalsBlockoVersionSelectModel extends ModalModel {
    constructor(public programVersions: IBProgramVersionShortDetail[], public programVersion: string = '') {
        super();
    }
}

@Component({
    selector: 'bk-modals-blocko-version-select',
    templateUrl: './blocko-version-select.html'
})
export class ModalsBlockoVersionSelectComponent implements OnInit {

    @Input()
    modalModel: ModalsBlockoVersionSelectModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    options: FormSelectComponentOption[];

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'programVersion': ['', [Validators.required]]
        });
    }

    ngOnInit() {
        this.options = this.modalModel.programVersions.map((pv) => {
            pv.version_description
            return {
                label: pv.version_name + (pv.version_description?' - ' + pv.version_description:''),
                value: pv.version_id
            };
        });
        (<FormControl>(this.form.controls['programVersion'])).setValue(this.modalModel.programVersion);
    }

    onSubmitClick(): void {
        this.modalModel.programVersion = this.form.controls['programVersion'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
