/**
 * Created by Tomas Kupcek on 12.01.2017.
 */

import { Component, Injector, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import {
    IActualizationProcedureTaskList, IBoard, IBoardShortDetail,
    ITypeOfBoard
} from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsHardwareBootloaderUpdateModel } from '../modals/hardware-bootloader-update';
import { ModalsHardwareCodeProgramVersionSelectModel } from '../modals/hardware-code-program-version-select';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsDeviceEditDescriptionModel } from '../modals/device-edit-description';
import { ModalsRemovalModel } from '../modals/removal';
import { OnlineChangeStatus } from '../backend/BeckiBackend';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { ModalsDeviceEditDeveloperParameterValueModel } from '../modals/device-edit-developer-parameter-value';
import { ModalsPictureUploadModel } from '../modals/picture-upload';
import { ConsoleLogComponent } from '../components/ConsoleLogComponent';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalPickHardwareTerminalComponent, ModalPickHardwareTerminalModel } from '../modals/pick-hardware-terminal';
import { IBoardForFastUploadDetail } from '../backend/TyrionAPI';

export interface TerminalParameters {
    id: string;
    name: string;
}

export interface ConfigParameters {
    key: string;
    value: any;
    type: any;
}

@Component({
    selector: 'bk-view-projects-project-hardware-hardware',
    templateUrl: './projects-project-hardware-hardware.html'
})
export class ProjectsProjectHardwareHardwareComponent extends BaseMainComponent implements OnInit, OnDestroy {

    init: boolean = false;  // Only for title and sutitle menu (for slow internet there was sometimes
    // issue with no project for admin view or for project view but with slow
    // ngOnInit method
    device: IBoard = null;
    typeOfBoard: ITypeOfBoard = null;
    projectId: string;
    hardwareId: string;
    routeParamsSubscription: Subscription;
    actualizationTaskFilter: IActualizationProcedureTaskList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    hardwareTab: string = 'overview';
    commandTab: string = 'terminal';

    configParameters: ConfigParameters[];
    colorForm: FormGroup;

    avalibleHardware: IBoardForFastUploadDetail[];
    avalibleColors = ['#0082c8', '#e6194b', '#3cb44b', '#ffe119', '#f58231', '#911eb4', '#46f0f0', '#008080', '#aa6e28', '#ffd8b1'];

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    numbers: any;

    terminalSubscibe: any; // TODO
    terminalHardware: TerminalParameters[] = [];

    lastInstance: number = 1;

