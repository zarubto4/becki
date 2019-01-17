import { Component, Input } from '@angular/core';

@Component({
    selector: 'bk-tabdrop',
    template: `
       <li *ngIf="!tabs" class="dropdown pull-right tabdrop">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#"><i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i> <b class="caret"></b></a>
            <ul class="dropdown-menu">
                <li *ngFor="let tab of tabs">{{tab}}</li>
           </ul>
        </li>
    `
})
export class TabDropComponent {

    @Input()
    tabs: string[] = null;



}
