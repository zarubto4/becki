/**
 * Created by davidhradek on 05.12.16.
 */

import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import {
    IBoard,
    IBootLoader, ICProgramVersionShortDetail, IGarfield, IHomerServer, IPrinter, IProducer,
    ITypeOfBoard
} from '../backend/TyrionAPI';
import { ModalsRemovalModel } from '../modals/removal';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsGarfieldModel } from '../modals/garfield';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import {
    BeckiBackend, IWebSocketGarfieldDeviceConnect, IWebSocketGarfieldDeviceConfigure, IWebSocketMessage,
    IWebSocketGarfieldDeviceBinary, RestRequest, BugFoundError, IWebSocketGarfieldDeviceConfigureResult,
    IWebSocketGarfieldDeviceBinaryResult
} from '../backend/BeckiBackend';
import {  Response } from '@angular/http';

@Component({
    selector: 'bk-view-garfield-garfield',
    templateUrl: './garfield-garfield.html'
})
export class GarfieldGarfieldComponent extends BaseMainComponent implements OnInit, OnDestroy {

    garfield: IGarfield = null;
    garfieldId: string;
    typeOfBoard: ITypeOfBoard = null;
    device: IBoard = null;

    firmwareTestMainVersion: ICProgramVersionShortDetail = null;    // Main Test Firmware
    firmwareMainVersion: ICProgramVersionShortDetail = null;        // Main Production Firmware
    bootLoader: IBootLoader = null;
    mainServer: IHomerServer = null;           // Destination for Server registration
    backupServer: IHomerServer = null;         // Destination for Server registration (backup)
    testFirmwareDownloadLink: string = null;  // Main Production Firmware

    productionBatchForm: FormGroup; // Burn Info Batch Form TypeOfBoard.batch
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

    // For checking online state on printers
    reloadInterval: any = null;

    main_step: number = 0;
    stepError: boolean = false; // Made Step to Red

    routeParamsSubscription: Subscription;
    wsMessageSubscription: Subscription;

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

        this.formConfigJson = this.formBuilder.group({
            'config': ['', [Validators.required]],
        });

        this.wsMessageSubscription = this.backendService.garfieldWebsocketRecived.subscribe(msg => this.onMessageGarfield(msg));

        let message: IWebSocketMessage = {
            message_channel: BeckiBackend.WS_CHANNEL_GARFIELD,
            message_type: 'subscribe_becki',
            message_id: this.backendService.uuid()
        };

