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
import {IInstanceList, IInstanceShortDetail} from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsConfirmModel } from '../modals/confirm';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsInstanceEditDescriptionModel } from '../modals/instance-edit-description';

@Component({
    selector: 'bk-view-projects-project-instances',
    templateUrl: './projects-project-instances.html',
})
export class ProjectsProjectInstancesComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    instanceFilter: IInstanceList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.onFilterInstances();
            });
        });
    }

    selectedFilterPage(event: { index: number }) {
        this.onFilterInstances(event.index);
    }

    onFilterInstances(pageNumber: number = 0): void {
        this.blockUI();
        this.backendService.instanceGetByFilter(pageNumber, {
            project_id: this.id
        })
            .then((values) => {
                this.instanceFilter = values;

                this.instanceFilter.content.forEach((instance, index, obj) => {
                    this.backendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'HomerInstance' && instance.id === status.model_id) {
                            instance.online_state = status.online_status;
                        }
                    });
                });

                this.unblockUI();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
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
        let model = new ModalsInstanceEditDescriptionModel(instance.id, instance.name, instance.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.instanceEdit(instance.id, { name: model.name, description: model.description })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_instance_edit_success')));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_instance_edit_fail'), reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onInstanceStartOrShutdownClick(instance: IInstanceShortDetail, start: boolean) { // start (True) for Start or (False) for Shutdown
        let m = null;

        if (start) { // start (True) for Start or (False) for Shutdown
            m = new ModalsConfirmModel(this.translate('label_upload_instance_modal'), this.translate('label_upload_instance_modal_comment'));
        } else {
            m = new ModalsConfirmModel(this.translate('label_shut_down_instance_modal'), this.translate('label_shut_down_instance_modal_comment'));
        }

        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.backendService.instanceSetStartOrShutDown(instance.id)
                        .then(() => {
                            this.storageService.projectRefresh(this.id);
                            this.unblockUI();
                        })
                        .catch((err) => {
                            this.unblockUI();
                            this.fmError(this.translate('label_upload_error', err));
                        });
                }
            });
    }


}
