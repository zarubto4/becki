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
import { ModalsDeviceEditDescriptionModel } from '../modals/device-edit-description';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import {
    ModalsInstanceEditDescriptionComponent,
    ModalsInstanceEditDescriptionModel
} from '../modals/instance-edit-description';

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

    onInstanceEditClick(instance: IInstanceShortDetail) {
        let model = new ModalsInstanceEditDescriptionModel (instance.id, instance.name, instance.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editInstance(instance.id, {name: model.name, description: model.description})
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The Instance description was updated.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The Instance cannot be updated.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onInstanceStartOrShutdownClick(instance: IInstanceShortDetail, start: boolean) { // start (True) for Start or (False) for Shutdown
        let m = null;

        if (start) {
            m = new ModalsConfirmModel('Shutdown instance', 'Do you want to shutdown running instance?');
        } else {
            m = new ModalsConfirmModel('Upload and run into cloud', 'Do you want to upload Blocko and running instance in Cloud?');
        }

        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.backendService.startOrShutDownInstance(instance.id)
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


}
