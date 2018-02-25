/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { IInstance, IInstanceList } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsConfirmModel } from '../modals/confirm';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsInstanceEditDescriptionModel } from '../modals/instance-edit-description';
import {ModalsInstanceCreateComponent, ModalsInstanceCreateModel} from "../modals/instance-create";

@Component({
    selector: 'bk-view-projects-project-instances',
    templateUrl: './projects-project-instances.html',
})
export class ProjectsProjectInstancesComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    project_id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    instanceFilter: IInstanceList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    onPortletClick(action: string): void {
        if (action === 'add_instance') {
            this.onAddClick();
        }
    }

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.project_id = params['project'];
            this.projectSubscription = this.storageService.project(this.project_id).subscribe((project) => {
                this.onFilterInstances();
            });
        });
    }


    onFilterInstances(pageNumber: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.instanceGetByFilter(pageNumber, {
            project_id: this.project_id
        })
            .then((values) => {
                this.instanceFilter = values;

                this.instanceFilter.content.forEach((instance, index, obj) => {
                    this.tyrionBackendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'HomerInstance' && instance.id === status.model_id) {
                            instance.online_state = status.online_state;
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

    onAddClick() {
        let model = new ModalsInstanceCreateModel(this.project_id);
        this.modalService.showModal(model)

    }

    onInstanceEditClick(instance: IInstance) {
        let model = new ModalsInstanceEditDescriptionModel(instance.id, instance.name, instance.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceEdit(instance.id, { name: model.name, description: model.description })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_instance_edit_success')));
                        this.onFilterInstances();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_instance_edit_fail'), reason));
                    });
            }
        });
    }

    onInstanceShutdownClick(instance: IInstance) { // start (True) for Start or (False) for Shutdown
        let model = new ModalsConfirmModel(this.translate('label_shut_down_instance_modal'), this.translate('label_shut_down_instance_modal_comment'));
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceSnapshotShutdown(instance.current_snapshot_id)
                    .then(() => {
                        this.unblockUI();
                        this.onFilterInstances();
                    })
                    .catch((err) => {
                        this.unblockUI();
                        this.fmError(this.translate('label_upload_error', err));
                    });
            }
        });
    }

    onInstanceStartClick(instance: IInstance) {
        let model = new ModalsConfirmModel(this.translate('label_upload_instance_modal'), this.translate('label_upload_instance_modal_comment'));
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceSnapshotDeploy({
                    snapshot_id: instance.id,
                    upload_time: 0
                })
                    .then(() => {
                        this.unblockUI();
                        this.onFilterInstances();
                    })
                    .catch((err) => {
                        this.unblockUI();
                        this.fmError(this.translate('label_upload_error', err));
                    });
            }
        });
    }



}
