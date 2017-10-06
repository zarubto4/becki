/**
 * Created by alexandrtyls on 03.10.17.
 */

import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { ILoggyError } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-bugs-bug',
    templateUrl: './admin-bugs-bug.html'
})
export class BugsBugComponent extends BaseMainComponent implements OnInit, OnDestroy {

    bugId: string;
    bug: ILoggyError;

    routeParamsSubscription: Subscription;
    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

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

    refresh(): void {
        this.blockUI();
        this.backendService.getBug(this.bugId)
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
        // this.backendService.reportBug()
    }

    onDeleteBug() {
        this.backendService.deleteBug(this.bugId)
            .then((response) => {
                this.navigate(['/admin/bug']);
            })
            .catch((reason) => {
                this.fmError(this.translate('flash_cant_remove', reason));
            });
    }
}
