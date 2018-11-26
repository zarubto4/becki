import { Component, Input } from '@angular/core';


@Component({
    selector: 'bk-gsm-status-component',
    template: `
        <span *ngIf="status == 'active'" class="font-green-jungle bold"  [innerHTML]="status|bkTranslateTable:this:'gsm_status'"></span>
        <span *ngIf="status == 'not active'" class="font-red-flamingo bold" [innerHTML]="status|bkTranslateTable:this:'gsm_status'"></span>
    `
})

export class GSMStatusComponent {

    @Input()
    status: string = 'active';

}
