import { Component, Input, Output, EventEmitter, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'bk-portlet-title',
    /* tslint:disable */
    template: `
            <div class="portlet-title">
                <div *ngIf="show_title" class="becki-caption" style="padding-bottom: 0px; padding-top: 10px;">
                    <span class="font-blue-dark uppercase">
                        <i class="fa fa-fw {{icon}}"></i>
                          <span [innerHTML]="title_name"></span>
                          <span *ngIf="title_object_name" class="bold" [innerHTML]="' - ' + title_object_name"></span>
                    </span>
                </div>
                <div *ngIf="btns && btns.length > 0" class="becki-actions">
                    <template ngFor let-element="$implicit" [ngForOf]="btns">
                        
                        <!-- Only if not a external link link !-->
                        <span *ngIf="!btn_link">
                            <button *ngIf="element.condition" class="btn"
                                    [class.red-sunglo]="element.colorType=='REMOVE'"
                                    [class.yellow-crusta]="element.colorType=='EDIT'"
                                    [class.blue-madison]="element.colorType=='ACTIVE'"
                                    [class.purple-plum]="element.colorType=='DEACTIVE'"
                                    [class.blue]="element.colorType=='ADD' || element.colorType=='CREATE'"
                                    [class.grey-cascade]="element.colorType == '' || element.colorType == null"
                                    (click)="onClickButton(element.btn_tag)">
                                <i class="fa {{element.icon}}"></i> {{element.btn_label_for_person}}
                            </button>
                        </span>

                        <!-- Only if its a external link - Stupid but easy to write !-->
                        <a  *ngIf="btn_link" href="btn_link" target="_blank">
                            <button *ngIf="element.condition" class="btn"  
                                    [class.red-sunglo]="element.colorType=='REMOVE'" 
                                    [class.yellow-crusta]="element.colorType=='EDIT'" 
                                    [class.blue-madison]="element.colorType=='ACTIVE'" 
                                    [class.purple-plum]="element.colorType=='DEACTIVE'"
                                    [class.blue]="element.colorType=='ADD' || element.colorType=='CREATE'"
                                    [class.grey-cascade]="element.colorType == '' || element.colorType == null"
                                    (click)="onClickButton(element.btn_tag)">
                                <i class="fa {{element.icon}}"></i> {{element.btn_label_for_person}}
                            </button>
                        </a>
                        
                        
                    </template>
                </div>
                <div *ngIf="tabBtns && tabBtns.length > 0" class="tabbable-line">
                    <ul class="nav nav-tabs becki-tab-menu" style="padding-top: 0px;">
                        <li *ngFor="let btn of tabBtns" [class.active]="tab_selected_name == btn.tab_name"
                            [class.color-hardware]="btn.tab_color === 'HARDWARE'"
                            [class.color-cloud]="btn.tab_color === 'CLOUD'"
                            [class.color-code]="btn.tab_color === 'CODE'"
                            [class.color-grid]="btn.tab_color === 'GRID'"
                            [class.color-blocko]="btn.tab_color === 'BLOCKO'"
                            [class.color-byzance-blue]="btn.tab_color === 'BYZANCE'"
                            [class.color-default]="btn.tab_color === 'DEFAULT' || btn.tab_color === null">
                            <a class="cursor-pointer" (click)="onClickTabButton(btn.tab_name)" data-toggle="tab">
                                <span [innerHTML]="btn.tab_label"></span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
    `,
    encapsulation: ViewEncapsulation.None
    /* tslint:enable */
})
export class PortletTitleComponent {

    @Input()
    icon: string = 'fa-dollar';

    @Input()
    title_name: string = 'NOT SET!';

    @Input()
    show_title: boolean = true;

    @Input()
    title_object_name: string = null;

    @Input()
    title_object_description: string = null;

// BUTTONS ------------------------------------------------------------------------------------------------------------------------------

    @Input()
    btns: {
        condition: boolean,
        btn_label_for_person: string,
        icon: string,
        permission?: boolean,                                                       // for example project.delete_permission
        colorType?: ('ADD'| 'EDIT' | 'CREATE' | 'REMOVE' | 'ACTIVE' | 'DEACTIVE'),  // DEFAULT in HTML is EDIT
        btn_tag: string,    // Only if you have more that one Button!
        btn_link?: string,  // External link
    }[] = null;

    @Output()
    onClick: EventEmitter<string> = new EventEmitter<string>();



// TAB ------------------------------------------------------------------------------------------------------------------------------
    @Input()
    tab_selected_name: string = null;

    @Input()
    tabBtns: {
        condition?: boolean,
        tab_color: ('HARDWARE' | 'BLOCKO' | 'GRID' | 'CODE' | 'CLOUD' | 'BYZANCE' | 'DEFAULT'),
        tab_tag_name: string,
        tab_label_name_for_user: string,
        icon?: string,
        permission?: boolean
    }[] = null;

    @Output()
    onTabClick: EventEmitter<string> = new EventEmitter<string>();


// HELPERS ------------------------------------------------------------------------------------------------------------------------------

    constructor() {
    }

    onClickButton(onClick: string) {
        this.onClick.emit(onClick);
    }

    onClickTabButton(onClick: string) {
        this.onTabClick.emit(onClick);
    }



}
