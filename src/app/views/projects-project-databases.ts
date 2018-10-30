import { OnDestroy } from '@angular/core';
/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { IDatabase } from '../backend/TyrionAPI';



@Component({
    selector: `bk-view-projects-project-servers`,
    templateUrl: './projects-project-databases.html'
})
export class ProjectsProjectDatabasesComponent extends _BaseMainComponent implements OnInit, OnDestroy {
    projectId: string;
    productId: string;
    databases: IDatabase[];

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.projectGet(this.projectId).then((project) => {
            this.tyrionBackendService.databasesGet(project.product.id).then((databases) => {
                this.databases = databases;
                this.unblockUI();
            }).catch((reason) => {
                this.unblockUI();
                this.fmError('db_loar_error', reason);
            });
        }).catch((reason) => {
            this.unblockUI();
            this.fmError('db_loar_error', reason);
        });
    }

}
