import { Component, Input } from '@angular/core';


@Component({
    selector: 'bk-update-state',
    template: `

        <span *ngIf="updateState == 'complete'" class="bold font-green-jungle" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>
        <span *ngIf="updateState == 'successful_complete'" class="bold font-green-jungle" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>
        <span *ngIf="updateState == 'canceled'" class="bold font-green-jungle" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>

        <span *ngIf="updateState == 'not_start_yet'" class="bold font-grey-mint" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>
        <span *ngIf="updateState == 'in_progress'" class="bold font-yellow-casablanca" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>
        <span *ngIf="updateState == 'overwritten'" class="bold font-grey-mint" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>
        <span *ngIf="updateState == 'not_updated'" class="bold font-yellow-casablanca" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>
        <span *ngIf="updateState == 'waiting_for_device'" class="bold font-yellow-casablanca" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>

        <span *ngIf="updateState == 'bin_file_not_found'" class="bold font-red-flamingo" [innerHTML]="updateState|bkTranslateTable:'update_state'"></span>
        <span *ngIf="updateState == 'critical_error'" class="bold font-red-flamingo" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>
        <span *ngIf="updateState == 'homer_server_is_offline'" class="bold font-red-flamingo" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>
        <span *ngIf="updateState == 'instance_inaccessible'" class="bold font-red-flamingo" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>
        <span *ngIf="updateState == 'homer_server_never_connected'" class="bold font-red-flamingo" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>
        <span *ngIf="updateState == 'complete_with_error'" class="bold font-yellow-casablanca" [innerHTML]="updateState|bkTranslateTable:this:'update_state'"></span>

     
            
        <span *ngIf="updateState == 'critical_error' && error_code" class="icon-hint-wraper red">
            <i class="fa fa-exclamation-triangle font-red-mint"></i>
            <span class="hint">{{error_code.toString() | bkTranslateTable:this:'error_code'}}</span>
            <br>
        </span>
        
    `
})

export class UpdateStateComponent {

    @Input()
    updateState: string = 'waiting_for_device';

    @Input()
    error_code: number = null;

    @Input()
    error: string = '';
}
