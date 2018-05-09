import { Component, Input } from '@angular/core';


@Component({
    selector: 'bk-firmware-type',
    template: `
        <span *ngIf="firmware_type == 'FIRMWARE'" class="bold font-color-grid"
              [innerHTML]="firmware_type|bkTranslateTable:this:'firmware_type'"></span>
        <span *ngIf="firmware_type == 'BACKUP'" class="bold font-color-grid-dark"
              [innerHTML]="firmware_type|bkTranslateTable:this:'firmware_type'"></span>
        <span *ngIf="firmware_type == 'BOOTLOADER'" class="bold font-blue"
              [innerHTML]="firmware_type|bkTranslateTable:this:'firmware_type'"></span>
        <span *ngIf="firmware_type == 'WI-FI'" class="bold font-blue"
              [innerHTML]="firmware_type|bkTranslateTable:this:'firmware_type'"></span>
    `
})

export class FirmwareTypeComponent {

    @Input()
    firmware_type: string = 'FIRMWARE';

}
