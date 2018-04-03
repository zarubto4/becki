/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';

@Component({
    selector: 'bk-view-dashboard',
    templateUrl: './dashboard.html'
})
export class DashboardComponent extends _BaseMainComponent implements OnInit {

    tab: string = 'general';

    constructor(injector: Injector) {
        super(injector);
    };

    onQrClick() {
        this.router.navigate(['/qr-reader-hardware']);
    }

    ngOnInit(): void {
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }


}




