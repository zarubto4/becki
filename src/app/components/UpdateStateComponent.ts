import { Component, Input } from '@angular/core';


@Component({
    selector: 'bk-update-state',
    template: `
    <td>
        <span *ngIf="updateState == 'complete'" class="bold font-green-jungle">{{updateState|bkTranslateTable:this:'update_state'}}</span>
        <span *ngIf="updateState == 'canceled'" class="bold font-green-jungle">{{updateState|bkTranslateTable:this:'update_state'}}</span>

        <span *ngIf="updateState == 'not_start_yet'" class="bold font-grey-mint">{{updateState|bkTranslateTable:this:'update_state'}} </span>
        <span *ngIf="updateState == 'in_progress'" class="bold font-yellow-casablanca">{{updateState|bkTranslateTable:this:'update_state'}}</span>
        <span *ngIf="updateState == 'overwritten'" class="bold font-grey-mint">{{updateState|bkTranslateTable:this:'update_state'}}</span>
        <span *ngIf="updateState == 'not_updated'" class="bold font-yellow-casablanca">{{updateState|bkTranslateTable:this:'update_state'}}</span>
        <span *ngIf="updateState == 'waiting_for_device'" class="bold font-yellow-casablanca">{{updateState|bkTranslateTable:this:'update_state'}}</span>

        <span *ngIf="updateState == 'bin_file_not_found'" class="bold font-red-flamingo">{{updateState|bkTranslateTable:'update_state'}}</span>
        <span *ngIf="updateState == 'critical_error'" class="bold font-red-flamingo">{{updateState|bkTranslateTable:this:'update_state'}}</span>
        <span *ngIf="updateState == 'homer_server_is_offline'" class="bold font-red-flamingo">{{updateState|bkTranslateTable:this:'update_state'}}</span>
        <span *ngIf="updateState == 'instance_inaccessible'" class="bold font-red-flamingo">{{updateState|bkTranslateTable:this:'update_state'}}</span>
        <span *ngIf="updateState == 'homer_server_never_connected'" class="bold font-red-flamingo">{{updateState|bkTranslateTable:this:'update_state'}}</span>
    </td>
    `
})

export class UpdateStateComponent {

    @Input()
    updateState: string = 'waiting_for_device';

}
