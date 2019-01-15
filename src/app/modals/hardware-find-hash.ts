/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IHardwareRegistrationHash } from '../backend/TyrionAPI';
import { FlashMessageError, NotificationService } from '../services/NotificationService';
import { TranslationService } from '../services/TranslationService';
import { IError } from '../services/_backend_class/Responses';


export class ModalsHardwareFindHash extends ModalModel {
    constructor() {
        super();
    }
}

@Component({
    selector: 'bk-modals-hardware-find-hash-component',
    templateUrl: './hardware-find-hash.html'
})
export class ModalsHardwareFindHashComponent implements OnInit {

    @Input()
    modalModel: ModalsHardwareFindHash;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    hash: string = null;
    error_message: string = null;

    constructor(public tyrionBackendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService, protected notificationService: NotificationService, ) {
        this.form = this.formBuilder.group({
            'full_id': ['', [Validators.required, Validators.minLength(24), Validators.maxLength(24)]],
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['full_id'])).setValue('');
    }

    onFindClick(): void {
        this.error_message = null; // Reset Values
        this.hash = null;
        let full_id: string = this.form.controls['full_id'].value;

        this.tyrionBackendService.hardwareGetHashAdminOnly(full_id)
            .then((result: IHardwareRegistrationHash) => {
                this.hash = result.hash;
            })
            .catch((reason: IError) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                this.error_message = reason.message;
            });
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
