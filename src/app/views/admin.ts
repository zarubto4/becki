/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IReportAdminDashboard } from '../backend/TyrionAPI';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-admin-dashboard',
    templateUrl: './admin.html'
})
export class AdminDashboardComponent extends _BaseMainComponent implements OnInit {

    report: IReportAdminDashboard = null;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }


    formatNumber(i: number, y: number) {
        if ( i === 0) {
            return 0;
        }
        return Math.round((i / y));
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.reportAdminDashboardGet()
            .then(report => {
                this.report = report;
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError(this.translate('flash_cant_load', reason));
                this.unblockUI();
            });
    }

}




