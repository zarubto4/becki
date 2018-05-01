
import { Component, Injector, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import {
    IActualizationProcedureTaskList, ICProgramList, IHardware,
    IHardwareType
} from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsHardwareBootloaderUpdateModel } from '../modals/hardware-bootloader-update';
import { ModalsHardwareCodeProgramVersionSelectModel } from '../modals/hardware-code-program-version-select';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsDeviceEditDescriptionModel } from '../modals/device-edit-description';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsDeviceEditDeveloperParameterValueModel } from '../modals/device-edit-developer-parameter-value';
import { ModalsPictureUploadModel } from '../modals/picture-upload';
import { ModalsHardwareRestartMQTTPassModel } from '../modals/hardware-restart-mqtt-pass';
import { ModalsHardwareChangeServerModel } from '../modals/hardware-change-server';
import { _BaseMainComponent } from './_BaseMainComponent';
import { ModalsSelectCodeModel } from '../modals/code-select';
import {FormSelectComponentOption} from "../components/FormSelectComponent";

export interface ConfigParameters {
    key: string;
    value: any;
    type: any;
}


@Component({
    selector: 'bk-view-projects-project-hardware-hardware',
    templateUrl: './projects-project-hardware-hardware.html'
})
export class ProjectsProjectHardwareHardwareComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    init: boolean = false;  // Only for title and sutitle menu (for slow internet there was sometimes
    // issue with no project for admin view or for project view but with slow
    // ngOnInit method
    hardware: IHardware = null;
    hardwareType: IHardwareType = null;
    projectId: string;
    hardwareId: string;
    routeParamsSubscription: Subscription;
    actualizationTaskFilter: IActualizationProcedureTaskList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent
    tab: string = 'overview';

    // Config Parameters
    configParameters: ConfigParameters[] = null;

    constructor(injector: Injector) {
        super(injector);
    };


    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.hardwareId = params['hardware'];
            this.projectId = params['project'];
            this.init = true;

            this.refresh();
        });

        this.tyrionBackendService.objectUpdateTyrionEcho.subscribe((status) => {
            if (status.model === 'Hardware' && this.hardwareId === status.model_id) {
                this.refresh();
                this.onFilterActualizationProcedureTask();
            }
        });
    }

    onBlinkDeviceClick(): void {
        this.tyrionBackendService.boardCommandExecution({
            hardware_id: this.hardwareId,
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

    onPortletClick(action: string): void {
        if (action === 'update_hardware') {
            this.onEditClick(this.hardware);
        }

        if (action === 'deactivate_hardware') {
            this.onFreezeDeviceClick(this.hardware);
        }

        if (action === 'active_hardware') {
            this.onActiveDeviceClick(this.hardware);
        }

        if (action === 'hardware_restart') {
            this.onRestartDeviceClick();
        }

        if (action === 'hardware_restart_bootloader') {
            this.onSwitchToBootloaderDeviceClick();
        }

        if (action === 'hardware_restart_pass') {
            this.onGenerateNewPassword();
        }

        if (action === 'hardware_change_server') {
            this.onChangeServer();
        }

        if (action === 'hardware_manual_update') {
            this.onManualIndividualUpdate();
        }

        if (action === 'blink_hardware') {
            this.onBlinkDeviceClick();
        }
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    onToggleTab(tab: string) {

        this.tab = tab;

        if (tab === 'updates' && this.actualizationTaskFilter == null) {
            this.onFilterActualizationProcedureTask();
        }

        if (tab === 'command_center') {
            // Nothing
        }
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.boardGet(this.hardwareId) // TODO [permission]: Project.read_permission
            .then((hardware) => {
                this.hardware = hardware;
                this.config_array();

                this.tyrionBackendService.onlineStatus.subscribe((status) => {
                    if (status.model === 'HomerServer' && this.hardware.server.id === status.model_id) {
                        this.hardware.server.online_state = status.online_state;
                    }

                    if (status.model === 'Hardware' && this.hardware.id === status.model_id) {
                        this.hardware.online_state = status.online_state;
                    }

                });

                return this.tyrionBackendService.hardwareTypeGet(this.hardware.hardware_type.id);

            })
            .then((hardwareType) => {
                this.hardwareType = hardwareType;
                this.unblockUI();

            })
            .catch((reason) => {
                this.fmError(this.translate('label_cant_load_device', reason));
                this.unblockUI();
            });
    }

    config_array(): void {

        let configs: ConfigParameters[] = [];
        for (let key in this.hardware.bootloader_core_configuration) {
            if (true) {
                configs.push({
                    key: key,
                    value: (<any>this.hardware.bootloader_core_configuration)[key],
                    type: typeof ((<any>this.hardware.bootloader_core_configuration)[key])
                });
            }
        }

        this.configParameters = configs;

    }

    onEditClick(device: IHardware): void {
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
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_edit_device_fail'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onRemoveClick(device: IHardware): void {
        this.modalService.showModal(new ModalsRemovalModel(device.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.projectRemoveHW(device.id) // TODO [permission]: Project.update_permission (probably implemented as device.delete_permission)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.router.navigate(['/projects/' + this.projectId + '/hardware']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_remove_device_fail'), reason));
                    });
            }
        });
    }

    onFreezeDeviceClick(device: IHardware): void {
        this.modalService.showModal(new ModalsRemovalModel(device.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.projectDeactiveHW(device.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.router.navigate(['/projects/' + this.projectId + '/hardware']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_remove_device_fail'), reason));
                    });
            }
        });
    }

    onActiveDeviceClick(device: IHardware): void {
        this.modalService.showModal(new ModalsRemovalModel(device.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.projectActiveHW(device.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.router.navigate(['/projects/' + this.projectId + '/hardware']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_remove_device_fail'), reason));
                        this.refresh();
                    });
            }
        });
    }

    updatePictureClick(): void {
        let model = new ModalsPictureUploadModel(null, this.hardware.picture_link, false);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.hardwareUploadPicture(this.hardware.id, {
                    file: model.file
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_picture_updated')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_picture_update'), reason));
                        this.refresh();
                    });
            }
        });
    }

    /**
     * Edit onEditParameterValue_Boolean_Click
     * @param parameter_type
     * @param value type and Boolean
     */
    onEditParameterValue_Boolean_Click(parameter_type: string, value: boolean): void {
        this.blockUI();
        this.tyrionBackendService.boardEditDevelopersParameters(this.hardware.id, {
            parameter_type: parameter_type,
            boolean_value: value
        })
            .then(() => {
                this.refresh();
            })
            .catch((reason) => {
                this.fmError(this.translate('flash_cannot_change_developer_parameter', reason));
                this.unblockUI();
            });
    }

    /**
     * Edit onEditParameterValue_Number_Click
     * @param parameter_user_description
     * @param parameter_type
     * @param value
     */
    onEditParameterValue_Number_Click(parameter_user_description: string, parameter_type: string, value: number): void {

        let model = new ModalsDeviceEditDeveloperParameterValueModel(this.hardware.id, parameter_user_description, value);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.boardEditDevelopersParameters(this.hardware.id, {
                    parameter_type: parameter_type,
                    integer_value: model.value
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.refresh();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_cannot_change_developer_parameter', reason));
                        this.unblockUI();
                    });
            }
        });
    }

    /**
     * Edit onEditParameterValue_Number_Click
     * @param parameter_user_description
     * @param parameter_type
     * @param value
     */
    onEditParameterValue_String_Click(parameter_user_description: string, parameter_type: string, value: string): void {

        let model = new ModalsDeviceEditDeveloperParameterValueModel(this.hardware.id, parameter_user_description, value);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.boardEditDevelopersParameters(this.hardware.id, {
                    parameter_type: parameter_type,
                    string_value: model.value
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.refresh();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_cannot_change_developer_parameter', reason));
                        this.unblockUI();
                    });
            }
        });
    }

    onEditParameterValue_SelectString_Click(parameter_user_description: string, parameter_type: string, value: string): void {

        let form: FormSelectComponentOption[] = [
            {
                value: 'ethernet',
                label: 'ethernet'
            },
            {
                value: '6lowPan',
                label: '6lowPan'
            },
            {
                value: 'gsm',
                label: 'gsm'
            },
            {
                value: 'wifi',
                label: 'wifi'
            }
        ];

        let model = new ModalsDeviceEditDeveloperParameterValueModel(this.hardware.id, parameter_user_description, null, form);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.boardEditDevelopersParameters(this.hardware.id, {
                    parameter_type: parameter_type,
                    string_value: model.value
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.refresh();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_cannot_change_developer_parameter', reason));
                        this.unblockUI();
                    });
            }
        });
    }


    onRestartDeviceClick(): void {
        this.tyrionBackendService.boardCommandExecution({
            hardware_id: this.hardware.id,
            command: 'RESTART'
        })
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_device_restart_success')));
                this.refresh();
            })
            .catch((reason) => {
                this.fmError(this.translate('flash_device_restart_success_fail', reason));
                this.unblockUI();
            });
    }

    onGenerateNewPassword(): void {
        let model = new ModalsHardwareRestartMQTTPassModel(this.hardware);
        this.modalService.showModal(model).then((success) => {
            if (success) { }
        });
    }

    onChangeServer(): void {
        let model = new ModalsHardwareChangeServerModel(this.hardware);
        this.modalService.showModal(model).then((success) => {
            if (success) { }
        });
    }

    onSwitchToBootloaderDeviceClick(): void {
        this.tyrionBackendService.boardCommandExecution({
            hardware_id: this.hardware.id,
            command: 'SWITCH_TO_BOOTLOADER'
        })
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_device_restart_success')));
                this.refresh();
            })
            .catch((reason) => {
                this.fmError(this.translate('flash_device_restart_success_fail', reason));
                this.unblockUI();
            });
    }

    onUpdateBootloaderClick(): void {
        if (!this.hardware) {
            return;
        }

        let mConfirm = new ModalsHardwareBootloaderUpdateModel(this.hardware.name ? this.hardware.name : this.hardware.id);
        this.modalService.showModal(mConfirm)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.tyrionBackendService.hardwareUpdateBootloader({
                        device_ids: [this.hardware.id],
                        bootloader_id: this.hardware.available_latest_bootloader.id
                    })
                        .then(() => {
                            this.refresh();
                        })
                        .catch((reason) => {
                            this.fmError(this.translate('flash_cant_update_bootloader', reason));
                            this.unblockUI();
                        });
                }
            });
    }

    onManualIndividualUpdate(): void {
        this.blockUI();
        this.tyrionBackendService.cProgramGetListByFilter(0, {
            project_id: this.projectId,
            hardware_type_ids: [this.hardwareType.id]
        }).then( (list: ICProgramList) => {
            this.unblockUI();
            let mConfirm = new ModalsSelectCodeModel(list.content);
            this.modalService.showModal(mConfirm)
                .then((success) => {
                    if (success) {
                        this.blockUI();
                        this.tyrionBackendService.cProgramUploadIntoHardware({
                            hardware_ids: [this.hardware.id],
                            c_program_version_id: mConfirm.selectedVersionId
                        })
                            .then(() => {
                                this.refresh();
                            })
                            .catch((reason) => {
                                this.fmError(this.translate('flash_cant_update_bootloader', reason));
                                this.unblockUI();
                            });
                    }
                });

        });


    }

    /* tslint:disable:max-line-length ter-indent */
    onFilterActualizationProcedureTask(pageNumber: number = 0,
        states: ('COMPLETE' | 'CANCELED'|'BIN_FILE_MISSING' | 'NOT_YET_STARTED' | 'IN_PROGRESS' | 'OBSOLETE' | 'NOT_UPDATED' | 'WAITING_FOR_DEVICE' | 'INSTANCE_INACCESSIBLE' | 'HOMER_SERVER_IS_OFFLINE' | 'HOMER_SERVER_NEVER_CONNECTED' | 'CRITICAL_ERROR')[] = ['COMPLETE', 'CANCELED', 'BIN_FILE_MISSING', 'NOT_YET_STARTED', 'IN_PROGRESS', 'OBSOLETE', 'NOT_UPDATED', 'WAITING_FOR_DEVICE', 'INSTANCE_INACCESSIBLE', 'HOMER_SERVER_IS_OFFLINE', 'HOMER_SERVER_NEVER_CONNECTED', 'CRITICAL_ERROR'],
        type_of_updates: ('MANUALLY_BY_USER_INDIVIDUAL' | 'MANUALLY_BY_USER_BLOCKO_GROUP' | 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' | 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' | 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE')[] = ['MANUALLY_BY_USER_INDIVIDUAL', 'MANUALLY_BY_USER_BLOCKO_GROUP', 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME', 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE', 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE']): void {
        this.blockUI();

        this.tyrionBackendService.actualizationTaskGetByFilter(pageNumber, {
            hardware_ids: [this.hardware.id],
            update_states: states,
            type_of_updates: type_of_updates
        })
            .then((values) => {
                this.actualizationTaskFilter = values;

                this.actualizationTaskFilter.content.forEach((task, index, obj) => {
                    this.tyrionBackendService.objectUpdateTyrionEcho.subscribe((status) => {
                        if (status.model === 'CProgramUpdatePlan' && task.id === status.model_id) {

                            this.tyrionBackendService.actualizationTaskGet(task.id)
                                .then((value) => {
                                    task.state = value.state;
                                    task.date_of_finish = value.date_of_finish;
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

    onAutobackupSwitchClick(backup_mode: string): void {

        if (!this.hardware) {
            return;
        }

        if (backup_mode === 'STATIC_BACKUP') {
            let m = new ModalsHardwareCodeProgramVersionSelectModel(this.projectId, this.hardware.hardware_type.id);
            this.modalService.showModal(m)
                .then((success) => {
                    if (success) {
                        this.blockUI();
                        this.tyrionBackendService.boardUpdateBackup({
                            hardware_backup_pairs: [
                                {
                                    hardware_id: this.hardware.id,
                                    backup_mode: false,
                                    c_program_version_id: m.selectedProgramVersion.id
                                }
                            ]
                        })
                            .then(() => {
                                this.refresh();
                            })
                            .catch((reason) => {
                                this.fmError(this.translate('flash_cant_edit_backup_mode', reason));
                                this.unblockUI();
                            });
                    }
                });
        } else {
            this.blockUI();
            this.tyrionBackendService.boardUpdateBackup({
                hardware_backup_pairs: [
                    {
                        hardware_id: this.hardware.id,
                        backup_mode: true
                    }
                ]
            })
                .then(() => {
                    this.refresh();
                })
                .catch((reason) => {
                    this.fmError(this.translate('flash_cant_edit_backup_mode', reason));
                    this.unblockUI();
                });
        }
    }
}
