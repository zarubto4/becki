/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { ITypeOfBoard } from '../backend/TyrionAPI';

@Component({
    selector: 'bk-view-hardware',
    templateUrl: './hardware.html'
})
export class HardwareComponent extends BaseMainComponent implements OnInit {

    devices: ITypeOfBoard[] = null;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.blockUI();
        this.backendService.typeOfBoardsGetAll()
            .then((typeOfBoards) => {
                this.devices = typeOfBoards;
                // console.log(typeOfBoards);
                this.unblockUI();
            })
            .catch((reason) => {
                this.fmError( this.translate('flash_project_cant_load', reason));
                this.unblockUI();
            });
    }

    onDeviceClick(device: ITypeOfBoard) {
        this.navigate(['/hardware', device.id]);
    }

}




