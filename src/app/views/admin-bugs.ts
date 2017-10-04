/**
 * Created by alexandrtyls on 03.10.17.
 */

import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { ILoggyError } from '../backend/TyrionAPI';
import { ModalsRemovalModel } from '../modals/removal';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsGarfieldModel } from '../modals/garfield';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import {  Response } from '@angular/http';

@Component({
    selector: 'bk-view-bugs',
    templateUrl: './admin-bugs.html'
})
export class BugsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    bugs: ILoggyError[];

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

    onBugClick(bug: ILoggyError) {
        this.navigate(['/admin/bugs', bug.id]);
    }
}




