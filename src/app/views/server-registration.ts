
import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { BeckiImageLinks } from '../helpers/BeckiImageLinks';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';

@Component({
    selector: 'bk-view-support',
    templateUrl: './server-registration.html'
})
export class ServerRegistrationComponent extends _BaseMainComponent implements OnInit {

    tab: string = 'knowledge_base';

    tickets: any = null;

    flag: string;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.flag = this.getBeckiFlag('usa.svg');

    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onCreateServerClick() {

    }

    onServerClick() {

    }

}
