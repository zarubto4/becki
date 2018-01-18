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
import { OnlineChangeStatus, TyrionApiBackend, ITerminalWebsocketMessage, IWebsocketTerminalState } from '../backend/BeckiBackend';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { ModalsDeviceEditDeveloperParameterValueModel } from '../modals/device-edit-developer-parameter-value';
import { ModalsPictureUploadModel } from '../modals/picture-upload';
import { ConsoleLogComponent, ConsoleLogType, ConsoleLogItem } from '../components/ConsoleLogComponent';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalPickHardwareTerminalComponent, ModalPickHardwareTerminalModel } from '../modals/pick-hardware-terminal';
import { IBoardForFastUploadDetail } from '../backend/TyrionAPI';
import { ModalsHardwareRestartMQTTPassModel } from '../modals/hardware-restart-mqtt-pass';
import * as Rx from 'rxjs';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { ModalsLogLevelModel } from '../modals/hardware-terminal-logLevel';
import { ModalsHardwareChangeServerModel } from '../modals/hardware-change-server';

export interface TerminalParameters {
    id: string;
    name: string;
    logLevel: string;
    onlineStatus: string;
    hardwareURL: string;
    hardwareURLport: number;
    connected: boolean;
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
    hardwareTerminalStateWS: Rx.Subject<IWebsocketTerminalState>;
    terminalHardware: TerminalParameters[] = [];

    lastInstance: number = 1;

    constructor(injector: Injector) {
        super(injector);

        this.colorForm = this.formBuilder.group({
        });

        this.tyrionBackendService.onlineStatus.subscribe(status => {
            if (status.model === 'Board') {
                if (this.hardwareId === status.model_id) {
                    this.device.online_state = status.online_status;
                };
            }
            this.terminalHardware.find(hardware => hardware.id === status.model_id).onlineStatus = status.online_status;
        });

    };


    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.hardwareId = params['hardware'];
            this.projectId = params['project'];
            this.init = true;

