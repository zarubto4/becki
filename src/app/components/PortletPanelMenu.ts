import { Component, Input, Output, EventEmitter, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'bk-tab-menu',
    /* tslint:disable */
    template: `
        <div class="portlet-title tabbable-line">
            <ul class="nav nav-tabs becki-tab-menu pull-left margin-left-15 " [class.]>
                <li *ngFor="let btn of btns" [class.active]="tab_selected_name == btn.tab_name" 
                    [class.color-hardware]="color == 'HARDWARE'"
                    [class.color-cloud]="color == 'CLOUD'"
                    [class.color-code]="color == 'CODE'"
                    [class.color-grid]="color == 'GRID'"
                    [class.color-blocko]="color == 'BLOCKO'"
                    [class.color-byzance-blue]="color == 'BYZANCE'"
                    [class.color-default]="color == 'DEFAULT'"
                >
                    <a class="cursor-pointer" (click)="onClickButton(btn.tab_name)">
                        <span [innerHTML]="btn.tab_label"></span>
                    </a>
                </li>
            </ul>
        </div>

    `
    /* tslint:enable */
})
export class PortletPanelMenuComponent {

    @Input()
    tab_selected_name: string = null;

    @Input()
    color: ('HARDWARE' | 'BLOCKO' | 'GRID' | 'CODE' | 'CLOUD' | 'BYZANCE' | 'DEFAULT') = 'DEFAULT';
    @Input()
    btns: {
        condition?: boolean,
        tab_name: string,
        tab_label: string,
        icon?: string,
        permission?: boolean
    }[] = null;

    @Output()
    onClick: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    onClickButton(onClick: string) {
        this.onClick.emit(onClick);
    }


}
