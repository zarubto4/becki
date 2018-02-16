/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { IInstance, IInstanceList} from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsConfirmModel} from '../modals/confirm';
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
        this.tyrionBackendService.instanceGetByFilter(pageNumber, {
            project_id: this.id
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
        let model = new ModalsConfirmModel(this.translate('label_shut_down_instance_modal'), this.translate('label_shut_down_instance_modal_comment');
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

    onInstanceStartClick() {
        let model = new ModalsConfirmModel(this.translate('label_upload_instance_modal'), this.translate('label_upload_instance_modal_comment'));
        this.modalService.showModal(model)
            .then((success) => {
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
