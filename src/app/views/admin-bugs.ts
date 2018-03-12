/**
 * Created by alexandrtyls on 03.10.17.
 */

import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IServerError } from '../backend/TyrionAPI';

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
            .catch((reason) => {
                this.fmError( this.translate('flash_cant_load', reason));
                this.unblockUI();
            });
    }

    onDeleteAllBugs() {
        this.blockUI();
        this.tyrionBackendService.deleteBugAll()
            .then(() => {
                this.refresh();
            }).catch((reason) => {
                this.fmError( this.translate('flash_cant_remove', reason));
                this.refresh();
            });
    }

    onBugClick(bug: IServerError) {
        this.navigate(['/admin/bugs', bug.id]);
    }
}




