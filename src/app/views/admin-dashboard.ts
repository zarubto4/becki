/**
 * Created by davidhradek on 03.08.16.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';

@Component({
    selector: 'bk-view-admin-dashboard',
    templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent extends BaseMainComponent implements OnInit {

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
    }


}




