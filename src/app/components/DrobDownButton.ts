
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';


@Component({
    selector: 'bk-drob-down-button',
    host: {
        '(document:click)': 'onOutsideClickDropdownMenu($event)',
    },
    /* tslint:disable */
    template: `

        <div *ngIf="btns && getConditionSize() > 1" style="z-index: 5000;  overflow: visible"
             class="btn-group"
             [class.open]="drob_down_clicked"
             [class.color-hardware]="group_color === 'HARDWARE'"
             [class.color-cloud]="group_color === 'CLOUD'"
             [class.color-code]="group_color === 'CODE'"
             [class.color-grid]="group_color === 'GRID'"
             [class.color-blocko]="group_color === 'BLOCKO'"
             [class.color-byzance-blue]="group_color === 'BYZANCE'"
             [class.color-default]="group_color === 'DEFAULT' || group_color === null">
            <a class="btn blue btn-outline btn-circle btn-sm"
               data-toggle="dropdown"
               data-hover="dropdown"
               data-close-others="true"
               aria-expanded="true"
               (click)="onDrobDownClick()"> 
                {{btns_group_name}}
                <i class="fa fa-angle-down"></i>
            </a>
            <ul *ngIf="btns && btns.length > 0" class="dropdown-menu pull-right" style="z-index: 5000; overflow: visible">

                <li *ngFor="let btn of btns; let last = last" [class.devider]="btn.btn_space">

                    <!-- Only if not a external link link !-->
                    <a *ngIf="!btn.btn_space && !btn.btn_link"
                       (click)="onButtonClick(btn.btn_tag)"
                       [class.hidden]="btn.condition == false || btn.permission == false">
                        <i *ngIf="btn.icon" 
                           class="fa {{btn.icon}}"
                           [class.font-red-sunglo]="btn.colorType=='REMOVE'"
                           [class.font-yellow-crusta]="btn.colorType=='EDIT' || btn.colorType=='UPDATE'"
                           [class.font-blue-madison]="btn.colorType=='ACTIVE'"
                           [class.font-purple-plum]="btn.colorType=='DEACTIVE'"
                           [class.font-blue]="btn.colorType=='ADD' || btn.colorType=='CREATE'"
                           [class.font-grey-cascade]="btn.colorType == '' || btn.colorType == null"
                        ></i> {{btn.btn_label_for_person}}
                    </a>


                    <!-- Only if its a external link - Stupid but easy to write !-->
                    <a *ngIf="!btn.btn_space && btn.btn_link"
                        href="{{btn.btn_link}}" target="_blank"
                        [class.hidden]="btn.condition == false || btn.permission == false">
                        <i *ngIf="btn.icon"
                           class="fa {{btn.icon}}"
                           [class.font-red-sunglo]="btn.colorType=='REMOVE'"
                           [class.font-yellow-crusta]="btn.colorType=='EDIT' || btn.colorType=='UPDATE'"
                           [class.font-blue-madison]="btn.colorType=='ACTIVE'"
                           [class.font-purple-plum]="btn.colorType=='DEACTIVE'"
                           [class.font-blue]="btn.colorType=='ADD' || btn.colorType=='CREATE'"
                           [class.font-grey-cascade]="btn.colorType == '' || btn.colorType == null"
                        ></i> {{btn.btn_label_for_person}}
                    </a>

                    <!-- TODO SPACE !-->
                    
                </li>
            </ul>
        </div>

        <div *ngIf="btns && getConditionSize() == 1"  style="z-index: 5000;  overflow: visible">

            <!-- Only if not a external link link !-->
            <button *ngIf="!getSingleConditionButton().btn_space && !getSingleConditionButton().btn_link" class="btn btn-sm"
                    [class.red-sunglo]="getSingleConditionButton().colorType =='REMOVE'"
                    [class.yellow-crusta]="getSingleConditionButton().colorType=='EDIT' || getSingleConditionButton().colorType =='UPDATE'"
                    [class.blue-madison]="getSingleConditionButton().colorType =='ACTIVE'"
                    [class.purple-plum]="getSingleConditionButton().colorType =='DEACTIVE'"
                    [class.blue]="getSingleConditionButton().colorType =='ADD' || getSingleConditionButton().colorType =='CREATE'"
                    [class.grey-cascade]="getSingleConditionButton().colorType == '' || getSingleConditionButton().colorType == null"
                    (click)="onButtonClick(getSingleConditionButton().btn_tag)">
                <i class="fa {{getSingleConditionButton().icon}}"></i> {{getSingleConditionButton().btn_label_for_person}}
            </button>

            <!-- Only if its a external link - Stupid but easy to write !-->
            <a *ngIf="!getSingleConditionButton().btn_space && getSingleConditionButton().btn_link" 
               href="{{getSingleConditionButton().btn_link}}" target="_blank"
               [class.hidden]="getSingleConditionButton().condition == false || getSingleConditionButton().permission == false">
                <button *ngIf="getSingleConditionButton().icon"
                   class="fa {{getSingleConditionButton().icon}}"
                   [class.font-red-sunglo]="getSingleConditionButton().colorType=='REMOVE'"
                   [class.font-yellow-crusta]="getSingleConditionButton().colorType=='EDIT' || getSingleConditionButton().colorType=='UPDATE'"
                   [class.font-blue-madison]="getSingleConditionButton().colorType=='ACTIVE'"
                   [class.font-purple-plum]="getSingleConditionButton().colorType=='DEACTIVE'"
                   [class.font-blue]="getSingleConditionButton().colorType=='ADD' || getSingleConditionButton().colorType=='CREATE'"
                   [class.font-grey-cascade]="getSingleConditionButton().colorType == '' || getSingleConditionButton().colorType == null"
                ></button> {{getSingleConditionButton().btn_label_for_person}}
            </a>
            <!-- Only if its a external link - Stupid but easy to write !-->
        </div>

`
/* tslint:enable */
})
export class BeckiDrobDownButtonComponent implements OnInit, OnChanges {


