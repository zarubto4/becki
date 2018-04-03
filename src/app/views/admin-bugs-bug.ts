/**
 * Created by alexandrtyls on 03.10.17.
 */
import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { IServerError } from '../backend/TyrionAPI';

@Component({
    selector: 'bk-view-bugs-bug',
    templateUrl: './admin-bugs-bug.html'
})
export class BugsBugComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    bugId: string;
    bug: IServerError;

    routeParamsSubscription: Subscription;
    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.bugId = params['bug'];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
    }

    onPortletClick(action: string): void {
        if (action === 'report_bug') {
            this.onReportBug();
        }

        if (action === 'remove_bug') {
            this.onDeleteBug();
        }
    }
    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.getBug(this.bugId)
            .then((bug) => {
                this.bug = bug;

                this.unblockUI();
            })
            .catch((reason) => {
                this.fmError( this.translate('flash_cant_load', reason));
                this.unblockUI();
            });
    }

    onReportBug() {
        this.blockUI();
        this.tyrionBackendService.reportBug(this.bugId)
            .then((bug) => {
                this.bug = bug;
                this.unblockUI();
                this.fmSuccess(this.translate('flash_report_success'));
            })
            .catch((reason) => {
                this.unblockUI();
                this.fmError(this.translate('flash_cant_report'), reason);
            });
    }

    onDeleteBug() {
        this.tyrionBackendService.deleteBug(this.bugId)
            .then((response) => {
                this.navigate(['/admin/bugs']);
            })
            .catch((reason) => {
                this.fmError(this.translate('flash_cant_remove', reason));
            });
    }
}




