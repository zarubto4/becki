/**
 * Created by alexandrtyls on 03.10.17.
 */

import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IServerError } from '../backend/TyrionAPI';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-bugs',
    templateUrl: './admin-bugs.html'
})
export class BugsComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    bugs: IServerError[];

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    ngOnDestroy(): void {
    }

    onPortletClick(action: string): void {
        if (action === 'remove_all') {
            this.onDeleteAllBugs();
        }
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.getBugsAll()
            .then((bugs) => {
                this.bugs = bugs;
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError( this.translate('flash_cant_load', reason));
                this.unblockUI();
            });
    }

    onDeleteAllBugs() {
        this.blockUI();
        this.tyrionBackendService.deleteBugAll()
            .then(() => {
                this.refresh();
            }).catch((reason: IError) => {
                this.fmError( this.translate('flash_cant_remove', reason));
                this.refresh();
            });
    }

    onReportBug(bug: IServerError) {
        this.blockUI();
        this.tyrionBackendService.reportBug(bug.id)
            .then(() => {
                this.unblockUI();
                this.fmSuccess(this.translate('flash_report_success'));
            })
            .catch((reason: IError) => {
                this.unblockUI();
                this.fmError(this.translate('flash_cant_report'), reason);
            });
    }

    onDeleteBug(bug: IServerError) {
        this.blockUI();
        this.tyrionBackendService.deleteBug(bug.id)
            .then((response) => {
                this.fmSuccess(this.translate('flash_report_remove_succesfuly'));
                this.refresh();
            })
            .catch((reason: IError) => {
                this.fmError(this.translate('flash_cant_remove', reason));
            });
    }

    onBugClick(bug: IServerError) {
        this.navigate(['/admin/bugs', bug.id]);
    }

    onDrobDownEmiter (action: string, bug: IServerError): void {
        if (action === 'report_bug') {
            this.onReportBug(bug);
        }

        if (action === 'remove_bug') {
            this.onDeleteBug(bug);
        }
    }
}




