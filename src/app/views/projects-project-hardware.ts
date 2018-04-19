/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsAddHardwareModel } from '../modals/add-hardware';
import { ModalsRemovalModel } from '../modals/removal';
import {
    IProject, IHardware, IHardwareList, IActualizationProcedureList, IUpdateProcedure, IHardwareGroupList, IHardwareGroup
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
export class ProjectsProjectHardwareComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    project: IProject = null;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    devicesFilter: IHardwareList = null;
    deviceGroup: IHardwareGroupList = null;
    actualizationFilter: IActualizationProcedureList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

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

        if (tab === 'hardware_list' && this.devicesFilter == null) {
            this.onFilterHardware();
        }

        if (tab === 'hardware_groups' && this.deviceGroup == null) {
            this.onFilterHardwareGroup();
        }

        if (tab === 'updates' && this.actualizationFilter == null) {
            this.onFilterActualizationProcedure();
        }

    }

    onPortletClick(action: string): void {
        if (action === 'add_hardware') {
            this.onHardwareAddClick();
        }

        if (action === 'add_hardware_group') {
            this.onGroupAddClick();
        }

        if (action === 'new_release') {
            this.onProcedureCreateClick();
        }
    }

// Hardware   ----------------------------------------------------------------------------------------------------------

    onHardwareEditClick(device: IHardware): void {
        let model = new ModalsDeviceEditDescriptionModel(device.id, device.name, device.description, device.dominant_entity, (!device.dominant_entity && device.dominant_project_active == null));
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.boardEditPersonalDescription(device.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.unblockUI();
                        this.onFilterHardware();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_edit_device_fail'), reason));
                        this.unblockUI();
                        this.onFilterHardware();
                    });
            }
        }).catch((reason) => {
            this.onFilterHardware();
        });
    }

    onHardwareRemoveClick(hardware: IHardware): void {
        this.modalService.showModal(new ModalsRemovalModel('[' + hardware.id + '] ' + (hardware.name ? hardware.name : ''))).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.projectRemoveHW(hardware.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_remove_device_success')));
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_remove_device_fail', reason)));
                    });
            }
        });
    }

    onHardwareAddClick(): void {
        if (this.deviceGroup == null) {
            this.tyrionBackendService.hardwareGroupGetListByFilter(0, {
                project_id: this.projectId
            })
                .then((values) => {
                    this.unblockUI();
                    this.deviceGroup = values;
                    this.onHardwareAddClick();
                })
                .catch((reason) => {
                    this.unblockUI();
                });
        } else {
            let model = new ModalsAddHardwareModel(this.projectId, this.deviceGroup);
            this.modalService.showModal(model).then((success) => {
                this.onFilterHardwareGroup();
                this.onFilterHardware();
                this.unblockUI();
            }).catch((reason) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_add_device_fail', reason)));
                this.unblockUI();
            });
        }
    }

    onDeviceEditGroupClick(device: IHardware) {
        if (this.deviceGroup == null) {
            this.tyrionBackendService.hardwareGroupGetListByFilter(0, {
                project_id: this.projectId
            })
                .then((values: IHardwareGroupList) => {
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
                    this.tyrionBackendService.boardGroupUpdateDeviceList({
                        device_synchro: {
                            hardware_id: device.id,
                            hardware_group_ids: model.deviceGroupStringIdsSelected
                        },
                        group_synchro: null
                    })
                        .then(() => {
                            this.unblockUI();
                            this.onFilterHardwareGroup();
                            this.onFilterHardware();
                        })
                        .catch(reason => {
                            this.unblockUI();
                            this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_add_fail', reason)));
                            this.onFilterHardwareGroup();
                            this.onFilterHardware();
                        });
                }
            });
        }
    }

