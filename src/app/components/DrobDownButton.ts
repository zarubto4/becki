
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';


@Component({
    selector: 'bk-drob-down-button',
    host: {
        '(document:click)': 'onOutsideClickDropdownMenu($event)',
    },
    /* tslint:disable */
    template: `

        <div *ngIf="btns && getConditionSize() > 0"
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
            <ul *ngIf="btns && btns.length > 0" class="dropdown-menu pull-right">

                <li *ngFor="let btn of btns; let last = last" [class.devider]="btn.btn_space">
                    <a *ngIf="!btn.btn_space"
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
                </li>
                
            </ul>
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
        let count = 0;
        for (let i = 0; i < this.btns.length; i++) {
            if (this.btns[i].condition === true) {
                count++;
            }
        }
        return count;
    }

    onButtonClick(identificator: string) {
        this.onValueChanged.emit(identificator);
    }

    onDrobDownClick() {
        console.info('Kliknul NA Drobdown');
        this.drob_down_clicked = !this.drob_down_clicked;
    }

    onOutsideClickDropdownMenu(event) {
        if (!this._eref.nativeElement.contains(event.target)) { // or some similar check
            this.drob_down_clicked = false;
        }
    }
}

