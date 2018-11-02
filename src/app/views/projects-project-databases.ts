import { OnDestroy } from '@angular/core';
/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { IDatabase } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalModel } from '../services/ModalService';

export class ModalsDatabaseModel extends ModalModel {
    constructor(public name: string = '', public description: string = '', public firstCollection: string = '') {
        super();
    }
}

@Component({
    selector: `bk-view-projects-project-databases`,
    templateUrl: './projects-project-databases.html'
})
export class ProjectsProjectDatabasesComponent extends _BaseMainComponent implements OnInit, OnDestroy {
    projectId: string;
    productId: string;
    databases: IDatabase[];

    currentParamsService: CurrentParamsService;
    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;


    constructor(injector: Injector) {
        super(injector);
    };

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

    onCreateDatabaseClick(): void {
        let model = new ModalsDatabaseModel();
        this.modalService.showModal(model).then((success) => {
            if(success) {
                this.blockUI();
                this.tyrionBackendService.databaseCreate({
                    name: model.name,
                    description: model.description,
                }).then (() => {
                    this.unblockUI();
                    this.refresh();
                }).catch((reason) => {
                    this.unblockUI();
                    this.fmError('', reason);
                    this.refresh();
                });
            }
        });
    }
}
