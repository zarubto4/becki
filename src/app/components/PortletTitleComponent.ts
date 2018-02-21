import { Component, Input, Output, EventEmitter, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'bk-portlet-title',
    /* tslint:disable */
    template: `
            <div class="portlet-title">
                <div class="becki-caption">
                    <span class="font-blue-dark uppercase">
                        <i class="fa fa-fw {{icon}}"></i>
                          <span [innerHTML]="title_name"></span>
                    </span>
                </div>
                <div *ngIf="btns && btns.length > 0" class="becki-actions">
                    <template ngFor let-element="$implicit" [ngForOf]="btns">
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
                    </template>
                </div>
                <div *ngIf="tabBtns && btns.length > 0" class="tabbable-line">
                    <ul class="nav nav-tabs">
                        <li *ngFor="let btn of tabBtns" [class.active]="tab_selected_name == btn.tab_name"
                            [class.color-hardware]="tabBtnsColor == 'HARDWARE'"
                            [class.color-cloud]="tabBtnsColor == 'CLOUD'"
                            [class.color-code]="tabBtnsColor == 'CODE'"
                            [class.color-grid]="tabBtnsColor == 'GRID'"
                            [class.color-blocko]="tabBtnsColor == 'BLOCKO'"
                            [class.color-byzance-blue]="tabBtnsColor == 'BYZANCE'"
                            [class.color-default]="tabBtnsColor == 'DEFAULT' || tabBtnsColor == null">
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
    title_object_name: string = null;

    @Input()
    title_object_description: string = null;

// BUTTONS ------------------------------------------------------------------------------------------------------------------------------

    /**
     *
     * If You are Using only one Button you can set onClick whatever you want
     *
     * ForExample here::
            <bk-portlet-title
                 [title_name]="'title'|bkTranslate:this"
                 [icon]="'fa-briefcase'"
                 (onClick)="onAddClick()"onAddProductClick
                 [btns]="[
                        {
                         condition: (products != null && products.length > 0),
                         label: ('btn_add_project'|bkTranslate:this),
                         icon: 'fa-plus-circle',
                        }
                    ]"
                 >
            </bk-portlet-title>
     * But For more Buttons
     * @type {any}
     */
    @Input()
    btns: {
        condition: boolean,
        btn_label_for_person: string,
        icon: string,
        permission?: boolean,                                                       // for example project.delete_permission
        colorType?: ('ADD'| 'EDIT' | 'CREATE' | 'REMOVE' | 'ACTIVE' | 'DEACTIVE'),  // DEFAULT in HTML is EDIT
        btn_tag: string // Only if you have more that one Button!
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
        console.log("Cliknuto na " + onClick);
        this.onClick.emit(onClick);
    }

    onClickTabButton(onClick: string) {
        this.onTabClick.emit(onClick);
    }



}
