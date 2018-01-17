/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsAddHardwareModel } from '../modals/add-hardware';
import { ModalsRemovalModel } from '../modals/removal';
import {
    IProject, IBoardShortDetail, IBoardList, IBoardGroup, IActualizationProcedureList,
    IActualizationProcedureShortDetail, ICProgramShortDetail, IBootLoader
} from '../backend/TyrionAPI';
import { ModalsDeviceEditDescriptionModel } from '../modals/device-edit-description';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsHardwareGroupPropertiesModel } from '../modals/hardware-group-properties';
import { ModalsHardwareGroupDeviceSettingsModel } from '../modals/hardware-group-device-settings';
import { ModalsUpdateReleaseFirmwareModel } from '../modals/update-release-firmware';

@Component({
    selector: 'bk-view-projects-project-hardware',
    templateUrl: './projects-project-hardware.html',
})
export class ProjectsProjectHardwareComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    project: IProject = null;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;


    devicesFilter: IBoardList = null;
    deviceGroup: IBoardGroup[] = null;
    actualizationFilter: IActualizationProcedureList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    tab: string = 'hardware_list';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                this.project = project;

                this.onFilterHardware();

                /**
                if (this.devices.find((device, index, obj) => { return !!(device.alert_list && device.alert_list.length); })) {
                    this.bootloaderRequred = true;
                } else {
                    this.bootloaderRequred = false;
                }*/

            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;

        if (tab === 'hardware_groups' && this.deviceGroup == null) {
            this.onHardwareGroupRefresh();
        }

        if (tab === 'updates' && this.actualizationFilter == null) {
            this.onFilterActualizationProcedure();
        }

    }


    onEditClick(device: IBoardShortDetail): void {
        let model = new ModalsDeviceEditDescriptionModel(device.id, device.name, device.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardEditPersonalDescription(device.id, { name: model.name, description: model.description })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_edit_device_fail'), reason));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    });
            }
        });
    }

    onDeviceClick(device: IBoardShortDetail): void {
        this.navigate(['/projects', this.projectId, 'hardware', device.id]);
    }

    onBoardTypeClick(boardTypeId: string): void {
        this.navigate(['/hardware', boardTypeId]);
    }

    onCProgramClick(cProgramId: string): void {
        this.navigate(['/projects', this.projectId, 'code', cProgramId]);
    }

    onRemoveClick(device: IBoardShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel('[' + device.id + '] ' + (device.name ? device.name : ''))).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardDisconnectFromProject(device.id) // TODO [permission]: Project.update_permission (probably implemented as device.delete_permission)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_remove_device_success')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_remove_device_fail', reason)));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    });
            }
        });
    }

    onAddClick(): void {
        if (this.deviceGroup == null) {
            this.backendService.boardGroupGetListFromProject(this.projectId)
                .then((values) => {
                    this.unblockUI();
                    this.deviceGroup = values;
                    this.onAddClick();
                })
                .catch((reason) => {
                    this.unblockUI();
                });
        } else {
            let model = new ModalsAddHardwareModel(this.projectId, this.deviceGroup);
            this.modalService.showModal(model).then((success) => {
                this.onHardwareGroupRefresh();
                this.onFilterHardware();
                this.unblockUI();
            }).catch((reason) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_add_device_fail', reason)));
                this.unblockUI();
            });
        }
    }


    onDeviceEditGroupClick(device: IBoardShortDetail) {
        if (this.deviceGroup == null) {
            this.backendService.boardGroupGetListFromProject(this.projectId)
                .then((values) => {
                    this.unblockUI();
                    this.deviceGroup = values;
                    this.onDeviceEditGroupClick(device);
                })
                .catch((reason) => {
                    this.unblockUI();
                });
        } else {
            let model = new ModalsHardwareGroupDeviceSettingsModel(device, this.deviceGroup);
            this.modalService.showModal(model).then((success) => {
                if (success) {
                    this.backendService.boardGroupUpdateDeviceList({
                        device_synchro: {
                            device_id: device.id,
                            group_ids: model.deviceGroupStringIdsSelected
                        },
                        group_synchro: null
                    })
                        .then(() => {
                            this.unblockUI();
                            this.onHardwareGroupRefresh();
                            this.onFilterHardware();
                        })
                        .catch(reason => {
                            this.unblockUI();
                            this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_add_fail', reason)));
                            this.onHardwareGroupRefresh();
                            this.onFilterHardware();
                        });
                }
            });
        }
    }

    onGroupAddClick(): void {
        let model = new ModalsHardwareGroupPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardGroupCreate({
                    name: model.name,
                    description: model.description,
                    project_id: this.projectId
                })
                    .then(() => {
                        this.unblockUI();
                        this.onHardwareGroupRefresh();
                    })
                    .catch(reason => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_add_fail', reason)));
                    });
            }
        });
    }

    onGroupEditClick(group: IBoardGroup): void {
        let model = new ModalsHardwareGroupPropertiesModel(group.name, group.description, true, group.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardGroupEdit(group.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.unblockUI();
                        this.onHardwareGroupRefresh();
                    })
                    .catch(reason => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_add_fail', reason)));
                    });
            }
        });
    }

    onGroupDeleteClick(group: IBoardGroup): void {
        this.modalService.showModal(new ModalsRemovalModel(group.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardGroupDelete(group.id)
                    .then(() => {
                        this.unblockUI();
                        this.onHardwareGroupRefresh();
                        this.onFilterHardware();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_remove_group_fail', reason)));
                        this.unblockUI();
                        this.onHardwareGroupRefresh();
                        this.onFilterHardware();
                    });
            }
        });
    }

    selectedFilterPageHardware(event: { index: number }) {
        this.onFilterHardware(event.index);
    }

    onFilterHardware(pageNumber: number = 0, boardTypes: string[] = []): void {
        this.blockUI();
        this.backendService.boardsGetWithFilterParameters(pageNumber, {
            projects: [this.projectId],
            type_of_board_ids: boardTypes
        })
            .then((values) => {
                this.devicesFilter = values;

                this.devicesFilter.content.forEach((device, index, obj) => {
                    this.backendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'Board' && device.id === status.model_id) {
                            device.online_state = status.online_status;
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


    selectedFilterPageActualizationProcedure(event: { index: number }) {
        this.onFilterActualizationProcedure(event.index);
    }

    /* tslint:disable:max-line-length ter-indent */
    onFilterActualizationProcedure(pageNumber: number = 0,
        states: ('successful_complete' | 'complete' | 'complete_with_error' | 'canceled' | 'in_progress' | 'not_start_yet')[] = ['successful_complete', 'complete' , 'complete_with_error' , 'canceled' , 'in_progress' , 'not_start_yet'],
        type_of_updates: ('MANUALLY_BY_USER_INDIVIDUAL' | 'MANUALLY_BY_USER_BLOCKO_GROUP' | 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' | 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' | 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE')[] = ['MANUALLY_BY_USER_INDIVIDUAL' , 'MANUALLY_BY_USER_BLOCKO_GROUP' , 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' , 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' , 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE']): void {
        this.blockUI();
        this.backendService.actualizationProcedureGetByFilter(pageNumber, {
            project_ids: [this.projectId],
            update_states: states,
            type_of_updates: type_of_updates
        })
            .then((values) => {
                this.actualizationFilter = values;

                this.actualizationFilter.content.forEach((procedure, index, obj) => {
                    this.backendService.objectUpdateTyrionEcho.subscribe((status) => {
                        if (status.model === 'ActualizationProcedure' && procedure.id === status.model_id) {

                            this.backendService.actualizationProcedureGet(procedure.id)
                                .then((value) => {
                                    procedure.state = value.state;
                                    procedure.procedure_size_complete = value.procedure_size_complete;
                                    procedure.date_of_finish = value.date_of_finish;
                                })
                                .catch((reason) => {
                                    this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
                                });

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
    /* tslint:disable:max-line-length ter-indent*/

    onHardwareGroupRefresh(): void {
        this.blockUI();
        this.backendService.boardGroupGetListFromProject(this.projectId)
            .then((values) => {
                this.deviceGroup = values;
                this.unblockUI();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }


    onUpdateProcedureCancelClick(procedure: IActualizationProcedureShortDetail): void {
        this.backendService.actualizationProcedureCancel(procedure.id)
            .then(() => {
                this.unblockUI();
                this.onFilterActualizationProcedure();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onUpdateProcedureUpdateClick(procedure: IActualizationProcedureShortDetail): void {

    }

    onProcedureCreateClick() {

        // Get all deviceGroup - Recursion
        if (this.deviceGroup == null) {
            this.blockUI();
            this.backendService.boardGroupGetListFromProject(this.projectId)
                .then((values) => {
                    this.unblockUI();
                    this.deviceGroup = values;
                    this.onProcedureCreateClick();
                    return;
                })
                .catch((reason) => {
                    this.unblockUI();
                    this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
                });
            return;
        }

        let model = new ModalsUpdateReleaseFirmwareModel(this.projectId, this.deviceGroup);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.actualizationProcedureMake({
                    firmware_type: model.firmwareType,
                    hardware_group_id: model.deviceGroupStringIdSelected,
                    project_id: this.projectId,
                    time: model.time,
                    type_of_boards_settings: model.groups,
                    timeOffset: model.timeZoneOffset
                })
                    .then(() => {
                        this.unblockUI();
                        this.onFilterActualizationProcedure();
                    })
                    .catch(reason => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_add_fail', reason)));
                    });
            }
        });

    }


}
