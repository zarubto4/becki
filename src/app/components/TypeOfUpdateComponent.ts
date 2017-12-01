import { Component, Input } from '@angular/core';


@Component({
    selector: 'bk-type-of-update',
    template: `

        <span *ngIf="state == 'MANUALLY_BY_USER_INDIVIDUAL'" class="bold font-green-jungle"  [innerHTML]="state|bkTranslateTable:this:'type_of_update'"></span>
        <span *ngIf="state == 'MANUALLY_RELEASE_MANAGER'" class="bold font-green-jungle"  [innerHTML]="state|bkTranslateTable:this:'type_of_update'"></span>
        <span *ngIf="state == 'MANUALLY_BY_USER_BLOCKO_GROUP'" class="bold font-green-jungle"  [innerHTML]="state|bkTranslateTable:this:'type_of_update'"></span>
        <span *ngIf="state == 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME'" class="bold font-green-jungle"  [innerHTML]="state|bkTranslateTable:this:'type_of_update'"></span>
        <span *ngIf="state == 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE'" class="bold font-green-jungle"  [innerHTML]="state|bkTranslateTable:this:'type_of_update'"></span>
        <span *ngIf="state == 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE'" class="bold font-yellow-casablanca"  [innerHTML]="state|bkTranslateTable:this:'type_of_update'"></span>

    `
})

export class TypeOfUpdateComponent {

    @Input()
    state: string = '';

}
