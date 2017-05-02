/**
 * Created by davidhradek on 01.12.16.
 */
/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { IHomerInstance, IInstanceShortDetail } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsConfirmModel } from '../modals/confirm';

@Component({
    selector: 'bk-view-projects-project-instances',
    templateUrl: './projects-project-instances.html',
})
export class ProjectsProjectInstancesComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    instances: IInstanceShortDetail[] = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.instances = project.instancies;
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onInstanceClick(instance: IInstanceShortDetail) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'instances', instance.id]);
    }

    onBlockoProgramClick(bProgramId: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocko', bProgramId]);
    }

    onBlockoVersionProgramClick(bProgramId: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocko', bProgramId]);
    }

    onInstanceShutdownClick(instance: IInstanceShortDetail) {
        let m = new ModalsConfirmModel('Shutdown instance', 'Do you want to shutdown running instance?');
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.backendService.cloudInstanceShutDown(instance.id)
                        .then(() => {
                            this.storageService.projectRefresh(this.id);
                            this.unblockUI();
                        })
                        .catch((err) => {
                            this.unblockUI();
                            this.fmError('Cannot turn instance off.', err);
                        });
                }
            });
    }

    onInstanceEditClick(instance: IInstanceShortDetail) {

    }
}
