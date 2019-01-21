import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'bk-tabdrop',
    template: `
       <li class="dropdown pull-right tabdrop open">
            <a class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i> <b class="caret"></b></a>
            <ul class="dropdown-menu">
                <li *ngFor="let tab of tabBtns" >
                    <a data-toggle="tab" (click)="clickedTabItem(tab.tab_name)">{{tab.tab_label}}</a>
                </li>
           </ul>
        </li>
    `
})
export class TabDropComponent {

    @Input()
    tabBtns: {
        condition?: boolean,
        tab_color: ('HARDWARE' | 'BLOCKO' | 'GRID' | 'CODE' | 'CLOUD' | 'BYZANCE' | 'DEFAULT'),
        tab_name: string,
        tab_label: string,
        icon?: string,
        permission?: boolean
    }[] = null;

    @Output()
    tabItemDropdownMenuClick = new EventEmitter<string>();

    clickedTabItem(tabName: string) {
        this.tabItemDropdownMenuClick.emit(tabName);
    }
}