            this.refresh();
        });




        this.tyrionBackendService.objectUpdateTyrionEcho.subscribe((status) => {
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
        let deviceTerminal = this.terminalHardware.find(device => device.id === msg.hardware_id);
        if (deviceTerminal) {
            if (!deviceTerminal.connected && msg.message_type === 'subscribe_hardware') {
                deviceTerminal.connected = true;
            }
            if (this.consoleLog) {
                let alias = deviceTerminal.name;
                this.consoleLog.add(msg.level, msg.message, (alias ? alias : msg.hardware_id), msg.hardware_id);

            }
        }
    }

    onStateMessage(msg: IWebsocketTerminalState) {
        // console.log(msg);
        if (msg.websocketUrl === null && msg.isConnected === null) {
            this.addFlashMessage(new FlashMessageError('cant connect offline device'));
            return;
        }

        if (this.terminalHardware) {
            this.terminalHardware.find(terminal => {
                if (msg.websocketUrl.includes(terminal.hardwareURL + ':' + terminal.hardwareURLport)) {
                    return true;
                }
            }).connected = msg.isConnected;
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
        this.modalService.showModal(new ModalsRemovalModel((terminal.name ? terminal.name : terminal.id))).then((success) => {
            if (success) {
                let con = this.avalibleHardware.concat(this.terminalHardware.splice(this.terminalHardware.findIndex(device => device.id === terminal.id), 1)); // dont need chceck if exist cuz we know its exist
                this.avalibleHardware = con;
                this.tyrionBackendService.requestDeviceTerminalUnsubcribe(terminal.id, terminal.hardwareURL + ':' + terminal.hardwareURLport);
                // this.tyrionBackendService.closeHardwareTerminalWebsocket(terminal.hardwareURL + ':' + terminal.hardwareURLport); // TODO lepší je ponechat WS otevřený v "resting" stavu a pak je všechny zavřít najedou
            }
        });
    }

    onUserChangeLogLevelClick(terminal: TerminalParameters) {
        let logLevel: string;
        let model = new ModalsLogLevelModel(terminal.logLevel);

        this.modalService.showModal(model).then((success) => {
            if (success) {

                logLevel = model.logLevel;

                this.terminalHardware.find(terminals => terminal.id === terminals.id).logLevel = logLevel;

                this.tyrionBackendService.requestDeviceTerminalUnsubcribe(terminal.id, terminal.hardwareURL + ':' + terminal.hardwareURLport);
                this.tyrionBackendService.requestDeviceTerminalSubcribe(terminal.id, terminal.hardwareURL + ':' + terminal.hardwareURLport, logLevel);

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
                    if (hardware.hardwareURL !== model.selectedBoard.hardwareURL || hardware.hardwareURLport !== model.selectedBoard.hardwareURLport) {
                        return true;
                    }
                })) {
                    this.tyrionBackendService.connectDeviceTerminalWebSocket(model.selectedBoard.hardwareURL, model.selectedBoard.hardwareURLport + '');
                }


                this.terminalHardware.push({
                    'id': model.selectedBoard.id,
                    'logLevel': model.logLevel,
                    'name': model.selectedBoard.name,
                    'onlineStatus': model.selectedBoard.onlineStatus,
                    'hardwareURL': model.selectedBoard.hardwareURL,
                    'hardwareURLport': model.selectedBoard.hardwareURLport,
                    'connected': false
                });

                this.tyrionBackendService.requestDeviceTerminalSubcribe(model.selectedBoard.id, model.selectedBoard.hardwareURL + ':' + model.selectedBoard.hardwareURLport, model.logLevel);
                this.lastInstance++;


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
            this.tyrionBackendService.requestDeviceTerminalUnsubcribe(hardware.id, hardware.hardwareURL + ':' + hardware.hardwareURLport);
        });


        this.tyrionBackendService.closeHardwareTerminalWebsocket('all');
    }

    onToggleHardwareTab(tab: string) {

        if (tab === 'updates' && this.actualizationTaskFilter == null) {
            this.onFilterActualizationProcedureTask();
        }

        if (tab === 'command_center' && !this.WSinit) {
            this.blockUI();
            this.WSinit = true;


            this.hardwareTerminalWS = this.tyrionBackendService.hardwareTerminal;
            this.hardwareTerminalWS.subscribe(msg => this.onMessage(msg));

            this.hardwareTerminalStateWS = this.tyrionBackendService.hardwareTerminalState;
            this.hardwareTerminalStateWS.subscribe(msg => this.onStateMessage(msg));

            this.colorForm.valueChanges.subscribe(value => {
                if (this.consoleLog) {
                    Object.keys(value).forEach(
                        colorKey => {
                            this.consoleLog.addSourceColor(colorKey.substr(5), value[colorKey]);
                        });
                }
            });

            if (this.device.server && this.device.server.server_url) {
                this.terminalFirstRun(this.device);
            } else {
                this.terminalHardware.push({
                    'id': this.device.id,
                    'logLevel': 'info',
                    'name': this.device.name,
                    'onlineStatus': this.device.online_state,
                    'hardwareURL': null,
                    'hardwareURLport': null,
                    'connected': false
                });
            }

            this.tyrionBackendService.boardsGetWithFilterParameters(0, { // TODO https://youtrack.byzance.cz/youtrack/issue/BECKI-368
                projects: [this.projectId],
                type_of_board_ids: []
            }).then(boards => {

                let hardwares = boards.content.filter(item => {
                    return !this.terminalHardware.some(board => board.id === item.id);
                });

                hardwares.map(hardware => {
                    this.tyrionBackendService.boardGet(hardware.id).then(board => {
                        if (board.server && board.server.server_url) {
                            this.avalibleHardware.push({
                                'id': hardware.id,
                                'logLevel': 'info',
                                'name': hardware.name,
                                'onlineStatus': board.online_state,
                                'hardwareURL': board.server.server_url,
                                'hardwareURLport': board.server.server_remote_port,
                                'connected': false
                            });
                        } else {
                            this.avalibleHardware.push({
                                'id': hardware.id,
                                'logLevel': 'info',
                                'name': hardware.name,
                                'onlineStatus': board.online_state,
                                'hardwareURL': null,
                                'hardwareURLport': null,
                                'connected': false
                            });
                        }
                    });
                });
                this.unblockUI();
            }).catch(error => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_hardware_cant_get_list'), error));
                this.unblockUI();
            });

        }

        this.hardwareTab = tab;
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.boardGet(this.hardwareId) // TODO [permission]: Project.read_permission
            .then((board) => {
                this.device = board;
                this.config_array();

                this.tyrionBackendService.onlineStatus.subscribe(status => {
                    if (status.model === 'HomerServer' && this.device.server.id === status.model_id) {
                        this.device.server.online_state = status.online_status;
                    }
                });

                return this.tyrionBackendService.typeOfBoardGet(board.type_of_board_id);

            })
            .then((typeOfBoard) => {
                this.typeOfBoard = typeOfBoard;
                this.unblockUI();

            })
            .catch((reason) => {
                this.fmError(this.translate('label_cant_load_device', reason));
                this.unblockUI();
            });
    }


    terminalFirstRun(board: IBoard): void {
        this.tyrionBackendService.connectDeviceTerminalWebSocket(this.device.server.server_url, this.device.server.hardware_log_port + '');

        // TODO při změně jména/aliasu refreshnout název terminálu

        this.colorForm.addControl('color' + this.device.id, new FormControl('color' + this.device.id));
        this.colorForm.controls['color' + this.device.id].setValue('#0000FF');
        this.terminalHardware.push({
            'id': this.device.id,
            'logLevel': 'info',
            'name': this.device.name,
            'onlineStatus': this.device.online_state,
            'hardwareURL': board.server.server_url,
            'hardwareURLport': board.server.server_remote_port,
            'connected': false
        });

        new Promise<any>((resolve) => {

            let checker = setInterval(() => {
                if (this.consoleLog) {
                    clearInterval(checker);
                    resolve();
                }
            }, 100);


        }).then(() => {
            this.colorForm.controls['color' + this.device.id].setValue('#0000FF');
        });
        if (this.device.server && this.device.server.server_url) {
            this.tyrionBackendService.requestDeviceTerminalSubcribe(this.device.id, this.device.server.server_url + ':' + this.device.server.server_remote_port, 'info');
        }
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

    onRemoveClick(device: IBoardShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(device.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.boardDisconnectFromProject(device.id) // TODO [permission]: Project.update_permission (probably implemented as device.delete_permission)
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
                this.tyrionBackendService.boardUploadPicture(this.device.id, { // TODO [permission]: edit_permission
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
        this.tyrionBackendService.boardEditDevelopersParameters(this.device.id, {
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
                this.tyrionBackendService.boardEditDevelopersParameters(this.device.id, {
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
        this.tyrionBackendService.boardCommandExecution({
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

    onGenerateNewPassword(): void {
        let model = new ModalsHardwareRestartMQTTPassModel(this.device);
        this.modalService.showModal(model).then((success) => {
            if (success) { }
        });
    }

    onChangeServer(): void {
        let model = new ModalsHardwareChangeServerModel(this.device);
        this.modalService.showModal(model).then((success) => {
            if (success) { }
        });
    }

    onSwitchToBootloaderDeviceClick(): void {
        this.tyrionBackendService.boardCommandExecution({
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
                this.tyrionBackendService.boardEditDevelopersParameters(this.device.id, {
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
                    this.tyrionBackendService.hardwareUpdateBootloader({
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
        states: ('complete' | 'canceled' | 'bin_file_not_found' | 'not_start_yet' | 'in_progress' | 'overwritten' | 'not_updated' | 'waiting_for_device' | 'instance_inaccessible' | 'homer_server_is_offline' | 'homer_server_never_connected' | 'critical_error')[] = ['complete', 'canceled', 'bin_file_not_found', 'not_start_yet', 'in_progress', 'not_updated', 'waiting_for_device', 'instance_inaccessible', 'homer_server_is_offline', 'homer_server_never_connected', 'critical_error'],
        type_of_updates: ('MANUALLY_BY_USER_INDIVIDUAL' | 'MANUALLY_BY_USER_BLOCKO_GROUP' | 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' | 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' | 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE')[] = ['MANUALLY_BY_USER_INDIVIDUAL', 'MANUALLY_BY_USER_BLOCKO_GROUP', 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME', 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE', 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE']): void {
        this.blockUI();

        this.tyrionBackendService.actualizationTaskGetByFilter(pageNumber, {
            actualization_procedure_ids: null,
            board_ids: [this.device.id],
            instance_ids: [],
            update_states: states,
            update_status: [],
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
        if (!this.device) {
            return;
        }

        if (backup_mode === 'STATIC_BACKUP') {
            let m = new ModalsHardwareCodeProgramVersionSelectModel(this.projectId, this.device.type_of_board_id);
            this.modalService.showModal(m)
                .then((success) => {
                    if (success) {
                        this.blockUI();
                        this.tyrionBackendService.boardUpdateBackup({ // TODO [permission]: Board.edit_permission
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
            this.tyrionBackendService.boardUpdateBackup({ // TODO [permission]: Board.edit_permission
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
