import {
    Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit, ViewChild, ElementRef, DoCheck, NgZone,
    AfterViewInit, HostListener, ViewChildren, QueryList, AfterContentChecked
} from '@angular/core';

@Component({
    selector: 'bk-portlet-title',
    /* tslint:disable */
    template: `
            <div class="portlet-title" [style.border-bottom]="(tabbable_under_line == true ? '1px solid #eef1f5' : '')"  [style.padding-bottom]="(tabbable_under_line == true ? '50px' : '')"  #portletTitle>
                <div *ngIf="show_title" class="becki-caption" style="padding-bottom: 0px; padding-top: 10px;" #beckiCaption>
                    <span class="font-blue-dark uppercase">
                        <i class="fa fa-fw {{icon}}"></i>
                          <span [innerHTML]="title_name"></span>
                          <span *ngIf="title_object_name" class="bold" [innerHTML]="' - ' + title_object_name"></span>
                    </span>
                </div>

                <div *ngIf="btns && getConditionSize() == 1" class="becki-actions" #beckiActions1>
                    <ng-template ngFor let-element="$implicit" [ngForOf]="btns">

                        <!-- Only if not a external link link !-->
                        <span *ngIf="!element.btn_link">
                            <button *ngIf="element.condition" class="btn btn-sm"
                                    [class.disabled]="!element.permission"
                                    [class.red-sunglo]="element.colorType=='REMOVE'"
                                    [class.yellow-crusta]="element.colorType=='EDIT' || element.colorType=='UPDATE'"
                                    [class.blue-madison]="element.colorType=='ACTIVE'"
                                    [class.purple-plum]="element.colorType=='DEACTIVE'"
                                    [class.blue]="element.colorType=='ADD' || element.colorType=='CREATE'"
                                    [class.grey-cascade]="element.colorType == '' || element.colorType == null"
                                    (click)="element.permission ? (element.onClick ? element.onClick() : onClickButton(element.btn_tag)) : null">
                                <i class="fa {{element.icon}}"></i> {{element.btn_label_for_person}}
                            </button>
                        </span>

                        <!-- Only if its a external link - Stupid but easy to write !-->
                        <a  *ngIf="element.btn_link" href="{{element.btn_link}}" target="_blank">
                            <button *ngIf="element.condition" class="btn btn-sm"
                                    [class.disabled]="!element.permission"
                                    [class.red-sunglo]="element.colorType=='REMOVE'"
                                    [class.yellow-crusta]="element.colorType=='EDIT' || element.colorType=='UPDATE'"
                                    [class.blue-madison]="element.colorType=='ACTIVE'"
                                    [class.purple-plum]="element.colorType=='DEACTIVE'"
                                    [class.blue]="element.colorType=='ADD' || element.colorType=='CREATE'"
                                    [class.grey-cascade]="element.colorType == '' || element.colorType == null"
                                    (click)="element.permission ? (onClickButton(element.btn_tag)) : null">
                                <i class="fa {{element.icon}}"></i> {{element.btn_label_for_person}}
                            </button>
                        </a>
                        
                    </ng-template>
                </div>
                
                <div *ngIf="btns && getConditionSize() > 1" class="becki-actions" #beckiActions2>
                    <!-- If we have more than two Buttons -->
                    <bk-drob-down-button *ngIf="btns != null"
                                         [btns_group_name] = "btns_group_name"
                                         [btns]="btns"
                                         (onValueChanged)="onClickButton($event)">
                    </bk-drob-down-button>
                </div>
                
                <div *ngIf="tabBtns && tabBtns.length > 0" class="tabbable-line">   
                    <ul class="nav nav-tabs becki-tab-menu" style="padding-top: 0px;">
                        <ng-template ngFor let-btn="$implicit" [ngForOf]="tabBtns">
                            <li *ngIf="btn.condition" #tabItems
                                [class.active]="tab_selected_name == btn.tab_name"
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
                        </ng-template>
                        <li *ngIf="tabdropItems !== [] && tabdropItems.length > 0" #tabdrop class="dropdown pull-right tabdrop">
                            <bk-tabdrop [tabBtns]="tabdropItems"
                                        [visible]="tabdropShown"
                                        (tabItemDropdownMenuClick)="onClickTabButton($event)"
                            ></bk-tabdrop>
                        </li>
                    </ul>
                </div>
                <div class="clearfix"></div>
            </div>

    `,
    encapsulation: ViewEncapsulation.None
    /* tslint:enable */
})
export class PortletTitleComponent implements AfterContentChecked, AfterViewInit {

