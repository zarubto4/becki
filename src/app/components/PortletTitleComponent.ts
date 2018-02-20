import { Component, Input, Output, EventEmitter, OnInit, Injector } from '@angular/core';
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
                    <button *ngIf="element.condition" class="btn blue"  
                            [class.red-sunglo]="element.colorType=='REMOVE'" 
                            [class.yellow-crusta]="element.colorType=='EDIT'" 
                            [class.blue-madison]="element.colorType=='ACTIVE'" 
                            [class.purple-plum]="element.colorType=='DEACTIVE'"
                            [class.blue]="element.colorType=='ADD'" 
                            [class.blue]="element.colorType=='CREATE'"
                            (click)="onClickButton(element.label)">
                        <i class="fa {{element.icon}}"></i> {{element.label}}
                    </button>
                </template>
            </div>
        </div>
    `
    /* tslint:enable */
})
export class PortletTitleComponent {

    @Input()
    icon: string = 'fa-dollar';

    @Input()
    title_name: string = 'NOT SET!';

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
        label: string,
        icon: string,
        permission?: boolean,                                                       // for example project.delete_permission
        colorType?: ('ADD'| 'EDIT' | 'CREATE' | 'REMOVE' | 'ACTIVE' | 'DEACTIVE'),  // DEFAULT in HTML is EDIT
        btn_identification?: string // Only if you have more that one Button!
    }[] = null;

    @Output()
    onClick: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    onClickButton(onClick: string) {
        this.onClick.emit(onClick);
    }


}
