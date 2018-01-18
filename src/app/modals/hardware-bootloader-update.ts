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


export class ModalsHardwareBootloaderUpdateModel extends ModalModel {
    constructor(public hardwareName: string) {
        super();
    }
}

@Component({
    selector: 'bk-modals-hardware-bootloader-update',
    templateUrl: './hardware-bootloader-update.html'
})
export class ModalsHardwareBootloaderUpdateComponent implements OnInit {

    @Input()
    modalModel: ModalsHardwareBootloaderUpdateModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({});

    }

    ngOnInit() {
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