        this.backendService.sendWebSocketMessage(message);
    }

    ngOnDestroy(): void {
        let message: IWebSocketMessage = {
            message_channel: BeckiBackend.WS_CHANNEL_GARFIELD,
            message_type: 'becki_disconnect',
            message_id: this.backendService.uuid()
        };

        this.backendService.sendWebSocketMessage(message);
        this.wsMessageSubscription.unsubscribe();
        clearInterval(this.reloadInterval);
        clearTimeout(this.garfieldAppDetection);
    }

    refresh(): void {
        this.blockUI();
        this.backendService.garfieldGet(this.garfieldId)
            .then((garfield) => {
                this.garfield = garfield;

                this.typeOfBoard = garfield.type_of_board;
                this.bootLoader = garfield.type_of_board.main_boot_loader;


                this.batchOptions = this.typeOfBoard.batchs.map((pv) => {
                    return {
                        label: pv.revision + ' ' + pv.production_batch + ' (' + pv.date_of_assembly + ')',
                        value: pv.id
                    };
                });

                let personObject = this.backendService.personInfoSnapshot;
                this.personName = personObject.full_name;

                // Find Test firmware main test version
                for (let key in this.garfield.type_of_board.main_test_c_program.program_versions) {

                    if (!this.typeOfBoard.main_test_c_program.program_versions.hasOwnProperty(key)) {
                        continue;
                    }

                    if (this.typeOfBoard.main_test_c_program.program_versions[key].main_mark) {
                        this.firmwareTestMainVersion = this.typeOfBoard.main_test_c_program.program_versions[key];
                        break;
                    }
                }

                // Find Main Production firmware main version
                for (let key in this.garfield.type_of_board.main_c_program.program_versions) {

                    if (!this.typeOfBoard.main_c_program.program_versions.hasOwnProperty(key)) {
                        continue;
                    }

                    if (this.typeOfBoard.main_c_program.program_versions[key].main_mark) {
                        this.firmwareMainVersion = this.typeOfBoard.main_c_program.program_versions[key];
                        break;
                    }
                }

                if (this.firmwareTestMainVersion) {
                    this.backendService.cProgramVersionGetBinaryDownloadLink(this.firmwareTestMainVersion.version_id)
                        .then((link) => {
                            this.testFirmwareDownloadLink = link.file_link;
                        })
                        .catch((reason) => {
                            this.fmError(this.translate('flash_cant_load_bootloader_file', reason));
                        });
                }

                // Find Main and Backup Server
                this.backendService.homerServersGetList()
                    .then((IHomerServerPublicDetails) => {

                        for (let key in IHomerServerPublicDetails) {

                            if (!IHomerServerPublicDetails.hasOwnProperty(key)) {
                                continue;
                            }

                            if (IHomerServerPublicDetails[key].server_type === 'main_server') {
                                this.backendService.homerServerGet(IHomerServerPublicDetails[key].id)
                                    .then((server) => {
                                        this.mainServer = server;
                                    })
                                    .catch((reason) => {
                                        this.fmError(this.translate('flash_cant_load_homer_servers_main', reason));
                                        this.unblockUI();
                                    });
                            }

                            if (IHomerServerPublicDetails[key].server_type === 'backup_server') {
                                this.backendService.homerServerGet(IHomerServerPublicDetails[key].id)
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
                this.fmError( this.translate('flash_cant_load', reason));
                this.unblockUI();
            });

        // And after that every 15 seconds
        this.reloadInterval = setInterval(() => {
            this.reloadPrinters();
        }, 15000);
    }

    reloadPrinters(): void {
        if (this.garfield && this.garfield.print_sticker_id && this.garfield.print_label_id_1 && this.garfield.print_label_id_2) {

            Promise.all<any>([
                this.backendService.printerGetOnlineState(this.garfieldId, this.garfield.print_sticker_id),
                this.backendService.printerGetOnlineState(this.garfieldId, this.garfield.print_label_id_1),
                this.backendService.printerGetOnlineState(this.garfieldId, this.garfield.print_label_id_2)
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

    visible_steps(): boolean {

        return (
            this.garfield
            && this.typeOfBoard
            && this.firmwareTestMainVersion
            && this.bootLoader
            && this.firmwareMainVersion
            && this.printer_label_1
            && this.printer_label_2
            && this.print_sticker
            && this.garfieldTesterConnected
            && this.testFirmwareDownloadLink
            && this.mainServer
            && this.backupServer
            && this.productionBatchForm.valid);
    }

    onTestPrinter(printerId: number) {

        this.backendService.printerTestprinting(this.garfieldId , printerId)
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_test_print_success')));
            }).catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_fail', reason)));
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
            this.garfield.type_of_board.name
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.garfieldEdit(this.garfieldId , {
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
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail', reason)));
                        this.refresh();
                    });
            }
        });
    }

    onDeleteGarfield() {
        this.modalService.showModal(new ModalsRemovalModel(this.garfield.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.garfieldDelete(this.garfieldId)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.navigate(['admin/garfield/']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove', reason)));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onRegisterHardware(processorId: string) {

        this.backendService.boardCreateAutomaticGarfield({
            full_id: processorId,
            garfield_station_id: this.garfield.id,
            type_of_board_batch_id: this.productionBatchForm.controls['batch'].value,
            type_of_board_id: this.typeOfBoard.id
        })
            .then((result) => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_registration_device_successful')));
                this.backendService.boardGet(result.full_id)
                    .then((board) => {
                        this.device = board;
                        this.testHardwareConnected = true;
                        this.uploadBootLoader();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('label_cant_load_device', reason['message']));
                    });
            }).catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_fail', reason)));
                console.info(reason);
                this.refresh();
            });
    }

    onDisconnectGarfield() {
        this.fmWarning(this.translate('flash_garfield_disconnected'));
        this.garfieldAppConnected = false;
        this.garfieldTesterConnected = false;
        this.testHardwareConnected = false;
        clearTimeout(this.garfieldAppDetection);
        this.garfieldAppDetection = null;
    }

    onMessageGarfield(message: IWebSocketMessage) {
        switch (message.message_type) {
            case 'keepalive': {
                if (this.garfieldAppDetection) {
                    clearTimeout(this.garfieldAppDetection);
                    this.setDetection();
                }
                break;
            }
            case 'subscribe_garfield': {
                this.garfieldAppConnected = true;
                this.setDetection();
                this.fmInfo(this.translate('flash_garfield_connected'));
                break;
            }
            case 'unsubscribe_garfield': {
                this.onDisconnectGarfield();
                break;
            }
            case 'device_connect': {
                let msg: IWebSocketGarfieldDeviceConnect = <IWebSocketGarfieldDeviceConnect> message;
                if (msg.device_id) {
                    this.backendService.boardGet(msg.device_id)
                        .then((board) => {
                            this.device = board;
                            this.testHardwareConnected = true;
                            this.fmSuccess(this.translate('flash_device_connected'));
                            this.uploadBootLoader();
                        })
                        .catch((reason) => {

                            console.info(reason);

                            if (reason instanceof BugFoundError) {
                                let body = (<BugFoundError>reason).body;
                                if (body.code === 404) {
                                    this.onRegisterHardware(msg.device_id);
                                }
                            } else {
                                this.fmError(this.translate('label_cant_load_device', reason['message']));
                            }
                        });
                } else {
                    this.fmInfo(this.translate('flash_device_dead_connected'));
                    this.uploadBootLoader();
                }
                break;
            }
            case 'device_disconnect': {
                this.testHardwareConnected = false;
                this.fmWarning(this.translate('flash_device_disconnected'));
                break;
            }
            case 'tester_connect': {
                this.garfieldTesterConnected = true;
                this.fmInfo(this.translate('flash_tester_connected'));
                break;
            }
            case 'tester_disconnect': {
                this.fmWarning(this.translate('flash_tester_disconnected'));
                this.garfieldTesterConnected = false;
                break;
            }
            case 'device_binary': {
                let msg: IWebSocketGarfieldDeviceBinaryResult = <IWebSocketGarfieldDeviceBinaryResult> message;
                if (msg.status === 'success') {
                    if (msg.type === 'bootloader') {
                        if (this.testFirmwareDownloadLink) {
                            this.uploadFirmware();
                        } else {
                            this.configureDevice();
                        }
                    } else if (msg.type === 'firmware') {
                        this.configureDevice();
                    }
                } else {
                    this.fmError(this.translate('flash_device_binary_fail'));
                }
                break;
            }
            case 'device_configure': {
                let msg: IWebSocketGarfieldDeviceConfigureResult = <IWebSocketGarfieldDeviceConfigureResult> message;
                if (msg.status === 'success') {
                    this.fmSuccess(this.translate('flash_device_configure_success'));
                }
                break;
            }
        }
    }

    setDetection() {
        this.garfieldAppDetection = setTimeout(() => {
            let msg: IWebSocketMessage = {
                message_channel: BeckiBackend.WS_CHANNEL_GARFIELD,
                message_type: 'keepalive',
                message_id: this.backendService.uuid()
            };
            this.backendService.sendWebSocketMessage(msg);
            this.garfieldAppDetection = setTimeout(() => {
                this.onDisconnectGarfield();
            }, 10000);
        }, 10000);
    }

    onTestDevice() {
        let message: IWebSocketMessage = {
            message_channel: BeckiBackend.WS_CHANNEL_GARFIELD,
            message_type: 'device_test',
            message_id: this.backendService.uuid()
        };

        this.backendService.sendWebSocketMessage(message);
    }


    configureDevice() {
        let message: IWebSocketGarfieldDeviceConfigure = {
            message_channel: BeckiBackend.WS_CHANNEL_GARFIELD,
            message_type: 'device_configure',
            message_id: this.backendService.uuid(),
            configuration: {
                // mac: this.device.mac_address, // TODO
                normal_mqtt_hostname: this.mainServer.server_url,
                normal_mqtt_port: this.mainServer.mqtt_port,
                normal_mqtt_username: this.mainServer.mqtt_username,
                normal_mqtt_password: this.mainServer.mqtt_password,
                backup_mqtt_hostname: this.backupServer.server_url,
                backup_mqtt_port: this.backupServer.mqtt_port,
                backup_mqtt_username: this.backupServer.mqtt_username,
                backup_mqtt_password: this.backupServer.mqtt_password
            }
        };

        this.backendService.sendWebSocketMessage(message);
    }

    uploadBootLoader() {
        let message: IWebSocketGarfieldDeviceBinary = {
            message_channel: BeckiBackend.WS_CHANNEL_GARFIELD,
            message_type: 'device_binary',
            message_id: this.backendService.uuid(),
            url: this.bootLoader.file_path,
            type: 'bootloader'
        };

        this.backendService.sendWebSocketMessage(message);
    }

    uploadFirmware() {
        let message: IWebSocketGarfieldDeviceBinary = {
            message_channel: BeckiBackend.WS_CHANNEL_GARFIELD,
            message_type: 'device_binary',
            message_id: this.backendService.uuid(),
            url: this.testFirmwareDownloadLink,
            type: 'firmware'
        };

        this.backendService.sendWebSocketMessage(message);
    }

    // Testovací Tlačítka -----------------------------------------------------------------

    test_Garfield_Connected() {
        this.garfieldTesterConnected = true;
    }

    test_Garfield_disconnected() {
        this.garfieldTesterConnected = false;
    }


    add_one() {
        if (this.main_step > 11) {
            this.main_step = 0;
        }else {
            this.main_step = this.main_step + 1;
        }
    }

    change_error() {
        this.stepError = !this.stepError;
    }


}