    private  drob_down_clicked: boolean = false;

    @Input()
    btns_group_name: string = 'UNDEFINED';

    @Input()
    group_color: ('HARDWARE' | 'BLOCKO' | 'GRID' | 'CODE' | 'CLOUD' | 'BYZANCE' | 'DEFAULT') = 'DEFAULT';

    @Input()
    btns: {
        condition: boolean,
        btn_label_for_person: string,
        icon: string,
        btn_space?: boolean,
        permission?: boolean,                                                                    // for example project.delete_permission
        colorType?: ('ADD'| 'EDIT' | 'UPDATE' | 'CREATE' | 'REMOVE' | 'ACTIVE' | 'DEACTIVE'),   // DEFAULT in HTML is EDIT
        btn_tag: string,    // Only if you have more that one Button!
        btn_link?: string,  // External link
        onClick?: () => void
    }[] = null;

    @Output()
    onValueChanged: EventEmitter<string> = new EventEmitter<string>();

    constructor(private _eref: ElementRef) { }

    ngOnInit(): void {
       // nevím
    }

    ngOnChanges(changes: SimpleChanges) {
       // nevím
    }

    getConditionSize(): number {

        // console.info('BeckiDrobDownButtonComponent: Size of buttons', this.btns.length);
        let count = 0;
        for (let i = 0; i < this.btns.length; i++) {
            if (this.btns[i].condition === true && this.btns[i].permission === true ) {
                count++;
            }
        }

        return count;
    }

    getSingleConditionButton(): {
        condition: boolean,
        btn_label_for_person: string,
        icon: string,
        btn_space?: boolean,
        permission?: boolean,                                                                    // for example project.delete_permission
        colorType?: ('ADD'| 'EDIT' | 'UPDATE' | 'CREATE' | 'REMOVE' | 'ACTIVE' | 'DEACTIVE'),   // DEFAULT in HTML is EDIT
        btn_tag: string,    // Only if you have more that one Button!
        btn_link?: string,  // External link
        onClick?: () => void
    } {
        for (let i = 0; i < this.btns.length; i++) {
            if (this.btns[i].condition === true && this.btns[i].permission === true ) {
                return this.btns[i];
            }
        }
    }

    onButtonClick(identificator: string) {
        this.onValueChanged.emit(identificator);
    }

    onDrobDownClick() {
        this.drob_down_clicked = !this.drob_down_clicked;
    }

    onOutsideClickDropdownMenu(event) {
        if (!this._eref.nativeElement.contains(event.target)) { // or some similar check
            this.drob_down_clicked = false;
        }
    }


}