    constructor(injector: Injector) {
        super(injector);

        this.colorForm = this.formBuilder.group({
        });

        this.backendService.onlineStatus.subscribe(status => {
            if (status.model === 'Board' && this.hardwareId === status.model_id) {
                this.device.online_state = status.online_status;
            }
        });

       /* this.terminalSubscibe = this.backendService.hardwareTerminal.subscribe(log => {
            this.logRecived(log);
        });*/

        setInterval(intrvl => {
            if (this.consoleLog) {
                let rnd = Math.floor(Math.random() * 5);
                if (rnd === 0) { this.consoleLog.add('error', 'Status update', 'CSsource'); } else
                    if (rnd === 1) { this.consoleLog.add('info', 'Status update', 'CSsource'); } else
                        if (rnd === 2) { this.consoleLog.add('log', 'Status update', 'CSsource'); } else
                            if (rnd === 3) { this.consoleLog.add('output', 'Status update', 'CSsource'); } else {
                                this.consoleLog.add('warn', 'Status update', 'CSsource');
                            }
            }
        }, 1000);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.hardwareId = params['hardware'];
            this.projectId = params['project'];
            this.init = true;
            this.refresh();
        });

        this.backendService.objectUpdateTyrionEcho.subscribe((status) => {
            if (status.model === 'Board' && this.hardwareId === status.model_id) {
                this.refresh();
                this.onFilterActualizationProcedureTask();
            }
        });
    }

    logRecived(log: any) {
        if (log.id) {

        }
    }

    onAddHardwareClick() {
        console.log(this.avalibleHardware);
        if (this.avalibleHardware && this.avalibleHardware.length > 0) {
            this.addNewHardwareToTerminal();

        } else {
            this.addFlashMessage(new FlashMessageError(this.translate('no more HW to add')));

        }
    }

    addNewHardwareToTerminal() {
        let model = new ModalPickHardwareTerminalModel(this.avalibleHardware, this.avalibleColors[this.lastInstance]);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.colorForm.addControl('color' + model.selectedBoard.id, new FormControl('color' + model.selectedBoard.id));
                this.colorForm.controls['color' + model.selectedBoard.id].setValue(model.color);

                let deleteId = this.avalibleHardware.findIndex(x => x.id === model.selectedBoard.id);
                if (deleteId > -1) {
                    this.avalibleHardware.splice(deleteId, 1);
                }

                this.terminalHardware.push({ 'id': model.selectedBoard.id, 'name': model.selectedBoard.name });

                this.lastInstance++;


            }
        }).catch(reason => {
            // this.unblockUI();
            this.addFlashMessage(new FlashMessageError(this.translate('flash_invoice_cant_be_resend'), reason));
        });

    }

    onTogglecommandTab(tab: string) {
        this.commandTab = tab;
    }


    ngOnDestroy(): void {

        this.routeParamsSubscription.unsubscribe();
    }

    onToggleHardwareTab(tab: string) {

        if (tab === 'updates' && this.actualizationTaskFilter == null) {
            this.onFilterActualizationProcedureTask();
        }

        this.hardwareTab = tab;
    }

    refresh(): void {
        this.blockUI();
        this.backendService.boardGet(this.hardwareId) // TODO [permission]: Project.read_permission
            .then((board) => {
                this.device = board;
                this.config_array();

                this.backendService.onlineStatus.subscribe(status => {
                    if (status.model === 'HomerServer' && this.device.server.id === status.model_id) {
                        this.device.server.online_state = status.online_status;
                    }
                });


                if (!this.terminalHardware.find(boardsInTerminal => boardsInTerminal.id === this.device.id)) {
                    this.colorForm.addControl('color' + this.device.id, new FormControl('color' + this.device.id));
                    this.colorForm.controls['color' + this.device.id].setValue('#0000FF');
                    this.terminalHardware.push({ 'id': this.device.id, 'name': this.device.name });
                    console.log(this.terminalHardware);
                }

                return this.backendService.typeOfBoardGet(board.type_of_board_id);

            })
            .then((typeOfBoard) => {
                this.typeOfBoard = typeOfBoard;

                this.backendService.boardsGetForIdeOperation(this.projectId).then(boards => {
                    this.avalibleHardware = boards.filter(item => {
                        return !this.terminalHardware.some(board => board.id === item.id);
                    });


                }).catch(error => {
                    this.addFlashMessage(new FlashMessageError(this.translate('flash_hardware_cant_get_list'), error));
                });
                this.unblockUI();

            })
            .catch((reason) => {
                this.fmError(this.translate('label_cant_load_device'));
                this.unblockUI();
            });
    }

    config_array(): void {

        let configs: ConfigParameters[] = [];
        for (let key in this.device.bootloader_core_configuration) {
            if (true) {
                configs.push({
                    key: key,
                    value: (<any>this.device.bootloader_core_configuration)[key],
                    type: typeof ((<any>this.device.bootloader_core_configuration)[key])
                });
            }
        }

        this.configParameters = configs;

    }

    onEditClick(device: IBoardShortDetail): void {
        let model = new ModalsDeviceEditDescriptionModel(device.id, device.name, device.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardEditPersonalDescription(device.id, {
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

    onRemoveClick(device: IBoardShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(device.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardDisconnectFromProject(device.id) // TODO [permission]: Project.update_permission (probably implemented as device.delete_permission)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.router.navigate(['/projects/' + this.projectId + '/hardware']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_remove_device_fail'), reason));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    });
            }
        });
    }

    updatePictureClick(): void {
        let model = new ModalsPictureUploadModel(null, this.device.picture_link, false);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardUploadPicture(this.device.id, { // TODO [permission]: edit_permission
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

    onEditParameterValue_Boolean_Click(parameter_type: string, value: boolean): void {
        this.blockUI();
        this.backendService.boardEditDevelopersParameters(this.device.id, {
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

        let model = new ModalsDeviceEditDeveloperParameterValueModel(this.device.id, parameter_user_description, value);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardEditDevelopersParameters(this.device.id, {
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

    onRestartDeviceClick(): void {
        this.backendService.boardCommandExecution({
            board_id: this.device.id,
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

    onSwitchToBootloaderDeviceClick(): void {
        this.backendService.boardCommandExecution({
            board_id: this.device.id,
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

    /**
     * Edit onEditParameterValue_Number_Click
     * @param parameter_user_description
     * @param parameter_type
     * @param value
     */
    onEditParameterValue_String_Click(parameter_user_description: string, parameter_type: string, value: string): void {

        let model = new ModalsDeviceEditDeveloperParameterValueModel(this.device.id, parameter_user_description, value);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardEditDevelopersParameters(this.device.id, {
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

    onUpdateBootloaderClick(): void {
        if (!this.device) {
            return;
        }

        let mConfirm = new ModalsHardwareBootloaderUpdateModel(this.device.name ? this.device.name : this.device.id);
        this.modalService.showModal(mConfirm)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.backendService.hardwareUpdateBootloader({
                        device_ids: [this.device.id]
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

    selectedFilterPageActualizationProcedureTask(event: { index: number }) {
        this.onFilterActualizationProcedureTask(event.index);
    }

    /* tslint:disable:max-line-length ter-indent */
    onFilterActualizationProcedureTask(pageNumber: number = 0,
        states: ('successful_complete' | 'complete' | 'complete_with_error' | 'canceled' | 'in_progress' | 'not_start_yet')[] = ['successful_complete', 'complete', 'complete_with_error', 'canceled', 'in_progress', 'not_start_yet'],
        type_of_updates: ('MANUALLY_BY_USER_INDIVIDUAL' | 'MANUALLY_BY_USER_BLOCKO_GROUP' | 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' | 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' | 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE')[] = ['MANUALLY_BY_USER_INDIVIDUAL', 'MANUALLY_BY_USER_BLOCKO_GROUP', 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME', 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE', 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE']): void {
        this.blockUI();

        this.backendService.actualizationTaskGetByFilter(pageNumber, {
            actualization_procedure_ids: null,
            board_ids: [this.device.id],
            instance_ids: null,
            update_states: states,
            type_of_updates: type_of_updates
        })
            .then((values) => {
                this.actualizationTaskFilter = values;

                this.actualizationTaskFilter.content.forEach((task, index, obj) => {
                    this.backendService.objectUpdateTyrionEcho.subscribe((status) => {
                        if (status.model === 'CProgramUpdatePlan' && task.id === status.model_id) {

                            this.backendService.actualizationTaskGet(task.id)
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
        if (!this.device) {
            return;
        }

        if (backup_mode === 'STATIC_BACKUP') {
            let m = new ModalsHardwareCodeProgramVersionSelectModel(this.projectId, this.device.type_of_board_id);
            this.modalService.showModal(m)
                .then((success) => {
                    if (success) {
                        this.blockUI();
                        this.backendService.boardUpdateBackup({ // TODO [permission]: Board.edit_permission
                            board_backup_pair_list: [
                                {
                                    board_id: this.device.id,
                                    backup_mode: false,
                                    c_program_version_id: m.selectedProgramVersion.version_id
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
            this.backendService.boardUpdateBackup({ // TODO [permission]: Board.edit_permission
                board_backup_pair_list: [
                    {
                        board_id: this.device.id,
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
