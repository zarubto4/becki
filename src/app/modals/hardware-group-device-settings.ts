/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Input, Output, EventEmitter, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { IHardwareGroup, IHardware, IHardwareGroupList } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { FormSwitchTwoListSelectComponent } from '../components/FormSwitchTwoListSelectComponent';

export class ModalsHardwareGroupDeviceSettingsModel extends ModalModel {
    constructor(
        public device: IHardware,
        public deviceGroup: IHardwareGroupList = null,         // All possible Hardware groups for settings
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


    group_options_available: FormSelectComponentOption[] = []; // Left
    group_options_selected: FormSelectComponentOption[] = [];  // Right

    @ViewChild('listGroup')
    listGroup: FormSwitchTwoListSelectComponent;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {

        // Here are all in Device list
        this.group_options_selected = this.modalModel.device.hardware_groups.map((pv) => {
            return {
                label: pv.name,
                value: pv.id
            };
        });

        // Here are all except in group_options_selected
        this.modalModel.deviceGroup.content.forEach((group) => {
            if (!this.alreadyContain(group.id)) {
                this.group_options_available.push({
                    label: group.name,
                    value: group.id
                });
            }
        });

    }

    alreadyContain(id: string): boolean {
        for (let i = 0; i < this.modalModel.device.hardware_groups.length; i++) {
            if (id === this.modalModel.device.hardware_groups[i].id) {
                return true;
            }
        }

        return false;
    }

    onSubmitClick(): void {

        this.listGroup.get_right().forEach((value: FormSelectComponentOption) => {
            this.modalModel.deviceGroupStringIdsSelected.push(value.value);
        });

        this.listGroup.get_left().forEach((value: FormSelectComponentOption) => {
            this.modalModel.deviceGroupStringIdsAvailable.push(value.value);
        });

        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