// Hardware Group  -----------------------------------------------------------------------------------------------------

    onGroupAddClick(): void {
        let model = new ModalsHardwareGroupPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.hardwareGroupCreate({
                    name: model.name,
                    description: model.description,
                    project_id: this.projectId
                })
                    .then(() => {
                        this.unblockUI();
                        this.onFilterHardwareGroup();
                    })
                    .catch(reason => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_add_fail', reason)));
                    });
            }
        });
    }

    onGroupEditClick(group: IHardwareGroup): void {
        let model = new ModalsHardwareGroupPropertiesModel(group.name, group.description, true, group.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.hardwareGroupEdit(group.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.unblockUI();
                        this.onFilterHardwareGroup();
                    })
                    .catch(reason => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_add_fail', reason)));
                    });
            }
        });
    }

    onGroupDeleteClick(group: IHardwareGroup): void {
        this.modalService.showModal(new ModalsRemovalModel(group.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.hardwareGroupDelete(group.id)
                    .then(() => {
                        this.unblockUI();
                        this.onFilterHardwareGroup();
                        this.onFilterHardware();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_remove_group_fail', reason)));
                        this.unblockUI();
                        this.onFilterHardwareGroup();
                        this.onFilterHardware();
                    });
            }
        });
    }


    // FILTER ----------------------------------------------------------------------------------------------------------

    onFilterHardware(pageNumber: number = 0, boardTypes: string[] = []): void {
        this.blockUI();
        this.tyrionBackendService.boardsGetWithFilterParameters(pageNumber, {
            projects: [this.projectId],
            hardware_type_ids: boardTypes
        })
            .then((values) => {
                this.unblockUI();
                this.devicesFilter = values;

                this.devicesFilter.content.forEach((device, index, obj) => {
                    this.tyrionBackendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'Hardware' && device.id === status.model_id) {
                            device.online_state = status.online_state;
                        }
                    });
                });
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }


    /* tslint:disable:max-line-length ter-indent */
    onFilterActualizationProcedure(pageNumber: number = 0,
        states: ('SUCCESSFULLY_COMPLETE' | 'COMPLETE' | 'COMPLETE_WITH_ERROR' | 'CANCELED' | 'IN_PROGRESS' | 'NOT_START_YET')[] = ['SUCCESSFULLY_COMPLETE', 'COMPLETE' , 'COMPLETE_WITH_ERROR' , 'CANCELED' , 'IN_PROGRESS' , 'NOT_START_YET'],
        type_of_updates: ('MANUALLY_BY_USER_INDIVIDUAL' | 'MANUALLY_BY_USER_BLOCKO_GROUP' | 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' | 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' | 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE')[] = ['MANUALLY_BY_USER_INDIVIDUAL' , 'MANUALLY_BY_USER_BLOCKO_GROUP' , 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' , 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' , 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE']): void {
        this.blockUI();
        this.tyrionBackendService.actualizationProcedureGetByFilter(pageNumber, {
            project_id: this.projectId,
            update_states: states,
            type_of_updates: type_of_updates
        })
            .then((values) => {
                this.actualizationFilter = values;

                this.actualizationFilter.content.forEach((procedure, index, obj) => {
                    this.tyrionBackendService.objectUpdateTyrionEcho.subscribe((status) => {
                        if (status.model === 'ActualizationProcedure' && procedure.id === status.model_id) {

                            this.tyrionBackendService.actualizationProcedureGet(procedure.id)
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


    onFilterHardwareGroup(pageNumber: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.hardwareGroupGetListByFilter(pageNumber, {
          project_id : this.projectId
        })
            .then((values) => {
                this.deviceGroup = values;
                this.unblockUI();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }


    // Actualization Procedure -----------------------------------------------------------------------------------------

    onUpdateProcedureCancelClick(procedure: IUpdateProcedure): void {
        this.tyrionBackendService.actualizationProcedureCancel(procedure.id)
            .then(() => {
                this.unblockUI();
                this.onFilterActualizationProcedure();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onUpdateProcedureUpdateClick(procedure: IUpdateProcedure): void {
        // TODO
    }

    onProcedureCreateClick() {

        // Get all deviceGroup - Recursion
        if (this.deviceGroup == null) {
            this.blockUI();
            this.tyrionBackendService.hardwareGroupGetListByFilter(0, {
                    project_id: this.projectId
                })
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
                this.tyrionBackendService.actualizationProcedureMake({
                    firmware_type: model.firmwareType,
                    hardware_group_id: model.deviceGroupStringIdSelected,
                    project_id: this.projectId,
                    time: model.time,
                    hardware_type_settings: model.groups,
                    timeoffset: model.timeZoneOffset
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

    onDrobDownEmiter(action: string, object: any): void {


        if (action === 'edit_hardware_group') {
            this.onDeviceEditGroupClick(object);
        }

        if (action === 'edit_hardware') {
            this.onHardwareEditClick(object);
        }

        if (action === 'remove_hardware') {
            this.onHardwareRemoveClick(object);
        }

        if (action === 'edit_project') {
            this.onGroupEditClick(object);
        }

        if (action === 'edit_project') {
            this.onGroupDeleteClick(object);
        }

        if (action === 'edit_project') {
            this.onUpdateProcedureUpdateClick(object);
        }

        if (action === 'edit_project') {
            this.onUpdateProcedureCancelClick(object);
        }

    }


}
