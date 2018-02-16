/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IHardwareType } from '../backend/TyrionAPI';

@Component({
    selector: 'bk-view-hardware',
    templateUrl: './hardware.html'
})
export class HardwareComponent extends BaseMainComponent implements OnInit {

    devices: IHardwareType[] = null;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.hardwareTypesGetAll()
            .then((hardwareTypes) => {
                this.devices = hardwareTypes;
                // console.log(hardwareTypes);
                this.unblockUI();
            })
            .catch((reason) => {
                this.fmError( this.translate('flash_project_cant_load', reason));
                this.unblockUI();
            });
    }

    onDeviceClick(device: IHardwareType) {
        this.navigate(['/hardware', device.id]);
    }

}




