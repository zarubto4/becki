/**
 * Created by davidhradek on 05.12.16.
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
        this.backendService.getAllTypeOfBoards()
            .then((typeOfBoards) => {
                this.devices = typeOfBoards;
                // console.log(typeOfBoards);
                this.unblockUI();
            })
            .catch((reason) => {
                this.fmError('Projects cannot be loaded.', reason);
                this.unblockUI();
            });
    }

    onDeviceClick(device: ITypeOfBoard) {
        this.navigate(['/hardware', device.id]);
    }

}




