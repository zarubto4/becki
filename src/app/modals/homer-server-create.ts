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


export class ModalsCreateHomerServerModel extends ModalModel {
    constructor(
        public personal_server_name: string = '',
        public mqtt_port: number = 1883,
        public grid_port: number = 8053,
        public web_view_port: number = 8052,
        public hardware_logger_port: number = 8054,
        public rest_api_port: number = 3000,
        public server_url: string = '',
        public hash_certificate: string = null,
        public connection_identificator: string = null,
        public edit: boolean = false,
    ) {
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

        this.form = this.formBuilder.group({
            'personal_server_name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'mqtt_port': [0, [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'grid_port': [0, [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'web_view_port': [0, [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'hardware_logger_port': [0, [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'rest_api_port': [0, [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'server_url': ['', [Validators.required]],    // TODO Valid URL
            'hash_certificate': [''],
            'connection_identificator': ['']
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['personal_server_name'])).setValue(this.modalModel.personal_server_name);
        (<FormControl>(this.form.controls['mqtt_port'])).setValue(this.modalModel.mqtt_port);
        (<FormControl>(this.form.controls['grid_port'])).setValue(this.modalModel.grid_port);
        (<FormControl>(this.form.controls['web_view_port'])).setValue(this.modalModel.web_view_port);
        (<FormControl>(this.form.controls['hardware_logger_port'])).setValue(this.modalModel.hardware_logger_port);
        (<FormControl>(this.form.controls['rest_api_port'])).setValue(this.modalModel.rest_api_port);
        (<FormControl>(this.form.controls['server_url'])).setValue(this.modalModel.server_url);
        (<FormControl>(this.form.controls['hash_certificate'])).setValue(this.modalModel.hash_certificate);
        (<FormControl>(this.form.controls['connection_identificator'])).setValue(this.modalModel.connection_identificator);
    }

    onSubmitClick(): void {
        this.modalModel.personal_server_name = this.form.controls['personal_server_name'].value;
        this.modalModel.mqtt_port = this.form.controls['mqtt_port'].value;
        this.modalModel.grid_port = this.form.controls['grid_port'].value;
        this.modalModel.web_view_port = this.form.controls['web_view_port'].value;
        this.modalModel.hardware_logger_port = this.form.controls['hardware_logger_port'].value;
        this.modalModel.rest_api_port = this.form.controls['rest_api_port'].value;
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