    @Input()
    icon: string = 'fa-dollar';

    @Input()
    tabbable_under_line: boolean = false; // Underline under Title name

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
    btns_group_name: string = 'Settings';

    @Input()
    btns: {
        condition: boolean,
        btn_label_for_person: string,
        btn_space?: boolean,
        icon: string,
        permission: boolean,                                                       // for example project.delete_permission
        colorType?: ('ADD'| 'EDIT' | 'UPDATE' | 'CREATE' | 'REMOVE' | 'ACTIVE' | 'DEACTIVE'),  // DEFAULT in HTML is EDIT
        btn_tag: string,    // Only if you have more that one Button!
        btn_link?: string,  // External link
        onClick?: () => void
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
        tab_label: string,
        icon?: string,
        permission?: boolean;
        width?: number
    }[] = null;

    @Output()
    onTabClick: EventEmitter<string> = new EventEmitter<string>();

    @ViewChildren('tabItems') tabItems: QueryList<ElementRef>;

    @ViewChild('portletTitle') portletTitle: ElementRef;

    @ViewChild('beckiCaption') beckiCaption: ElementRef;

    @ViewChild('beckiActions1') beckiActions1: ElementRef;

    @ViewChild('beckiActions2') beckiActions2: ElementRef;

    @ViewChild('tabdrop') tabdrop: ElementRef;

    tabdropShown: boolean;

    tabdropItems: {
        condition?: boolean,
        tab_color: ('HARDWARE' | 'BLOCKO' | 'GRID' | 'CODE' | 'CLOUD' | 'BYZANCE' | 'DEFAULT'),
        tab_tag_name: string,
        tab_label: string,
        icon?: string,
        permission?: boolean;
        width?: number
    }[] = [];

    @HostListener('window:resize') onResize() {
        // Only for portletTitle with navigation.
        if (this.tabBtns !== null && this.tabBtns.length > 0) {
            // Show tab drop.
            this.tabdropShown = this.tabdropItems !== [] && this.tabdropItems.length > 0 && this.tabdropItems.some(element => element.condition !== false);
            // Check if element exists and count space for tabs in portlet title div according to that.
            let otherElements = [];
            let spaceForTabs = this.portletTitle.nativeElement.offsetWidth;
            otherElements.push(this.beckiCaption, this.beckiActions1, this.beckiActions2, this.tabdrop);
            otherElements.forEach(element => {
                if (element) {
                    spaceForTabs -= element.nativeElement.offsetWidth;
                }
            });
            // Add tabs to navigation line on screen widen.
            if (this.tabdropItems !== [] && this.tabdropItems.length > 0) {
                let totalTabsWidth = 0;
                this.tabBtns.forEach(tab => {
                    if (tab.width === undefined) {
                        tab.width = 0;
                    }
                    totalTabsWidth += tab.width;
                });
                if (spaceForTabs >= totalTabsWidth + this.tabdropItems[0].width + 42) {
                    this.tabBtns.push(this.tabdropItems[0]);
                    this.tabdropItems.shift();
                }
            }
        }
    }


// HELPERS ------------------------------------------------------------------------------------------------------------------------------

    constructor() {
    }

    ngAfterContentChecked() {
        this.toTabdrop();
    }

    ngAfterViewInit() {
        // Set width to tabs.
        let i = 0;
        this.tabItems.forEach(item => {
            this.tabBtns[i].width = item.nativeElement.offsetWidth;
            i++;
            console.info(item);
        });
    }

    getConditionSize(): number {
        let count = 0;
        for (let i = 0; i < this.btns.length; i++) {
            if (this.btns[i].condition === true) {
                count++;
            }
        }
        return count;
    }

    onClickButton(onClick: string) {
        this.onClick.emit(onClick);
    }

    onClickTabButton(onClick: string) {
        this.onTabClick.emit(onClick);
    }

    toTabdrop() {
        // Remove element from tabbable-line and add to tabdrop menu, according to the height of container.
        if (this.portletTitle && this.tabBtns && this.portletTitle.nativeElement.offsetHeight > 44 && this.tabBtns.length > 1) {
            let removedElement = this.tabBtns.pop();
            this.tabdropItems.unshift(removedElement);
            this.tabdropShown = this.tabdropItems !== [] && this.tabdropItems.length > 0 && this.tabdropItems.some(element => element.condition !== false);
        }
    }
}

