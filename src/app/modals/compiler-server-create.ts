/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { ICompilationServer } from '../backend/TyrionAPI';

export class ModalsCreateCompilerServerModel extends ModalModel {
    constructor(public server?: ICompilationServer) {
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

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'personal_server_name': [this.modalModel.server != null ? this.modalModel.server.personal_server_name : '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.server && this.modalModel.server.personal_server_name.length > 3 && this.modalModel.server.personal_server_name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'CodeServer',  null)
                )
            ],
            'server_url': [this.modalModel.server != null ? this.modalModel.server.server_url : '', [Validators.required]],
            'hash_certificate': [this.modalModel.server != null ? this.modalModel.server.hash_certificate : ''],
            'connection_identificator': [this.modalModel.server != null ? this.modalModel.server.connection_identificator : ''],
        });
    }

    onSubmitClick(): void {

        if (this.modalModel.server == null) {
            // @ts-ignore
            this.modalModel.server = {};
        }

        this.modalModel.server.personal_server_name = this.form.controls['personal_server_name'].value;
        this.modalModel.server.server_url = this.form.controls['server_url'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
