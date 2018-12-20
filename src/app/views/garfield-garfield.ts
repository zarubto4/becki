import { Component, Injector, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import {
    IBootLoader, ICProgramVersion, IGarfield, IHardwareNewSettingsResult, IHomerServer, IPrinter, IHardwareType,
    IHomerServerList
} from '../backend/TyrionAPI';
import { ModalsRemovalModel } from '../modals/removal';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsGarfieldModel } from '../modals/garfield';
import { Subscription } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { ConsoleLogComponent } from '../components/ConsoleLogComponent';
import { ModalsConfirmModel } from '../modals/confirm';
import { WebSocketClientGarfield } from '../services/websocket/WebSocketClientGarfield';
import { IWebSocketMessage } from '../services/websocket/WebSocketMessage';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-garfield-garfield',
    templateUrl: './garfield-garfield.html'
})
export class GarfieldGarfieldComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    garfield: IGarfield = null;
    garfieldId: string;
    hardwareType: IHardwareType = null;
    device: IHardwareNewSettingsResult = null;
    deviceId: string = null;

    firmwareTestMainVersion: ICProgramVersion = null; // Main Test Firmware
    firmwareMainVersion: ICProgramVersion = null;     // Main Production Firmware
    bootLoader: IBootLoader = null;
    mainServer: IHomerServer = null;   // Destination for Server registration
    backupServer: IHomerServer = null; // Destination for Server registration (backup)

    productionBatchForm: FormGroup;    // Burn Info Batch Form HardwareType.batch
    batchOptions: FormSelectComponentOption[] = null;
    batch: string = null;

    personName: string = null; // Who testing

    printer_label_1: IPrinter = null; // Printer
    printer_label_2: IPrinter = null; // Printer
    print_sticker: IPrinter = null;   // Printer

    garfieldAppConnected: boolean = false;      // Flag Register for initialization of connection (garfield desktop app)
    garfieldTesterConnected: boolean = false;   // Flag Register for initialization of connection (garfield Kit)
    testHardwareConnected: boolean = false;     // Flag Register for initialization of connection (Device for testing)

    garfieldAppDetection: any = null;

    formConfigJson: FormGroup;

    actions: GarfieldAction[] = [];

    // Socket
    websocket: WebSocketClientGarfield = null;

    // For checking online state on printers
    reloadInterval: any = null;

    mainStep: number = 0;
    errorStep: number = 0; // Made Step to Red

    routeParamsSubscription: Subscription;

    testConfig: string = null;

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.garfieldId = params['garfield'];
            this.refresh();
        });

        this.productionBatchForm = this.formBuilder.group({
            'batch': ['', [Validators.required]]
        });

        let testConfigJSON: any = {
            pins: {
                up: {
                    x: ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
                    y: ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
                    z: ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1']
                },
                down: {
                    x: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
                    y: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
                    z: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0']
                }
            },
            power: {
                poe_act: {
                    vbus: {
                        min: 0,
                        max: 0
                    },
                    v3: {
                        min: 0,
                        max: 0
                    },
                    curr: {
                        min: 0,
                        max: 0
                    }
                },
                poe_pas: {
                    vbus: {
                        min: 0,
                        max: 0
                    },
                    v3: {
                        min: 0,
                        max: 0
                    },
                    curr: {
                        min: 0,
                        max: 0
                    }
                },
                ext_pwr: {
                    vbus: {
                        min: 0,
                        max: 0
                    },
                    v3: {
                        min: 0,
                        max: 0
                    },
                    curr: {
                        min: 0,
                        max: 0
                    }
                },
                usb_pwr: {
                    vbus: {
                        min: 0,
                        max: 0
                    },
                    v3: {
                        min: 0,
                        max: 0
                    },
                    curr: {
                        min: 0,
                        max: 0
                    }
                }
            }
        };
        this.testConfig = JSON.stringify(testConfigJSON);

        this.formConfigJson = this.formBuilder.group({
            'config': ['', [Validators.required]],
            'test_config': ['', [Validators.required]]
        });


        this.tyrionBackendService.getWebsocketService().connectGarfieldWebSocket( (socket: WebSocketClientGarfield, error: any) =>  {
            if (socket) {
                this.websocket = socket;
                this.websocket.messages.subscribe(m => this.onMessage(m));

                this.websocket.requestSubscribe()
                    .then((response: IWebSocketMessage) => {
                        if (response.isSuccessful()) {
                            this.fmInfo(this.translate('flash_garfield_connected'));
                        }
                    })
                    .catch((reason: IError) => {
                        console.error('connectGarfieldWebSocket:', reason);
                    });

            } else {
                console.error('connectGarfieldWebSocket:: Error', error);
            }
        });
    }

    ngOnDestroy(): void {

        if (this.websocket) {
            this.websocket.requestUnsubscribe()
                .then((response: IWebSocketMessage) => {
                    if (!response.isSuccessful()) {
                        throw new Error('Unsubscribe failed');
                    }
                })
                .catch((reason: IError) => {
                    console.error('ngOnDestroy:', reason);
                })
                .then(() => {
                    this.websocket.disconnect();
                });
        }

        clearInterval(this.reloadInterval);
        clearTimeout(this.garfieldAppDetection);
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.garfieldGet(this.garfieldId)
            .then((garfield) => {
                this.garfield = garfield;

                this.hardwareType = garfield.hardware_type;
                this.bootLoader = garfield.hardware_type.main_boot_loader;


                this.batchOptions = this.hardwareType.batches.map((pv) => {
                    return {
                        label: pv.revision + ' ' + pv.production_batch + ' (' + pv.date_of_assembly + ')',
                        value: pv.id
                    };
                });

                let personObject = this.tyrionBackendService.personInfoSnapshot;
                this.personName = personObject.first_name + personObject.last_name;

                // Find Test firmware main test version
                for (let key in this.garfield.hardware_type.main_test_c_program.program_versions) {

                    if (!this.hardwareType.main_test_c_program.program_versions.hasOwnProperty(key)) {
                        continue;
                    }


                    if (this.hardwareType.main_test_c_program.program_versions[key].main_mark) {
                        this.firmwareTestMainVersion = this.hardwareType.main_test_c_program.program_versions[key];
                        break;
                    }
                }

                // Find Main Production firmware main version
                for (let key in this.garfield.hardware_type.main_c_program.program_versions) {

                    if (!this.hardwareType.main_c_program.program_versions.hasOwnProperty(key)) {
                        continue;
                    }

                    if (this.hardwareType.main_c_program.program_versions[key].main_mark) {
                        this.firmwareMainVersion = this.hardwareType.main_c_program.program_versions[key];
                        break;
                    }
                }

                // Find Main and Backup Server
                this.tyrionBackendService.homerServersGetList(0, {
                    server_types : ['BACKUP', 'MAIN']
                })
                    .then((servers: IHomerServerList) => {

                        servers.content.forEach((server: IHomerServer) => {
                            if (server.server_type === 'MAIN') {
                                this.mainServer = server;
                            }

                            if (server.server_type === 'BACKUP') {
                                this.backupServer = server;
                            }
                        });
                    })
                    .catch((reason: IError) => {
                        this.fmError(this.translate('flash_cant_load_homer_servers', reason));
                        this.unblockUI();
                    });

                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError(this.translate('flash_cant_load', reason));
                this.unblockUI();
            });

        // And after that every 15 seconds
        this.reloadInterval = setInterval(() => {
            this.reloadPrinters();
        }, 15000);
    }

    beginProcess(): void {
        if (this.actions.find(action => action.isFailed())) {
            this.modalService.showModal(new ModalsConfirmModel(this.translate('modal_title_new_device'), this.translate('modal_text_repeat')))
                .then((value) => {
                    if (value) {
                        this.continueProcess();
                    } else {
                        this.loadProcessAndStart();
                    }
                });
        } else {
            this.modalService.showModal(new ModalsConfirmModel(this.translate('modal_title_new_device'), this.translate('modal_text_new_device'), false))
                .then((value) => {
                    if (value) {
                        this.loadProcessAndStart();
                    }
                });
        }
    }

    loadProcessAndStart() {
        this.actions = [];
        this.mainStep = 1;
        /*tslint:disable:no-use-before-declare*/
        this.actions.push(new GarfieldAction(this.uploadBootLoaderProcess.bind(this)));
        this.actions.push(new GarfieldAction(this.uploadTestFirmwareProcess.bind(this)));
        this.actions.push(new GarfieldAction(this.testDeviceProcess.bind(this)));
        this.actions.push(new GarfieldAction(this.uploadProductionFirmwareProcess.bind(this)));
        this.actions.push(new GarfieldAction(this.configureDeviceProcess.bind(this)));
        this.actions.push(new GarfieldAction(this.backUpProcess.bind(this)));
        /*tslint:enable:no-use-before-declare*/
        this.continueProcess();
    }

    continueProcess(): void {
        let action: GarfieldAction = this.actions.find((act: GarfieldAction) => {
            return !act.isResolved() || act.isFailed();
        });

        if (action) {
            action.do()
                .then((result) => {
                    action.resolve();
                    this.onConsoleLog(result);
                    this.continueProcess();
                })
                .catch((reason: IError) => {
                    this.fmError(this.translate('flash_fail'), reason);
                    action.fail();
                    this.onConsoleError(reason.toString());
                });
        } else {
            this.fmSuccess(this.translate('flash_burn_successful'));
        }
    }

    reloadPrinters(): void {
        if (this.garfield && this.garfield.print_sticker_id && this.garfield.print_label_id_1 && this.garfield.print_label_id_2) {

            Promise.all<any>([
                this.tyrionBackendService.printerGetOnlineState(this.garfieldId, this.garfield.print_sticker_id),
                this.tyrionBackendService.printerGetOnlineState(this.garfieldId, this.garfield.print_label_id_1),
                this.tyrionBackendService.printerGetOnlineState(this.garfieldId, this.garfield.print_label_id_2)
            ])
                .then((values: [IPrinter, IPrinter, IPrinter]) => {
                    this.print_sticker = values[0];
                    this.printer_label_1 = values[1];
                    this.printer_label_2 = values[2];
                })
                .catch((reason: IError) => {
                    // this.addFlashMessage(new FlashMessageError('Printers cannot be loaded.', reason));
                    // not show error message -it will be showed in template
                });
        }
    }

    onTestPrinter(printerId: number) {

        this.tyrionBackendService.printerTestprinting(this.garfieldId, printerId)
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_test_print_success')));
            }).catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                this.refresh();
            });
    }

    onEditGarfield() {
        let model = new ModalsGarfieldModel(
            null,
            null,
            this.garfield.name,
            this.garfield.description,
            this.garfield.print_label_id_1,
            this.garfield.print_label_id_2,
            this.garfield.print_sticker_id,
            this.garfield.hardware_tester_id,
            true,
            this.garfield.producer.name,
            this.garfield.hardware_type.name
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.andEditSaveGarfield(this.garfieldId, {
                    description: model.description,
                    name: model.name,
                    print_label_id_1: model.print_label_id_1,
                    print_label_id_2: model.print_label_id_2,
                    print_sticker_id: model.print_sticker_id,
                    hardware_tester_id: model.hardware_tester_id
                })
                    .then(() => {
                        this.refresh();
                    }).catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onDeleteGarfield() {
        this.modalService.showModal(new ModalsRemovalModel(this.garfield.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.garfieldDelete(this.garfieldId)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.navigate(['admin/garfield/']);
                    })
                    .catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onClearConsoleClick() {
        if (this.consoleLog) {
            this.consoleLog.clear();
        }
    }

    onConsoleLog(message: string): void {
        if (this.consoleLog) {
            this.consoleLog.add('log', message);
        }
    }

    onConsoleError(message: string): void {
        if (this.consoleLog) {
            this.consoleLog.add('error', message);
        }
    }

    onDisconnectGarfield() {
        this.fmWarning(this.translate('flash_garfield_disconnected'));
        this.garfieldAppConnected = false;
        this.garfieldTesterConnected = false;
        this.testHardwareConnected = false;
        clearTimeout(this.garfieldAppDetection);
        this.garfieldAppDetection = null;
    }

    resetDetection() {
        if (this.garfieldAppDetection) {
            clearTimeout(this.garfieldAppDetection);
            this.setDetection();
        }
    }

    setDetection() {
        this.garfieldAppDetection = setTimeout(() => {

            this.websocket.requestKeepAlive()
                .then((response: IWebSocketMessage) => {
                    if (!response.isSuccessful()) {
                        throw new Error('Keep alive unsuccessful');
                    }
                })
                .catch((reason: IError) => {
                    console.error('setDetection:', reason);
                });

            this.garfieldAppDetection = setTimeout(() => {
                this.onDisconnectGarfield();
            }, 20000);
        }, 20000);
    }

    // Method is used to make sure that device is registered and loaded
    deviceSafe(): Promise<IHardwareNewSettingsResult> {
        return new Promise((resolve, reject) => {

            if (this.deviceId) {
                this.getDeviceOrRegister(this.deviceId)
                    .then((device: IHardwareNewSettingsResult) => {
                        this.device = device;
                        resolve(device);
                    })
                    .catch((reason: IError) => {
                        this.fmError(this.translate('flash_fail'), reason);
                        reject(reason);
                    });
            } else {
                this.getDeviceId()
                    .then((full_id) => {
                        return this.getDeviceOrRegister(full_id);
                    })
                    .then((device: IHardwareNewSettingsResult) => {
                        this.device = device;
                        resolve(device);
                    })
                    .catch((reason: IError) => {
                        this.fmError(this.translate('flash_fail'), reason);
                        reject(reason);
                    });
            }

        });
    }

    getDeviceId(): Promise<any> {
        return this.websocket.requestGetDeviceID()
            .then((response: IWebSocketMessage) => {
                if (response.isSuccessful()) {
                    return response.data.device_id;
                } else {
                    throw new Error('Unable to get id' + response.error);
                }
            });
    }

    getDeviceOrRegister(full_id: string): Promise<IHardwareNewSettingsResult> {
        return this.tyrionBackendService.boardCreateAutomaticGarfield({
            full_id: full_id,
            garfield_station_id: this.garfield.id,
            batch_id: this.productionBatchForm.controls['batch'].value,
            hardware_type_id: this.hardwareType.id
        });
    }

    /**************************
     *                        *
     * Process Handlers       *
     *                        *
     **************************/

    uploadBootLoaderProcess(): Promise<string> {
        this.mainStep = 3;
        return this.websocket.requestProductionFirmwareProcess(this.bootLoader.file_path, 'BOOTLOADER')
            .then((response: IWebSocketMessage) => {
                if (response.isSuccessful()) {
                    return 'bootloader upload successful';
                } else {
                    throw new Error('upload bootloader unsuccessful: ' + response.error);
                }
            });
    }

    uploadTestFirmwareProcess(): Promise<string> {
        return this.websocket.requestProductionFirmwareProcess(this.firmwareTestMainVersion.download_link_bin_file, 'FIRMWARE')
            .then((response: IWebSocketMessage) => {
                if (response.isSuccessful()) {
                    this.mainStep = 4;
                    return 'test firmware upload successful';
                } else {
                    throw new Error('upload test firmware unsuccessful: ' + response.error);
                }
            });
    }

    testDeviceProcess(): Promise<string> {
        this.mainStep = 5;
        return this.websocket.requestTestConfiguration(JSON.parse(this.formConfigJson.controls['test_config'].value))
            .then((response: IWebSocketMessage) => {
                if (response.isSuccessful()) {
                    this.mainStep = 6;
                    return 'device test successful';
                } else {
                    throw new Error('device test unsuccessful: ' + response.error);
                }
            });
    }

    uploadProductionFirmwareProcess(): Promise<string> {
        return this.websocket.requestProductionFirmwareProcess(this.firmwareMainVersion.download_link_bin_file, 'FIRMWARE')
            .then((response: IWebSocketMessage) => {
                if (response.isSuccessful()) {
                    return 'production firmware upload successful';
                } else {
                    throw new Error('upload production firmware unsuccessful: ' + response.error);
                }
            });
    }

    configureDeviceProcess(): Promise<string> {
        return this.deviceSafe()
            .then((device: IHardwareNewSettingsResult) => {
                return this.websocket.requestDeviceConfigure(device.configuration);
            })
            .then((response: IWebSocketMessage) => {
                if (response.isSuccessful()) {
                    return 'device configuration successful';
                } else {
                    throw new Error('device configuration unsuccessful: ' + response.error);
                }
            });
    }

    backUpProcess(): Promise<string> {
        return this.websocket.requestBackupProcess()
            .then((response: IWebSocketMessage) => {
                if (response.isSuccessful()) {
                    return 'device backup successful';
                } else {
                    throw new Error('device backup unsuccessful: ' + response.error);
                }
            });
    }

    /**************************
     *                        *
     * Message Handlers       *
     *                        *
     **************************/

    onKeepAliveMessage() {
        this.resetDetection();
        if (!this.garfieldAppConnected) {
            this.garfieldAppConnected = true;
            this.fmInfo(this.translate('flash_garfield_connected'));
        }
    }

    onSubscribeGarfieldMessage(message: IWebSocketMessage) {
        this.resetDetection();
        if (!this.garfieldAppConnected) {
            this.garfieldAppConnected = true;
            this.fmInfo(this.translate('flash_garfield_connected'));
        }
        if (!message['status']) {
            this.websocket.respondOnSubscribe(message.message_id);
        }
    }

    onDeviceConnectMessage(message: IWebSocketMessage) {
        if (!(this.garfield
                && this.hardwareType
                && this.bootLoader
                && this.printer_label_1
                && this.printer_label_2
                && this.print_sticker
                && this.garfieldTesterConnected
                && this.bootLoader.file_path
                && this.mainServer
                && this.backupServer
                && this.productionBatchForm.valid)) {
            this.fmError(this.translate('flash_prerequisite_not_met'));
            return;
        }

        this.device = null;
        this.deviceId = null;
        if (message.data['device_id']) {
            this.deviceId = message.data['device_id'];
        }
        this.beginProcess();
    }

    onDeviceDisconnectedMessage() {
        this.testHardwareConnected = false;
        this.device = null;
        this.fmWarning(this.translate('flash_device_disconnected'));
    }

    onTesterConnectedMessage() {
        this.garfieldTesterConnected = true;
        this.fmInfo(this.translate('flash_tester_connected'));
    }

    onTesterDisconnectedMessage() {
        this.garfieldTesterConnected = false;
        this.testHardwareConnected = false;
        this.device = null;
        this.fmWarning(this.translate('flash_tester_disconnected'));
    }

    onMessage(message: IWebSocketMessage) {
        switch (message.message_type) {
            case 'keepalive': this.onKeepAliveMessage(); break;
            case 'subscribe_garfield': this.onSubscribeGarfieldMessage(message); break;
            case 'unsubscribe_garfield': this.onDisconnectGarfield(); break;
            case 'device_connect': this.onDeviceConnectMessage(message); break;
            case 'device_disconnect': this.onDeviceDisconnectedMessage(); break;
            case 'tester_connect': this.onTesterConnectedMessage(); break;
            case 'tester_disconnect': this.onTesterDisconnectedMessage(); break;
            default: console.warn('Got unknown message:', JSON.stringify(message));
        }
    }
}

export class GarfieldAction {

    private action: () => Promise<string>;
    private resolved: boolean = false;
    private failed: boolean = false;

    constructor(action: () => Promise<string>) {
        this.action = action;
    }

    public do(): Promise<string> {
        return this.action();
    }

    public resolve(): void {
        this.resolved = true;
        this.failed = false;
    }

    public fail(): void {
        this.resolved = false;
        this.failed = true;
    }

    public isResolved(): boolean {
        return this.resolved;
    }

    public isFailed(): boolean {
        return this.failed;
    }
}
