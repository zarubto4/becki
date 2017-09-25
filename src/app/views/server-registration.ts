
import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { BeckiImageLinks } from '../helpers/BeckiImageLinks';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';

@Component({
    selector: 'bk-view-support',
    templateUrl: './server-registration.html'
})
export class ServerRegistrationComponent extends BaseMainComponent implements OnInit {

    tab: string = 'knowledge_base';

    tickets: any = null;

    flag: string;

    constructor(injector: Injector, private beckiImageLinks: BeckiImageLinks) {
        super(injector);
    };

    ngOnInit(): void {
        this.flag = this.beckiImageLinks.getFlagImage('china.svg'); 
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onCreateServerClick() {

    }

    onServerClick() {

    }

}
