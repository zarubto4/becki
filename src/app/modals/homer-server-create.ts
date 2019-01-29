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
import { IHomerServer, IWidget } from '../backend/TyrionAPI';


export class ModalsCreateHomerServerModel extends ModalModel {
    constructor(public project_id: string, public server?: IHomerServer) {
        super();
    }
}

@Component({
    selector: 'bk-modals-homer-create-server',
    templateUrl: './homer-server-create.html'
})
export class ModalsCreateHomerServerComponent implements OnInit {

    @Input()
    modalModel: ModalsCreateHomerServerModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'name': [this.modalModel.server != null ? this.modalModel.server.name : '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.server && this.modalModel.server.name.length > 3 && this.modalModel.server.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'HomerServer',  this.modalModel.project_id)
                )
            ],
            'description': [this.modalModel.server != null ? this.modalModel.server.description : '', [Validators.maxLength(255)]],
            'mqtt_port': [this.modalModel.server != null ? this.modalModel.server.mqtt_port : '', [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'grid_port': [this.modalModel.server != null ? this.modalModel.server.grid_port : '', [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'web_view_port': [this.modalModel.server != null ? this.modalModel.server.web_view_port : '', [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'hardware_logger_port': [this.modalModel.server != null ? this.modalModel.server.hardware_logger_port : '', [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'rest_api_port': [this.modalModel.server != null ? this.modalModel.server.rest_api_port : '', [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
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

        this.modalModel.server.name = this.form.controls['name'].value;
        this.modalModel.server.description = this.form.controls['description'].value;
        this.modalModel.server.mqtt_port = this.form.controls['mqtt_port'].value;
        this.modalModel.server.grid_port = this.form.controls['grid_port'].value;
        this.modalModel.server.web_view_port = this.form.controls['web_view_port'].value;
        this.modalModel.server.hardware_logger_port = this.form.controls['hardware_logger_port'].value;
        this.modalModel.server.rest_api_port = this.form.controls['rest_api_port'].value;
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
