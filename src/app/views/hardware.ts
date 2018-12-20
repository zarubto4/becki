/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IHardwareType } from '../backend/TyrionAPI';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-hardware',
    templateUrl: './hardware.html'
})
export class HardwareComponent extends _BaseMainComponent implements OnInit {

    hardwareTypes: IHardwareType[] = null;

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
                this.hardwareTypes = hardwareTypes;
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError( this.translate('flash_project_cant_load', reason));
                this.unblockUI();
            });
    }

}




