/**
 * Created by dominik on 20.04.17.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { IHardware, IHardwareNewPassword } from '../backend/TyrionAPI';
import { NotificationService } from '../services/NotificationService';
import { IError } from '../services/_backend_class/Responses';

export class ModalsHardwareRestartMQTTPassModel extends ModalModel {
    constructor(public board: IHardware) {
        super();
    }
}

@Component({
    selector: 'bk-modals-hardware-restart-mqtt-pass',
    templateUrl: './hardware-restart-mqtt-pass.html'
})
export class ModalsHardwareRestartMQTTPassComponent implements OnInit {

    @Input()
    modalModel: ModalsHardwareRestartMQTTPassModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    step: ('start' | 'show_pass') = 'start';
    error_message: string = null;

    pass: IHardwareNewPassword = null;

    constructor(public backendService: TyrionBackendService, private formBuilder: FormBuilder, protected notificationService: NotificationService) {
        this.form = this.formBuilder.group({});
    }

    ngOnInit() {
    }

    onGenerateClick(): void {
        this.error_message = null; // Reset Values
        this.pass = null; // Reset Values
        this.backendService.boardGeneratemqttpassword(this.modalModel.board.id)
            .then((pass: IHardwareNewPassword) => {
                this.pass = pass;
            })
            .catch((reason: IError) => {
                this.notificationService.fmError(reason);
                this.error_message = reason.message;
            });
    }

    onSubmitClick(): void {
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
