import { Component, Input } from '@angular/core';


@Component({
    selector: 'bk-online-state',
    template: `

        <span *ngIf="online_state == 'online'" class="font-green-jungle bold">{{online_state|bkTranslateTable:this:'online_state'}}</span>
        <span *ngIf="online_state == 'offline'" class="font-red-flamingo bold">{{online_state|bkTranslateTable:this:'online_state'}}</span>

        <span *ngIf="online_state == 'synchronization_in_progress'" class="font-grey-mint bold"><i class="fa fa-spinner fa-spin"></i></span>
        <span *ngIf="online_state == 'not_yet_first_connected'" class="font-grey-mint bold">{{online_state|bkTranslateTable:this:'online_state'}}</span>
        <span *ngIf="online_state == 'unknown_lost_connection_with_server'" class="font-grey-mint bold">{{online_state|bkTranslateTable:this:'online_state'}}</span>
      
    `
})

export class OnlineStateComponent {

    @Input()
    online_state: string = 'synchronization_in_progress';

}
