
import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';

@Component({
    selector: 'bk-view-support',
    templateUrl: './server-registration.html'
})
export class ServerRegistrationComponent extends BaseMainComponent implements OnInit {

    tab: string = 'knowledge_base';

    tickets: any = null;
    private LOGO = require('../../style/assets/flags/china.svg');


    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {

    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onCreateServerClick() {

    }

    onServerClick() {

    }

}
