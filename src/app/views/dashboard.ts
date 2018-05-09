/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IApplicableProduct, IProject } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs/Rx';

@Component({
    selector: 'bk-view-dashboard',
    templateUrl: './dashboard.html'
})
export class DashboardComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    tab: string = 'general';
    projects: IProject[] = null;

    projectsUpdateSubscription: Subscription;


    realna_hodnota_jana: boolean = true;

    constructor(injector: Injector) {
        super(injector);
    };

    onQrClick() {
        this.router.navigate(['/qr-reader-hardware']);
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
        if (this.projectsUpdateSubscription) {
            this.projectsUpdateSubscription.unsubscribe();
        }
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


    onFilterChange(filter: {key: string, value: any}) {
        console.info('onFilterChange: Key', filter.key, 'value', filter.value);

        if (filter.key == 'realna_hodnota_jana') {
            this.realna_hodnota_jana = filter.value;
        }

    }



}




