
import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';

@Component({
    selector: 'bk-view-support',
    templateUrl: './support.html'
})
export class SupportComponent extends BaseMainComponent implements OnInit {

    tab: string = 'knowledge_base';

    tickets: any=  null;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {

    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onCreateTicketClick() {

    }

    onTicketClick() {

    }

}
