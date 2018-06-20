/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import { ModalsAddHardwareModel } from '../modals/add-hardware';
import { ModalsRemovalModel } from '../modals/removal';
import {
    IProject, IHardware, IHardwareList, IHardwareGroupList, IHardwareGroup
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
    }

    onPortletClick(action: string): void {
        if (action === 'add_hardware') {
            this.onHardwareAddClick();
        }

        if (action === 'add_hardware_group') {
            this.onGroupAddClick();
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

    onHardwareDeactivate(hardware: IHardware): void {
        this.blockUI();
        this.tyrionBackendService.projectDeactiveHW(hardware.id)
            .then((values) => {
                this.unblockUI();
                this.onFilterHardware();
            })
            .catch((reason) => {
                this.unblockUI();
                this.onFilterHardware();
            });
    }

    onHardwareActivate(hardware: IHardware): void {
        this.blockUI();
        this.tyrionBackendService.projectActiveHW(hardware.id)
            .then((values) => {
                this.unblockUI();
                this.onFilterHardware();
            })
            .catch((reason) => {
                this.unblockUI();
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
                        this.unblockUI();
                        this.onFilterHardware();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_remove_device_fail', reason)));
                        this.unblockUI();
                        this.onFilterHardware();
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
        this.tyrionBackendService.boardsGetListByFilter(pageNumber, {
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
                        this.onActualizationProcedureClick();
                    })
                    .catch(reason => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_add_fail', reason)));
                    });
            }
        });

    }


    onBlinkDeviceClick(device: IHardware): void {
        this.tyrionBackendService.boardCommandExecution({
            hardware_id: device.id,
            command: 'BLINK'
        })
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('blink_device_restart_success')));
            })
            .catch((reason) => {
                this.fmError(this.translate('flash_device_restart_success_fail', reason));
                this.unblockUI();
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

        if (action === 'edit_group') {
            this.onGroupEditClick(object);
        }

        if (action === 'remove_group') {
            this.onGroupDeleteClick(object);
        }

        if (action === 'activate_hardware') {
            this.onHardwareActivate(object);
        }

        if (action === 'deactivate_hardware') {
            this.onHardwareDeactivate(object);
        }
        if (action === 'blink_hardware') {
            this.onBlinkDeviceClick(object);
        }
    }


}
