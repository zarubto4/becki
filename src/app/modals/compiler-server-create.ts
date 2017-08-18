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

export class ModalsCreateCompilerServerModel extends ModalModel {
    constructor(
        public personal_server_name: string = '',
        public server_url: string = '',
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-compiler-create-server',
    templateUrl: './compiler-server-create.html'
})
export class ModalsCreateCompilationServerComponent implements OnInit {

    @Input()
    modalModel: ModalsCreateCompilerServerModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'personal_server_name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]],
            'server_url': ['', [Validators.required]]   // TODO Valid URL
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['personal_server_name'])).setValue(this.modalModel.personal_server_name);
        (<FormControl>(this.form.controls['server_url'])).setValue(this.modalModel.server_url);
    }

    onSubmitClick(): void {
        this.modalModel.personal_server_name = this.form.controls['personal_server_name'].value;
        this.modalModel.server_url = this.form.controls['server_url'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
