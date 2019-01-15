/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { TranslationService } from '../services/TranslationService';
import { FlashMessageError, NotificationService } from '../services/NotificationService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IHardware } from '../backend/TyrionAPI';
import { IError } from '../services/_backend_class/Responses';


export class ModalsDeviceEditDescriptionModel extends ModalModel {
    constructor(
        public project_id: string,
        public hardware: IHardware
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-device-edit-description',
    templateUrl: './device-edit-description.html'
})
export class ModalsDeviceEditDescriptionComponent implements OnInit {

    @Input()
    modalModel: ModalsDeviceEditDescriptionModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService, protected notificationService: NotificationService, ) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'name': [this.modalModel.hardware != null ? this.modalModel.hardware.name : '',
                [
                    Validators.required,
                    Validators.minLength(4)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.hardware && this.modalModel.hardware.name.length > 3 && this.modalModel.hardware.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'Hardware', this.modalModel.project_id)
                )
            ],
            'description': [this.modalModel.hardware != null ? this.modalModel.hardware.description : '' , [Validators.maxLength(255)]],
            'tags': [this.modalModel.hardware != null ? this.modalModel.hardware.tags : []]
        });
    }

    onHardwareDeactivate(): void {
        this.backendService.projectDeactiveHW(this.modalModel.hardware.id)
            .then((values) => {
                this.onSubmitClick();
            })
            .catch((reason: IError) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                this.onSubmitClick();
            });
    }

    onHardwareActivate(): void {
        this.backendService.projectActiveHW(this.modalModel.hardware.id)
            .then((values) => {
                this.onSubmitClick();
            })
            .catch((reason: IError) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                this.onSubmitClick();
            });
    }

    onSubmitClick(): void {


        if (this.modalModel.hardware == null) {
            // @ts-ignore
            this.modalModel.hardware = {};
        }

        this.modalModel.hardware.name = this.form.controls['name'].value;
        this.modalModel.hardware.description = this.form.controls['description'].value;
        this.modalModel.hardware.tags = this.form.controls['tags'].value;

        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
