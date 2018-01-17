/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { Subscription } from 'rxjs';
import { IProducer, IReportAdminDashboard } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';


@Component({
    selector: 'bk-view-admin-dashboard',
    templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent extends BaseMainComponent implements OnInit {

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
        this.backendService.reportAdminDashboardGet()
            .then(report => {
                this.report = report;
                this.unblockUI();
            })
            .catch(reason => {
                this.fmError(this.translate('flash_cant_load', reason));
                this.unblockUI();
            });
    }

}




