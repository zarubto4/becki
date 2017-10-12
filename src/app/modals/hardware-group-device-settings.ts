/**
 * Created by davidhradek on 20.10.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { IBoardGroup, IBoardShortDetail } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';

export class ModalsHardwareGroupDeviceSettingsModel extends ModalModel {
    constructor(
        public device: IBoardShortDetail,
        public deviceGroup: IBoardGroup[] = [],         // All possible Hardware groups for settings
        public deviceGroupStringIdsAvailable: string[] = [],    // List with group ids for hardware update
        public deviceGroupStringIdsSelected: string[] = []     // List with group ids for hardware update
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-hardware-group-device-settings',
    templateUrl: './hardware-group-device-settings.html'
})
export class ModalsHardwareGroupDeviceSettingsComponent implements OnInit {

    @Input()
    modalModel: ModalsHardwareGroupDeviceSettingsModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    group_options_available: FormSelectComponentOption[] = [];
    group_options_selected: FormSelectComponentOption[] = [];

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {

        this.group_options_selected = this.modalModel.device.hardware_groups.map((pv) => {
            return {
                label: pv.name,
                value: pv.id
            };
        });

        this.group_options_available = this.modalModel.deviceGroup.map((pv) => {
            return {
                label: pv.name,
                value: pv.id
            };
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
