/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IApplicableProduct, IProject } from '../backend/TyrionAPI';

/* tslint:disable */
@Component({
    selector: 'bk-view-dashboard',
    templateUrl: './dashboard.html'
})
/* tslint:enable */
export class DashboardComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    tab: string = 'general';
    projects: IProject[] = null;




    constructor(injector: Injector) {
        super(injector);
    };

    onQrClick() {
        this.router.navigate(['/qr-reader-hardware']);
    }


    onNaCoCliknil(value: string) {
        console.log("Uživatel kliknul na", value);
    }


    ngOnInit(): void {
        this.refresh();

        this.tyrionBackendService.objectUpdateTyrionEcho.subscribe(status => {
            if (status.model === 'ProjectsRefreshAfterInvite') {
                this.refresh();
            }
        });



    }

    ngOnDestroy(): void {
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }


    refresh(): void {
        this.tyrionBackendService.projectGetByLoggedPerson()
            .then((projects: IProject[]) => {
                this.projects = projects;
            });
    }

}






