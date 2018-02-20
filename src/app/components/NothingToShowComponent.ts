import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';


@Component({
    selector: 'bk-nothing-to-show',
    /* tslint:disable */
    template: `
        <h3 *ngIf="condition_loading" class="text-center">{{'loading'|bkTranslate:this}}</h3>
        <div *ngIf="!condition_loading && condition_empty" class="list-no-items">
            <p class="list-no-items__main-label">
                <span [innerHTML]="main_message_link"></span>
            </p>
            <p class="list-no-items__sub-label">
                <span [innerHTML]="main_message_comment_link"></span>
            </p>
            <p>
                <button class="btn blue" (click)="onNothingToShowClick()">
                    <i class="fa fa-plus-circle"></i> {{btn_label}}
                </button>
            </p>
        </div>
    `
    /* tslint:enable */
})
export class NothingToShowComponent {

    @Input()
    condition_loading: boolean = true;

    @Input()
    condition_empty: boolean = false;

    @Input()
    main_message_link: string = 'NOT SET!';

    @Input()
    main_message_comment_link: string = 'NOT SET!';

    @Input()
    btn_label: string = 'NOT SET!';

    @Output('onButtonClick')
    onButtonClick: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    onNothingToShowClick() {
        this.onButtonClick.emit();
    }

}
