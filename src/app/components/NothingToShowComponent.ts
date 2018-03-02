import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
    selector: 'bk-nothing-to-show',
    /* tslint:disable */
    template: `
        <div [class.row]="image_link != null" [class.vertical-align]="image_link!= null">
            <div *ngIf="!condition_loading && condition_empty && image_link" [class.col-md-5]="image_link != null" [class.vcenter]="image_link!= null">
                <img class="text-center" style="width: auto; height: 90%;" src="{{image_link}}">
            </div>
            <div [class.col-md-7]="image_link != null" [class.vcenter]="image_link != null">
                <h3 *ngIf="condition_loading" class="text-center">{{'loading' | bkTranslate:this}}</h3>
                <div *ngIf="!condition_loading && condition_empty" class="list-no-items">
                    <p class="list-no-items__main-label">
                        <span [innerHTML]="main_message_link"></span>
                    </p>
                    <p class="list-no-items__sub-label">
                        <span [innerHTML]="main_message_comment_link"></span>
                    </p>
                    <p>
                        <button *ngIf="show_button" class="btn blue" (click)="onNothingToShowClick()">
                            <i class="fa {{icon}}"></i> {{btn_label}}
                        </button>
                    </p>
                </div>
           
                    <div *ngIf="image_description && condition_empty && !condition_loading" class="portlet light bordered" style="margin-left: 10%; margin-right: 10%;">
                        <div class="portlet-title">
                            <div class="caption font-grey-salsap">
                                <i class="icon-speech font-grey-salsa"></i>
                                <span class="caption-subject font-grey-salsa" style="font-size: 20px;">Info</span>
                            </div>
                        </div>
                        <div class="portlet-body">
                            <p style="font-size: 18px; margin-left: 2%; margin-right: 2%; padding-top: 25px">
                                <span [innerHTML]="image_description"></span>
                            </p>
                        </div>
                    </div>
            
            </div>
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

    // Optional!
    @Input()
    image_link: string = null;
    // Optional!
    @Input()
    image_description: string = null;

    @Input()
    btn_label: string = 'NOT SET!';

    @Input()
    icon: string = 'fa-plus-circle';

    @Input()
    show_button: boolean = true;

    @Output('onButtonClick')
    onButtonClick: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    onNothingToShowClick() {
        this.onButtonClick.emit();
    }

}
