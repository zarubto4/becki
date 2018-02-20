import { Component, Injector, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import {
    IHardware, IBootLoader, ICProgramVersion, IGarfield, IHardwareNewSettingsResult, IHomerServer,
    IPrinter, IHardwareType
} from '../backend/TyrionAPI';
import { ModalsRemovalModel } from '../modals/removal';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsGarfieldModel } from '../modals/garfield';
import { Subscription } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import {
    TyrionApiBackend, IWebSocketGarfieldDeviceConnect, IWebSocketGarfieldDeviceConfigure, IWebSocketMessage,
    IWebSocketGarfieldDeviceBinary, IWebSocketGarfieldDeviceTest
} from '../backend/BeckiBackend';
import { ConsoleLogComponent } from '../components/ConsoleLogComponent';
import { ModalsConfirmModel } from '../modals/confirm';

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

    firmwareTestMainVersion: ICProgramVersion = null;    // Main Test Firmware
    firmwareMainVersion: ICProgramVersion = null;        // Main Production Firmware
    bootLoader: IBootLoader = null;
    mainServer: IHomerServer = null;           // Destination for Server registration
    backupServer: IHomerServer = null;         // Destination for Server registration (backup)

    productionBatchForm: FormGroup; // Burn Info Batch Form HardwareType.batch
    batchOptions: FormSelectComponentOption[] = null;
    batch: string = null;

    personName: string = null; // Who testing

    printer_label_1: IPrinter = null; // Printer
    printer_label_2: IPrinter = null; // Printer
    print_sticker: IPrinter = null;   // Printer

    garfieldAppConnected: boolean = false; // Flag Register for initialization of connection (garfield desktop app)
    garfieldTesterConnected: boolean = false; // Flag Register for initialization of connection (garfield Kit)
    testHardwareConnected: boolean = false; // Flag Register for initialization of connection (Device for testing)

    garfieldAppDetection: any = null;

    formConfigJson: FormGroup;

    actions: GarfieldAction[] = [];

    messageBuffer: GarfieldRequest[] = [];

    // For checking online state on printers
    reloadInterval: any = null;

    mainStep: number = 0;
    errorStep: number = 0; // Made Step to Red

    routeParamsSubscription: Subscription;
    wsMessageSubscription: Subscription;

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

        this.wsMessageSubscription = this.tyrionBackendService.garfieldRecived.subscribe(msg => this.onMessage(msg));

        let message: IWebSocketMessage = {
            message_channel: TyrionApiBackend.WS_CHANNEL_GARFIELD,
            message_type: 'subscribe_garfield',
            message_id: this.tyrionBackendService.uuid()
        };

        this.tyrionBackendService.sendWebSocketMessage(message);
    }

    ngOnDestroy(): void {
        let message: IWebSocketMessage = {
            message_channel: TyrionApiBackend.WS_CHANNEL_GARFIELD,
            message_type: 'unsubscribe_garfield',
            message_id: this.tyrionBackendService.uuid()
        };

        this.tyrionBackendService.sendWebSocketMessage(message);
        this.wsMessageSubscription.unsubscribe();
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


                this.batchOptions = this.hardwareType.batchs.map((pv) => {
                    return {
                        label: pv.revision + ' ' + pv.production_batch + ' (' + pv.assembled + ')',
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
                    .then((IHomerServer) => {

                        for (let key in IHomerServer) {

                            if (!IHomerServer.hasOwnProperty(key)) {
                                continue;
                            }

                            if (IHomerServer[key].server_type === 'main_server') {
                                this.tyrionBackendService.homerServerGet(IHomerServer[key].id)
                                    .then((server) => {
                                        this.mainServer = server;
                                    })
                                    .catch((reason) => {
                                        this.fmError(this.translate('flash_cant_load_homer_servers_main', reason));
                                        this.unblockUI();
                                    });
                            }

                            if (IHomerServer[key].server_type === 'backup_server') {
                                this.tyrionBackendService.homerServerGet(IHomerServer[key].id)
                                    .then((server) => {
                                        this.backupServer = server;
                                    })
                                    .catch((reason) => {
                                        this.fmError(this.translate('flash_cant_load_homer_servers_backup', reason));
                                        this.unblockUI();
                                    });
                            }

                        }
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_cant_load_homer_servers', reason));
                        this.unblockUI();
                    });

                this.unblockUI();
            })
            .catch((reason) => {
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
        this.actions.push(new GarfieldAction(this.uploadBootLoaderProcess.bind(this)));
        this.actions.push(new GarfieldAction(this.uploadTestFirmwareProcess.bind(this)));
        this.actions.push(new GarfieldAction(this.testDeviceProcess.bind(this)));
        this.actions.push(new GarfieldAction(this.uploadProductionFirmwareProcess.bind(this)));
        this.actions.push(new GarfieldAction(this.configureDeviceProcess.bind(this)));
        this.actions.push(new GarfieldAction(this.backUpProcess.bind(this)));
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
                .catch((reason) => {
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
                .catch((reason) => {
                    // this.addFlashMessage(new FlashMessageError('Printers cannot be loaded.', reason));
                    // not show error message -it will be showed in template
                });
        }
    }

    onTestPrinter(printerId: number) {

        this.tyrionBackendService.printerTestprinting(this.garfieldId, printerId)
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_test_print_success')));
            }).catch(reason => {
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
                this.tyrionBackendService.garfieldEdit(this.garfieldId, {
                    description: model.description,
                    name: model.name,
                    print_label_id_1: model.print_label_id_1,
                    print_label_id_2: model.print_label_id_2,
                    print_sticker_id: model.print_sticker_id,
                    hardware_tester_id: model.hardware_tester_id
                })
                    .then(() => {
                        this.refresh();
                    }).catch(reason => {
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
                    .catch(reason => {
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
            let msg: IWebSocketMessage = {
                message_channel: TyrionApiBackend.WS_CHANNEL_GARFIELD,
                message_type: 'keepalive',
                message_id: this.tyrionBackendService.uuid()
            };
            this.tyrionBackendService.sendWebSocketMessage(msg);
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
                    .catch((reason) => {
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
                    .catch((reason) => {
                        reject(reason);
                    });
            }
        });
    }

    getDeviceId(): Promise<any> {
        let message: IWebSocketMessage = {
            message_channel: TyrionApiBackend.WS_CHANNEL_GARFIELD,
            message_type: 'device_id',
            message_id: this.tyrionBackendService.uuid()
        };
        return this.send(message, 15000);
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
        return new Promise((resolve, reject) => {
            let message: IWebSocketGarfieldDeviceBinary = {
                message_channel: TyrionApiBackend.WS_CHANNEL_GARFIELD,
                message_type: 'device_binary',
                message_id: this.tyrionBackendService.uuid(),
                url: this.bootLoader.file_path,
                type: 'bootloader'
            };

            this.send(message, 30000)
                .then((response) => {
                    resolve('bootloader upload successful');
                })
                .catch((reason) => {
                    if (typeof reason === 'object' && reason.hasOwnProperty('error')) {
                        reject('bootloader upload failed - ' + reason['error']);
                    } else if (typeof reason === 'string') {
                        reject('bootloader upload failed - ' + reason);
                    } else {
                        reject('bootloader upload failed');
                    }
                });
        });
    }

    uploadTestFirmwareProcess(): Promise<string> {
        return new Promise((resolve, reject) => {
            let message: IWebSocketGarfieldDeviceBinary = {
                message_channel: TyrionApiBackend.WS_CHANNEL_GARFIELD,
                message_type: 'device_binary',
                message_id: this.tyrionBackendService.uuid(),
                url: this.firmwareTestMainVersion.download_link_bin_file,
                type: 'firmware'
            };

            this.send(message, 60000)
                .then((response) => {
                    resolve('test firmware upload successful');
                })
                .catch((reason) => {
                    if (typeof reason === 'object' && reason.hasOwnProperty('error')) {
                        reject('test firmware upload failed - ' + reason['error']);
                    } else if (typeof reason === 'string') {
                        reject('test firmware upload failed - ' + reason);
                    } else {
                        reject('test firmware upload failed');
                    }
                });
        });
    }

    testDeviceProcess(): Promise<string> {
        return new Promise((resolve, reject) => {
            let message: IWebSocketGarfieldDeviceTest = {
                message_channel: TyrionApiBackend.WS_CHANNEL_GARFIELD,
                message_type: 'device_test',
                message_id: this.tyrionBackendService.uuid(),
                test_config: JSON.parse(this.formConfigJson.controls['test_config'].value)
            };

            this.send(message, 30000)
                .then((response) => {
                    resolve('device test successful');
                })
                .catch((reason) => {
                    if (typeof reason === 'object' && reason.hasOwnProperty('errors')) {
                        reject(reason['errors']);
                    } else if (typeof reason === 'string') {
                        reject('device test failed - ' + reason);
                    } else {
                        reject('device test failed');
                    }
                });
        });
    }

    uploadProductionFirmwareProcess(): Promise<string> {
        return new Promise((resolve, reject) => {
            let message: IWebSocketGarfieldDeviceBinary = {
                message_channel: TyrionApiBackend.WS_CHANNEL_GARFIELD,
                message_type: 'device_binary',
                message_id: this.tyrionBackendService.uuid(),
                url: this.firmwareMainVersion.download_link_bin_file,
                type: 'firmware'
            };

            this.send(message, 60000)
                .then((response) => {
                    resolve('firmware upload successful');
                })
                .catch((reason) => {
                    if (typeof reason === 'object' && reason.hasOwnProperty('error')) {
                        reject('firmware upload failed - ' + reason['error']);
                    } else if (typeof reason === 'string') {
                        reject('firmware upload failed - ' + reason);
                    } else {
                        reject('firmware upload failed');
                    }
                });
        });
    }

    configureDeviceProcess(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.deviceSafe()
                .then((device: IHardwareNewSettingsResult) => {
                    let message: IWebSocketGarfieldDeviceConfigure = {
                        message_channel: TyrionApiBackend.WS_CHANNEL_GARFIELD,
                        message_type: 'device_configure',
                        message_id: this.tyrionBackendService.uuid(),
                        configuration: device.configuration
                    };

                    if (message.configuration.hasOwnProperty('mac')) {
                        message.configuration['mac'] = message.configuration['mac'].toLowerCase();
                    }

                    let configJson: any = JSON.parse(this.formConfigJson.controls['config'].value);

                    for (let key in configJson) {
                        if (configJson.hasOwnProperty(key)) {
                            message.configuration[key] = configJson[key];
                        }
                    }

                    this.send(message, 60000)
                        .then((response) => {
                            resolve('device configuration successful');
                        })
                        .catch((reason) => {
                            if (typeof reason === 'object' && reason.hasOwnProperty('error')) {
                                reject('device configuration failed - ' + reason['error']);
                            } else if (typeof reason === 'string') {
                                reject('device configuration failed - ' + reason);
                            } else {
                                reject('device configuration failed');
                            }
                        });
                })
                .catch((reason) => {
                    if (typeof reason === 'object' && reason.hasOwnProperty('error')) {
                        reject('device configuration failed - ' + reason['error']);
                    } else if (typeof reason === 'string') {
                        reject('device configuration failed - ' + reason);
                    } else {
                        reject('device configuration failed - unable to load device');
                    }
                });
        });
    }

    backUpProcess(): Promise<string> {
        return new Promise((resolve, reject) => {
            let message: IWebSocketMessage = {
                message_channel: TyrionApiBackend.WS_CHANNEL_GARFIELD,
                message_type: 'device_backup',
                message_id: this.tyrionBackendService.uuid(),
            };

            this.send(message, 30000)
                .then((response) => {
                    resolve('device backup successful');
                })
                .catch((reason) => {
                    if (typeof reason === 'object' && reason.hasOwnProperty('error')) {
                        reject('device backup failed - ' + reason['error']);
                    } else if (typeof reason === 'string') {
                        reject('device backup failed - ' + reason);
                    } else {
                        reject('device backup failed');
                    }
                });
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
            let msg: IWebSocketMessage = <IWebSocketMessage>{
                message_id: message.message_id,
                message_type: message.message_type,
                message_channel: message.message_channel,
                status: 'success'
            };
            this.tyrionBackendService.sendWebSocketMessage(msg);
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
        let msg: IWebSocketGarfieldDeviceConnect = <IWebSocketGarfieldDeviceConnect>message;
        if (msg.device_id) {
            this.deviceId = msg.device_id;
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

    handleSingleMessage(message: IWebSocketMessage) {
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

    onMessage(message: IWebSocketMessage) {
        // Find the message in buffer
        let index: number = this.messageBuffer.findIndex((req) => {
            return req.message.message_type === message.message_type && req.message.message_id === message.message_id;
        });

        if (index === -1) {
            this.handleSingleMessage(message); // Message was not response on request
        } else {
            let request: GarfieldRequest = this.messageBuffer[index];
            let status: string = message['status'];

            if (status === 'error') {
                request.reject(message);
            } else if (status === 'success') {
                request.resolve(message);
            } else {
                console.warn('Got response on request, but without \'status\', message:', JSON.stringify(message));
            }
        }
    }

    send(message: IWebSocketMessage, timeout: number): Promise<any> {
        return new Promise((resolve, reject) => {
            let request: GarfieldRequest = new GarfieldRequest(message, timeout);

            // This will happen if no response was received and time is up
            let onTimeout = (): void => {

                let index: number = this.messageBuffer.findIndex((req) => {
                    return req.message.message_id === message.message_id;
                });

                if (index > 0) {
                    let requests: GarfieldRequest[] = this.messageBuffer.splice(index, 1);
                    requests.forEach((r) => { r.reject('timeout for response'); });
                } else {
                    console.warn('Timeout for response, but could not found the request in buffer.');
                }
            };

            request.setCallbacks(resolve, reject, onTimeout.bind(this));
            request.startTimeout(); // Begin countdown
            this.messageBuffer.push(request);
            this.tyrionBackendService.sendWebSocketMessage(message);
        });
    }
}

export class GarfieldRequest {

    public message: IWebSocketMessage;

    private resolveCallback: (response: IWebSocketMessage) => void;
    private rejectCallback: (reason: any) => void;
    private timeout: number = 30000;
    private onTimeout: () => void;
    private timeoutHandler;

    constructor(message: IWebSocketMessage, timeout: number) {
        this.message = message;
        this.timeout = timeout;
    }

    public setCallbacks(resolve: (response: IWebSocketMessage) => void, reject: (reason: any) => void, onTimeout: () => void): void {
        this.resolveCallback = resolve;
        this.rejectCallback = reject;
        this.onTimeout = onTimeout;
    }

    public startTimeout(): void {
        this.timeoutHandler = setTimeout(this.onTimeout, this.timeout);
    }

    public resolve(response: IWebSocketMessage): void {
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
        }

        this.resolveCallback(response);
    }

    public reject(response: any): void {
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
        }

        this.rejectCallback(response);
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
