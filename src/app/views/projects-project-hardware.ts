/**
 * Created by davidhradek on 10.08.16.
 */

/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsAddHardwareModel } from '../modals/add-hardware';
import { ModalsRemovalModel } from '../modals/removal';
import {
    IProject, IBoardShortDetail, IBoardList, IBoardGroup, IActualizationProcedureList,
    IActualizationProcedureShortDetail, ICProgramShortDetail
} from '../backend/TyrionAPI';
import { ModalsDeviceEditDescriptionModel } from '../modals/device-edit-description';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsHardwareBootloaderUpdateModel } from '../modals/hardware-bootloader-update';
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
    actualizationList: IActualizationProcedureList = null;

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

        if (tab === 'updates' && this.actualizationList == null) {
            this.onFilterActualizationProcedure();
        }

    }

    onUpdateListBootloaderClick() {
        // mass bootloader magic z toho bootloadersCheckboxChanged
    }

    onUpdateBootloaderClick(selected: IBoardShortDetail) {
        let model = new ModalsHardwareBootloaderUpdateModel(selected.id);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());

                /* this.blockUI();
                  this.backendService.editBoardUserDescription(device.id, {name: model.description})
                  .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The device description was updated.'));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The device cannot be updated.', reason));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    });
            */}
        });

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
        states: ('successful_complete' | 'complete' | 'complete_with_error' | 'canceled' | 'in_progress' | 'not_start_yet')[] = [],
        type_of_updates: ('MANUALLY_BY_USER_INDIVIDUAL' | 'MANUALLY_BY_USER_BLOCKO_GROUP' | 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' | 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' | 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE')[] = []): void {
        this.blockUI();
        this.backendService.actualizationProcedureGetByFilter(pageNumber, {
            project_ids: [this.projectId],
            states: states,
            type_of_updates: type_of_updates
        })
            .then((values) => {
                this.actualizationList = values;

                this.actualizationList.content.forEach((procedure, index, obj) => {
                    this.backendService.objectUpdateTyrionEcho.subscribe((status) => {
                        if (status.model === 'ActualizationProcedure' && procedure.id === status.model_id) {

                            this.backendService.actualizationProcedureGet(procedure.id)
                                .then((value) => {
                                    procedure.state = value.state;
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

    }

    onProcedureClick() {
        // TODO
    }

    onProcedureCreateClick(cPrograms: ICProgramShortDetail[] = null) {

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
        }

        if (cPrograms == null) {
            this.blockUI();
            this.backendService.cProgramGetListByFilter(0, {
                project_id: this.projectId
            })
                .then((list) => {
                    this.unblockUI();
                    this.onProcedureCreateClick(list.content);
                    return;
                }).catch(reason => {
                    this.unblockUI();
                    this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_add_fail', reason)));
                });
        }

        if (cPrograms == null || this.deviceGroup == null) {
            return;
        }

        let model = new ModalsUpdateReleaseFirmwareModel(this.deviceGroup, cPrograms);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.boardGroupCreate({
                    name: '',
                    description: '',
                    project_id: ''
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


}
