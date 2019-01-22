import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
    selector: 'bk-tabdrop',
    template: `
       <li [class.open]="tabDropClicked" [class.hide]="!visible">
            <a class="dropdown-toggle" data-toggle="dropdown" (click)="onTabDropMenuClick()"><i class="fa fa-ellipsis-v"></i><b class="caret"></b></a>
            <ul class="dropdown-menu">
                <li *ngFor="let tab of tabBtns" >
                    <a data-toggle="tab" (click)="clickedTabItem(tab.tab_name)">{{tab.tab_label | stripHtmlPipe}}</a>
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

    @Input()
    visible: boolean;

    @Output()
    tabItemDropdownMenuClick = new EventEmitter<string>();

    private  tabDropClicked: boolean = false;


    clickedTabItem(tabName: string) {
        this.tabItemDropdownMenuClick.emit(tabName);
    }

    onTabDropMenuClick() {
        this.tabDropClicked = !this.tabDropClicked;
    }
}

