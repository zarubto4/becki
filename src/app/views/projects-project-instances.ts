/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs';
import { IInstance, IInstanceList } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsConfirmModel } from '../modals/confirm';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsInstanceEditDescriptionModel } from '../modals/instance-edit-description';
import { ModalsInstanceCreateComponent, ModalsInstanceCreateModel } from '../modals/instance-create';
import { ModalsRemovalModel } from '../modals/removal';

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
                        if (status.model === 'Instance' && instance.id === status.model_id) {
                            instance.online_state = status.online_state;
                        }
                    });
                });

                this.unblockUI();
            })
            .catch(reason => {
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
        this.modalService.showModal(model).then(() => {
            this.onFilterInstances();
        });
    }

    onInstanceEditClick(instance: IInstance) {
        let model = new ModalsInstanceEditDescriptionModel(instance.id, instance.name, instance.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceEdit(instance.id, { name: model.name, description: model.description })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_instance_edit_success')));
                        this.unblockUI();
                        this.onFilterInstances();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_instance_edit_fail'), reason));
                    });
            }
        });
    }

    onInstanceRemoveClick(instance: IInstance) {
        this.modalService.showModal(new ModalsRemovalModel(instance.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceRemove(instance.id)
                    .then(() => {
                        this.onFilterInstances();
                        this.unblockUI();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_instance_edit_fail'), reason));
                        this.onFilterInstances();
                    });
            }
        });
    }

    onInstanceShutdownClick(instance: IInstance) { // start (True) for Start or (False) for Shutdown
        let model = new ModalsConfirmModel(this.translate('label_shut_down_instance_modal'), this.translate('label_shut_down_instance_modal_comment'));
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceShutdown(instance.id)
                    .then(() => {
                        this.unblockUI();
                        this.onFilterInstances();
                    })
                    .catch(reason => {
                        this.unblockUI();
                        this.fmError(this.translate('label_upload_error', reason));
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
                    .catch(reason => {
                        this.unblockUI();
                        this.fmError(this.translate('label_upload_error', reason));
                    });
            }
        });
    }

    onDrobDownEmiter(action: string, instance: IInstance): void {
        if (action === 'edit_instance') {
            this.onInstanceEditClick(instance);
        }

        if (action === 'start_instance') {
            this.onInstanceStartClick(instance);
        }
        if (action === 'shutdown_instance') {
            this.onInstanceShutdownClick(instance);
        }

        if (action === 'remove_instance') {
            this.onInstanceRemoveClick(instance);
        }
    }



}
