import { Component, Input } from '@angular/core';

@Component({
    selector: 'bk-online-state',
    /* tslint:disable */
    template: `
    <span *ngIf="online_state == 'ONLINE'" class="font-green-jungle bold" [innerHTML]="online_state|bkTranslateTable:this:'online_state'"></span>
    <span *ngIf="online_state == 'OFFLINE'" class="font-red-flamingo bold" [innerHTML]="online_state|bkTranslateTable:this:'online_state'"></span>
    <span *ngIf="online_state == 'FREEZED'" class="font-red-flamingo bold" [innerHTML]="online_state|bkTranslateTable:this:'online_state'"></span>

    <span *ngIf="online_state == 'SYNCHRONIZATION_IN_PROGRESS'" class="font-grey-mint bold"><i class="fa fa-spinner fa-spin"></i></span>
    <span *ngIf="online_state == 'NOT_YET_FIRST_CONNECTED'" class="font-grey-mint bold" [innerHTML]="online_state|bkTranslateTable:this:'online_state'"></span>
    <span *ngIf="online_state == 'UNKNOWN_LOST_CONNECTION_WITH_SERVER'" class="font-grey-mint bold" [innerHTML]="online_state|bkTranslateTable:this:'online_state'"></span>
    <span *ngIf="online_state == 'SHUT_DOWN'" class="font-grey-mint bold" [innerHTML]="online_state|bkTranslateTable:this:'online_state'"></span>
    `
    /* tslint:enable */
})
export class OnlineStateComponent {
    @Input()
    online_state: string = 'SYNCHRONIZATION_IN_PROGRESS';

}


@Component({
    selector: 'bk-log-level',
    /* tslint:disable */
    template: `        

        <span *ngIf="log_level == 'error'">
            <i class="fa fa-times-circle font-red"></i> Error
        </span>
        <span *ngIf="log_level == 'output'">
            <i class="fa fa-sign-out font-green-jungle"></i> OutPut
        </span>
        <span *ngIf="log_level == 'info'">
            <i class="fa fa-info-circle font-blue"></i> Info
        </span>
        <span *ngIf="log_level == 'warn'">
            <i class="fa fa-exclamation-triangle font-yellow-saffron"></i> Warn
        </span>
        <span *ngIf="log_level == 'log'">
            <i class="fa fa-angle-double-right"></i> Log
        </span>
        
    `
    /* tslint:enable */
})
export class LogLevelComponent {
    @Input()
    log_level: string = 'info';

}
