/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { BeckiValidators } from '../helpers/BeckiValidators';


export class ModalsCreateHomerServerModel extends ModalModel {
    constructor(
        public personal_server_name: string = '',
        public mqtt_port: number = 1883,
        public grid_port: number = 8053,
        public web_view_port: number = 8052,
        public server_remote_port: number = 8054,
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

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'personal_server_name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
            'mqtt_port': [0, [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'grid_port': [0, [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'web_view_port': [0, [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'server_remote_port': [0, [Validators.required, Validators.minLength(4), Validators.maxLength(5), BeckiValidators.number]],
            'server_url': ['', [Validators.required]],    // TODO Valid URL
            'hash_certificate': [''],   // TODO Valid URL
            'connection_identificator': ['']    // TODO Valid URL
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['personal_server_name'])).setValue(this.modalModel.personal_server_name);
        (<FormControl>(this.form.controls['mqtt_port'])).setValue(this.modalModel.mqtt_port);
        (<FormControl>(this.form.controls['grid_port'])).setValue(this.modalModel.grid_port);
        (<FormControl>(this.form.controls['web_view_port'])).setValue(this.modalModel.web_view_port);
        (<FormControl>(this.form.controls['server_remote_port'])).setValue(this.modalModel.server_remote_port);
        (<FormControl>(this.form.controls['server_url'])).setValue(this.modalModel.server_url);
        (<FormControl>(this.form.controls['hash_certificate'])).setValue(this.modalModel.hash_certificate);
        (<FormControl>(this.form.controls['connection_identificator'])).setValue(this.modalModel.connection_identificator);
    }

    onSubmitClick(): void {
        this.modalModel.personal_server_name = this.form.controls['personal_server_name'].value;
        this.modalModel.mqtt_port = this.form.controls['mqtt_port'].value;
        this.modalModel.grid_port = this.form.controls['grid_port'].value;
        this.modalModel.web_view_port = this.form.controls['web_view_port'].value;
        this.modalModel.server_remote_port = this.form.controls['server_remote_port'].value;
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
