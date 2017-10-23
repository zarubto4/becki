/**
 * Created by alexandrtyls on 03.10.17.
 */

import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IServerError } from '../backend/TyrionAPI';

@Component({
    selector: 'bk-view-bugs',
    templateUrl: './admin-bugs.html'
})
export class BugsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    bugs: IServerError[];

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    ngOnDestroy(): void {
    }

    refresh(): void {
        this.blockUI();
        this.backendService.getBugsAll()
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
    }

    onBugClick(bug: IServerError) {
        this.navigate(['/admin/bugs', bug.id]);
    }
}




