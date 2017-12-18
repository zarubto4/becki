/**
 * Created by Tomas Kupcek on 12.01.2017.
 */

import { Component, Injector, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
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
import { OnlineChangeStatus, BeckiBackend, ITerminalWebsocketMessage } from '../backend/BeckiBackend';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { ModalsDeviceEditDeveloperParameterValueModel } from '../modals/device-edit-developer-parameter-value';
import { ModalsPictureUploadModel } from '../modals/picture-upload';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalPickHardwareTerminalComponent, ModalPickHardwareTerminalModel } from '../modals/pick-hardware-terminal';
import { IBoardForFastUploadDetail } from '../backend/TyrionAPI';
import * as Rx from 'rxjs';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { ModalsLogLevelModel } from '../modals/hardware-terminal-logLevel';

export interface TerminalParameters {
    id: string;
    name: string;
    hardwareURL: string;
    hardwareURLport: number;
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

    WSinit: boolean = false;
    avalibleHardware: TerminalParameters[] = [];
    avalibleColors = ['#0082c8', '#e6194b', '#3cb44b', '#ffe119', '#f58231', '#911eb4', '#46f0f0', '#008080', '#aa6e28', '#ffd8b1'];

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    numbers: any;

    hardwareTerminalWS: Rx.Subject<ITerminalWebsocketMessage>;
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

        this.hardwareTerminalWS = this.backendService.hardwareTerminal;
        this.hardwareTerminalWS.subscribe(msg => this.onMessage(msg));

        this.colorForm.valueChanges.subscribe(value => {
            if (this.consoleLog) {

                Object.keys(value).forEach(
                    colorKey => {
                        this.consoleLog.addSourceColor(colorKey.substr(5), value[colorKey]);
                    });
            }
        });
        /*
                setInterval(int => {
                    this.consoleLog.add("info", "kekekewkf", "0227852", this.device.id);
                    console.log(this.device.id);
                }, 1000);*/
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

    onMessage(msg: ITerminalWebsocketMessage) {
        if (this.consoleLog && this.terminalHardware.findIndex(device => device.id === msg.hardware_id) > -1) {
            this.consoleLog.add(msg.level, msg.message, msg.hardware_id, msg.hardware_id);
        }
    }

    onAddTerminalHardwareClick() {
        if (this.avalibleHardware && this.avalibleHardware.length > 0) {
            this.addNewHardwareToTerminal();

        } else {
            this.addFlashMessage(new FlashMessageError(this.translate('flash_no_more_device')));

        }
    }
    onUserUnsubscribeClick(terminal: TerminalParameters) {
        let con = this.avalibleHardware.concat(this.terminalHardware.splice(this.terminalHardware.findIndex(device => device.id === terminal.id), 1)); // dont need chceck if exist cuz we know its exist
        this.avalibleHardware = con;
        this.backendService.requestDeviceTerminalUnsubcribe(terminal.id, terminal.hardwareURL + ':' + terminal.hardwareURLport);

    }

    onUserChangeLogLevelClick(terminal: TerminalParameters) {
        let logLevel: string;
        let model = new ModalsLogLevelModel;

        this.modalService.showModal(model).then((success) => {
            if (success) {
                logLevel = model.logLevel;

                this.backendService.requestDeviceTerminalUnsubcribe(terminal.id, terminal.hardwareURL + ':' + terminal.hardwareURLport);
                this.backendService.requestDeviceTerminalSubcribe(terminal.id, terminal.hardwareURL + ':' + terminal.hardwareURLport, logLevel);

            }
        });


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


                if (this.terminalHardware.find(hardware => {
                    if (hardware.hardwareURL !== model.selectedBoard.hardwareURL) {
                        return true;
                    }
                })) {
                    // console.log("pouštím druhý WS");
                    this.backendService.connectDeviceTerminalWebSocket(model.selectedBoard.hardwareURL, model.selectedBoard.hardwareURLport + '');
                } else {

                    this.terminalHardware.push({ 'id': model.selectedBoard.id, 'name': model.selectedBoard.name, 'hardwareURL': model.selectedBoard.hardwareURL, hardwareURLport: model.selectedBoard.hardwareURLport });

                    this.backendService.requestDeviceTerminalSubcribe(model.selectedBoard.id, model.selectedBoard.hardwareURL + ':' + model.selectedBoard.hardwareURLport, model.logLevel);
                    this.lastInstance++;
                }

            }
        }).catch(reason => {
            // this.unblockUI();
            this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_hardware'), reason));
        });

    }

    onTogglecommandTab(tab: string) {
        this.commandTab = tab;
    }


    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        //  this.hardwareTerminalWS.unsubscribe();

        this.terminalHardware.forEach(hardware => {
            this.backendService.requestDeviceTerminalUnsubcribe(hardware.id, hardware.hardwareURL + ':' + hardware.hardwareURLport);
        });


        this.backendService.closeHardwareTerminalWebsocket();
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

                if (!this.WSinit) {
                    this.backendService.connectDeviceTerminalWebSocket(this.device.server.server_url, this.device.server.hardware_log_port + ''); // TODO získat z device
                    this.WSinit = true;

                    /*
                    this.backendService.getTerminalWebsocket.addEventListener('close', e => {
                    this.addFlashMessage(new FlashMessageError('Websocket comunication ended, trying to re-connect ', e.reason));
                     });
                    this.backendService.getTerminalWebsocket.addEventListener('error', e => {
                    this.addFlashMessage(new FlashMessageError('something is wrong: ', ));
                   });*/



                    this.colorForm.addControl('color' + this.device.id, new FormControl('color' + this.device.id));
                    this.colorForm.controls['color' + this.device.id].setValue('#0000FF');
                    this.terminalHardware.push({ 'id': this.device.id, 'name': this.device.name, hardwareURL: board.server.server_url, hardwareURLport: board.server.hardware_log_port });

                    new Promise<any>((resolve) => {
                        console.log("init");

                        let checker = setInterval(() => {
                            if (this.consoleLog) {
                                console.log("solved");
                                clearInterval(checker);
                                resolve();
                            }
                        }, 100);


                    }).then(() => {
                        console.log("add");
                        this.colorForm.controls['color' + this.device.id].setValue('#0000FF');
                    })

                    this.backendService.requestDeviceTerminalSubcribe(this.device.id, this.device.server.server_url + ':' + this.device.server.hardware_log_port, 'info');
                }

                return this.backendService.typeOfBoardGet(board.type_of_board_id);

            })
            .then((typeOfBoard) => {
                this.typeOfBoard = typeOfBoard;

                this.backendService.boardsGetForIdeOperation(this.projectId).then(boards => {
                    let hardwares = boards.filter(item => {
                        return !this.terminalHardware.some(board => board.id === item.id);
                    });
                    hardwares.map(hardware => {
                        this.backendService.boardGet(hardware.id).then(board => {
                            this.avalibleHardware.push({ id: hardware.id, name: hardware.name, hardwareURL: board.server.server_url, hardwareURLport: board.server.hardware_log_port });

                        });

                    });

                }).catch(error => {
                    this.addFlashMessage(new FlashMessageError(this.translate('flash_hardware_cant_get_list'), error));
                });
                this.unblockUI();

            })
            .catch((reason) => {
                this.fmError(this.translate('label_cant_load_device', reason));
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
