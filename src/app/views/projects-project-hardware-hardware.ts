/**
 * Created by Tomas Kupcek on 12.01.2017.
 */

import { Component, Injector, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import {
    IActualizationProcedureTaskList, IHardware,
    IHardwareType
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
import { ModalsHardwareRestartMQTTPassModel } from '../modals/hardware-restart-mqtt-pass';
import * as Rx from 'rxjs';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { ModalsLogLevelModel } from '../modals/hardware-terminal-logLevel';
import { ModalsHardwareChangeServerModel } from '../modals/hardware-change-server';
import { Observable, Subject } from 'rxjs/Rx';

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

    hardwareTab: string = 'overview';
    commandTab: string = 'terminal';

    configParameters: ConfigParameters[];
    colorForm: FormGroup;

    WSinit: boolean = false;
    avalibleHardware: TerminalParameters[] = []; // ukládání všech dostupných HW pro terminalSubsribe
    avalibleColors = ['#0082c8', '#e6194b', '#3cb44b', '#ffe119', '#f58231', '#911eb4', '#46f0f0', '#008080', '#aa6e28', '#ffd8b1']; // předdefinované barvy pro terminál

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    numbers: any;

    hardwareTerminalWS: Rx.Subscription; // objekt pro subscribe websocketu (a práci s pouze s touto instancí, takže ve chvíli co použiju  unsubscribe, tak se zruší toto a né Rx.subject v beckibackend)
    hardwareTerminalStateWS: Rx.Subscription; // stejně jako nahoře, more info:   http://reactivex.io/rxjs/manual/overview.html#subscription

    terminalHardware: TerminalParameters[] = []; // Hardware, ze kterého čteme logy je uložen zde

    lastInstance: number = 1; // kvůli barvám sledujeme poslední přidanou instanci

    constructor(injector: Injector) {
        super(injector);

        this.colorForm = this.formBuilder.group({
        }); // inicializace prázdného formu pro barvy

        this.tyrionBackendService.onlineStatus.subscribe(status => {
            if (status.model === 'Board') {
                if (this.hardwareId === status.model_id) {
                    this.hardware.online_state = status.online_state;
                };
            }
            this.terminalHardware.find(hardware => hardware.id === status.model_id).onlineStatus = status.online_state; // pokud najdeme terminalHW, změníme mu status u něj.
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

    onPortletClick(action: string): void {
        if (action === 'update_hardware') {
            this.onEditClick(this.hardware);
        }

        if (action === 'deactivate_hardware') {

        }

        if (action === 'active_hardware') {
        }
    }

    logRecived(log: any) {
        if (log.id) {

        }
    }

    onMessage(msg: ITerminalWebsocketMessage) {
        let deviceTerminal = this.terminalHardware.find(device => device.id === msg.hardware_id); // najdeme hardware, kterého se zpráva týká
        if (deviceTerminal) {
            if (!deviceTerminal.connected && msg.message_type === 'subscribe_hardware') {
                deviceTerminal.connected = true;
            }
            if (this.consoleLog) {
                this.consoleLog.add(msg.level, msg.message, (deviceTerminal.name ? deviceTerminal.name : msg.hardware_id), msg.hardware_id); // přidání zprávy do consoleComponent

            }
        }
    }

    onStateMessage(msg: IWebsocketTerminalState) {
        let terminalDevice;
        if (this.terminalHardware) {
            terminalDevice = this.terminalHardware.find(terminal => {
                if (msg.websocketUrl && msg.websocketUrl.includes(terminal.hardwareURL + ':' + terminal.hardwareURLport)) {
                    return true;
                }
            });
        }

        switch (msg.reason) { // pro případné samosté obstarávání každého problému co nastane na websocketu
            case 'cantConnect':
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_connect'))); // v některých případech chybí serverUrl/port, takže backend rovnou vyhodí že se nedá připojit
                break;

            case 'conectionFailed':
                // this.addFlashMessage(new FlashMessageError(this.translate('flash_conection_failed')));
                terminalDevice.connected = msg.isConnected;
                break;

            case 'dissconected':
                terminalDevice.connected = msg.isConnected;
                break;

            case 'opened':
                terminalDevice.connected = msg.isConnected; // najdeme odebíraný HW kterého se status update týká a upravíme ho (pokud se nenajde, prostě se to přeskočí)
                break;
        }
    }


    onAddTerminalHardwareClick() {
        if (this.avalibleHardware && this.avalibleHardware.length > 0) { // pokud máme dostupný hardware na odběr, tak pokračujem jinak vyhodíme flashmesseage
            this.addNewHardwareToTerminal();

        } else {
            this.addFlashMessage(new FlashMessageError(this.translate('flash_no_more_device')));

        }
    }

    onUserUnsubscribeClick(terminal: TerminalParameters) {
        this.modalService.showModal(new ModalsRemovalModel((terminal.name ? terminal.name : terminal.id), this.translate('modal_unsubscribe_device', (terminal.name ? terminal.name : terminal.id)))).then((success) => {
            if (success) {
                this.avalibleHardware = this.avalibleHardware.concat(this.terminalHardware.splice(this.terminalHardware.findIndex(device => device.id === terminal.id), 1));
                // Tímto přidáme unsubscribed HW do "avalibeHardware" takže ho uživatel může znovu přidat

                this.tyrionBackendService.requestDeviceTerminalUnsubcribe(terminal.id, terminal.hardwareURL + ':' + terminal.hardwareURLport); // pošleme unsubscribe request na WS
                // this.tyrionBackendService.closeHardwareTerminalWebsocket(terminal.hardwareURL + ':' + terminal.hardwareURLport); // je lepší je ponechat WS otevřený v "resting" stavu a pak je všechny zavřít najedou
            }
        });
    }

    onUserChangeLogLevelClick(terminal: TerminalParameters) { // změna log levelu
        let logLevel: string;
        let model = new ModalsLogLevelModel(terminal.logLevel);

        this.modalService.showModal(model).then((success) => {
            if (success) {

                logLevel = model.logLevel;

                this.terminalHardware.find(terminals => terminal.id === terminals.id).logLevel = logLevel;

                this.tyrionBackendService.requestDeviceTerminalUnsubcribe(terminal.id, terminal.hardwareURL + ':' + terminal.hardwareURLport);
                this.tyrionBackendService.requestDeviceTerminalSubcribe(terminal.id, terminal.hardwareURL + ':' + terminal.hardwareURLport, logLevel);
                // Zde se odhlásíme a příhlásíme k s novým loglevelem

            }
        });


    }

    addNewHardwareToTerminal() { // přidání HW do "odebíraných"
        let model = new ModalPickHardwareTerminalModel(this.avalibleHardware, this.avalibleColors[this.lastInstance]);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.colorForm.addControl('color' + model.selectedBoard.id, new FormControl('color' + model.selectedBoard.id));
                this.colorForm.controls['color' + model.selectedBoard.id].setValue(model.color);
                // pokud modal projde, přidáme nový controls s ID dle ID hardwaru, práci s ním


                let deleteId = this.avalibleHardware.findIndex(x => x.id === model.selectedBoard.id);
                if (deleteId > -1) {
                    this.avalibleHardware.splice(deleteId, 1);
                } // najdeme a odebereme daný HW ze seznamu dostupných HW


                if (this.terminalHardware.find(hardware => {
                    if (hardware.hardwareURL !== model.selectedBoard.hardwareURL || hardware.hardwareURLport !== model.selectedBoard.hardwareURLport) {
                        return true;
                    } // Pokud nenajdeme HW, se stejným portem nebo server URL, pošleme novej pořadavek na připojení HW
                })) {
                    // console.log('addNewHardwareToTerminal(): URL: ', model.selectedBoard.hardwareURL, ' Port: ', model.selectedBoard.hardwareURLport );
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
                }); // přidáme data o subsribed HW

                this.tyrionBackendService.requestDeviceTerminalSubcribe(model.selectedBoard.id, model.selectedBoard.hardwareURL + ':' + model.selectedBoard.hardwareURLport, model.logLevel);
                this.lastInstance++;
                // Nakonec na nově otevřený WS pošleme subscribe request

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


        if (this.WSinit) {
            this.terminalHardware.forEach(hardware => {
                this.tyrionBackendService.requestDeviceTerminalUnsubcribe(hardware.id, hardware.hardwareURL + ':' + hardware.hardwareURLport);
            }); // odhlásíme každej HW co byl připojen

            this.tyrionBackendService.closeHardwareTerminalWebsocket('all'); // zavřeme všechny HW websockety na backednu
            this.hardwareTerminalWS.unsubscribe();
            this.hardwareTerminalStateWS.unsubscribe(); // unsubscribe toho neposedného subscribera, takže se nestane že přijde stejná flash messeage 5x za sebou
        }
    }

    onToggleTab(tab: string) {

        this.hardwareTab = tab;

        if (tab === 'updates' && this.actualizationTaskFilter == null) {
            this.onFilterActualizationProcedureTask();
        }

        if (tab === 'command_center' && !this.WSinit) {
            this.blockUI();
            this.WSinit = true; // aby se celá inicializace websocketů nepusila znova


            this.hardwareTerminalWS = this.tyrionBackendService.hardwareTerminal.subscribe(msg => this.onMessage(msg));

            this.hardwareTerminalStateWS = this.tyrionBackendService.hardwareTerminalState.subscribe(msg => this.onStateMessage(msg));


            this.colorForm.valueChanges.subscribe(value => {
                if (this.consoleLog) {
                    Object.keys(value).forEach( // pro každej prvek colorform
                        colorKey => {
                            this.consoleLog.addSourceColor(colorKey.substr(5), value[colorKey]); // přidáme jeden sourceColor kterej měníme při jakékoliv změně barvy
                        });
                }
            });

            if (this.hardware.server && this.hardware.server.server_url && this.hardware.server.hardware_logger_port) {
                this.terminalFirstRun(this.hardware);
            } else {
                this.terminalHardware.push({ // pokud nemá device jak URL tak i PORT tak ho přidáme do seznamu, ale nepřipojíme ho
                    'id': this.hardware.id,
                    'logLevel': 'info',
                    'name': this.hardware.name,
                    'onlineStatus': this.hardware.online_state,
                    'hardwareURL': null,
                    'hardwareURLport': null,
                    'connected': false
                });
            }

            this.tyrionBackendService.boardsGetWithFilterParameters(0, { // TODO https://youtrack.byzance.cz/youtrack/issue/BECKI-368
                projects: [this.projectId],
                hardware_type_ids: []
            }).then(boards => {

                let hardwares = boards.content.filter(item => {
                    return !this.terminalHardware.some(board => board.id === item.id); // vyfiltruje již existjící boardy
                });

                hardwares.map(hardware => {
                    this.tyrionBackendService.boardGet(hardware.id).then(board => { // na seznam všech získaných boardů se postupně zeptá a přidá je do seznamu dostupných HW
                        if (board.server && board.server.server_url) {
                            this.avalibleHardware.push({
                                'id': hardware.id,
                                'logLevel': 'info',
                                'name': hardware.name,
                                'onlineStatus': board.online_state,
                                'hardwareURL': board.server.server_url,
                                'hardwareURLport': board.server.hardware_logger_port,
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
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.boardGet(this.hardwareId) // TODO [permission]: Project.read_permission
            .then((hardware) => {
                this.hardware = hardware;
                this.config_array();

                this.tyrionBackendService.onlineStatus.subscribe(status => {
                    if (status.model === 'HomerServer' && this.hardware.server.id === status.model_id) {
                        this.hardware.server.online_state = status.online_state;
                    }
                });

                return this.tyrionBackendService.hardwareTypeGet(this.hardware.hardware_type_id);

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


    terminalFirstRun(board: IHardware): void {

       // console.log(' terminalFirstRun():', 'URL: ' + board.server.server_url, ' Port: ' + board.server.hardware_logger_port);
       // console.log(' terminalFirstRun(): Server', board.server);

        this.tyrionBackendService.connectDeviceTerminalWebSocket(board.server.server_url, board.server.hardware_logger_port + '');
        // připojení k websocketu daného deviceu

        // TODO při změně jména/aliasu refreshnout název terminálu

        this.colorForm.addControl('color' + board.id, new FormControl('color' + board.id)); // přidáme control na barvu v terminálu
        this.colorForm.controls['color' + board.id].setValue('#0000FF'); // přidáme default barvu
        this.terminalHardware.push({ // přidáme to do seznamu "odebýraných HW"
            'id': board.id,
            'logLevel': 'info',
            'name': board.name,
            'onlineStatus': board.online_state,
            'hardwareURL': board.server.server_url,
            'hardwareURLport': board.server.hardware_logger_port,
            'connected': false
        });

        new Promise<any>((resolve) => {
            // todle je takovej "oblouk", protože nevíme kdy se console.log inicializuje, vytvoříme si interval kterej se každejch 100 ms ptá, zda již consoleLog existuje
            // pokud kohokoliv napadne lepší řešení, tohoto, feel free to do it

            let checker = setInterval(() => {
                if (this.consoleLog) {
                    clearInterval(checker);
                    resolve();
                }
            }, 100);


        }).then(() => {
            this.colorForm.controls['color' + board.id].setValue('#0000FF'); // přidáme do console.log barvu
            this.consoleLog.add('output', 'Initializing the device, more info in settings', board.id, board.id);
        });
        //   if (board.server && board.server.server_url) {// prob. navíc podmínka
        this.tyrionBackendService.requestDeviceTerminalSubcribe(board.id, board.server.server_url + ':' + board.server.hardware_logger_port, 'info');
        // Pošleme request na WS o subscribe logy
        //   }
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

    onFreezeDeviceClick(device: IHardware): void {
        this.modalService.showModal(new ModalsRemovalModel(device.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.projectDeactiveHW(device.id)
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

    onActiveDeviceClick(device: IHardware): void {
        this.modalService.showModal(new ModalsRemovalModel(device.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.projectActiveHW(device.id)
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
                        device_ids: [this.hardware.id]
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

    /* tslint:disable:max-line-length ter-indent */
    onFilterActualizationProcedureTask(pageNumber: number = 0,
        states: ('COMPLETE' | 'CANCELED'|'BIN_FILE_MISSING' | 'NOT_YET_STARTED' | 'IN_PROGRESS' | 'OBSOLETE' | 'NOT_UPDATED' | 'WAITING_FOR_DEVICE' | 'INSTANCE_INACCESSIBLE' | 'HOMER_SERVER_IS_OFFLINE' | 'HOMER_SERVER_NEVER_CONNECTED' | 'CRITICAL_ERROR')[] = ['COMPLETE', 'CANCELED', 'BIN_FILE_MISSING', 'NOT_YET_STARTED','IN_PROGRESS', 'OBSOLETE', 'NOT_UPDATED', 'WAITING_FOR_DEVICE', 'INSTANCE_INACCESSIBLE', 'HOMER_SERVER_IS_OFFLINE', 'HOMER_SERVER_NEVER_CONNECTED', 'CRITICAL_ERROR'],
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
            let m = new ModalsHardwareCodeProgramVersionSelectModel(this.projectId, this.hardware.hardware_type_id);
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
