/**
 * Created by davidhradek on 05.12.16.
 */

import { Component, Injector, OnInit } from '@angular/core';
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
import { BeckiBackend, IWebSocketGarfieldDeviceConnect, IWebSocketGarfieldDeviceConfigure, IWebSocketMessage} from '../backend/BeckiBackend';

@Component({
    selector: 'bk-view-garfield-garfield',
    templateUrl: './garfield-garfield.html'
})
export class GarfieldGarfieldComponent extends BaseMainComponent implements OnInit {

    garfield: IGarfield = null;
    garfieldId: string;
    typeOfBoard: ITypeOfBoard = null;
    device: IBoard = null;

    firmwareTestMainVersion: ICProgramVersionShortDetail = null;    // Main Test Firmware
    firmwareMainVersion: ICProgramVersionShortDetail = null;        // Main Production Firmware
    bootLoader: IBootLoader = null;
    mainServer: IHomerServer = null;           // Destination for Server registration
    backupServer: IHomerServer = null;         // Destination for Server registration (backup)

    bootloader_file_Base64: string = null;     // Main & Test bootloader File
    test_firmware_file_Base64: string = null;  // Main Production Firmware

    productionBatchForm: FormGroup; // Burn Info Batch Form TypeOfBoard.batch
    batchOptions: FormSelectComponentOption[] = null;
    batch: string = null;

    personName: string = null; // Who testing

    printer_label_1: IPrinter = null; // Printer
    printer_label_2: IPrinter = null; // Printer
    print_sticker: IPrinter = null;   // Printer

    garfieldHardwareConnected: boolean = false; // Flag Register for initialization of connection (garfield Kit)
    testHardwareConnected: boolean = false; // Flag Register for initialization of connection (Device for testing)

    formConfigJson: FormGroup;

    // For checking online state on printers
    reloadInterval: any = null;

    main_step: number = 0;
    stepError: boolean = false; // Made Step to Red

    routeParamsSubscription: Subscription;

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

        this.backendService.garfieldWebsocketRecived.subscribe(msg => this.onMessageGarfield(msg));
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

                if (this.bootLoader) {
                    this.backendService.bootloaderGetFileRecord(this.bootLoader.id)
                        .then((file) => {
                            this.bootloader_file_Base64 = file.file_in_base64;
                        })
                        .catch((reason) => {
                            this.fmError(this.translate('flash_cant_load_bootloader_file', reason));
                        });
                }

                if (this.firmwareTestMainVersion) {
                    this.backendService.cProgramVersionGetFileRecord(this.firmwareTestMainVersion.version_id)
                        .then((file) => {
                            this.test_firmware_file_Base64 = file.file_in_base64;
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
        //this.reloadInterval = setInterval(() => {
        //    this.reloadPrinters();
        //}, 15000);
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
            && this.garfieldHardwareConnected
            && this.test_firmware_file_Base64
            && this.bootloader_file_Base64
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

    onRegisterHardware(processorId: string = '123456789123456789123456') {

        this.backendService.boardCreateAutomaticGarfield({
            full_id: processorId,
            garfield_station_id: this.garfield.id,
            type_of_board_batch_id: this.productionBatchForm.controls['batch'].value,
            type_of_board_id: this.typeOfBoard.id
        })
            .then((result) => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_registration_device_succesfull')));
            }).catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_fail', reason)));
                this.refresh();
            });
    }

    onMessageGarfield(message: IWebSocketMessage) {
        switch (message.message_type) {
            case 'device_connect': {
                this.backendService.boardGet((<IWebSocketGarfieldDeviceConnect> message).device_id)
                    .then((board) => {
                        this.device = board;
                        this.garfieldHardwareConnected = true;
                        this.fmSuccess('Device detected.');
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('label_cant_load_device'));
                    });
                break;
            }
        }
    }

    onTestDevice() {
        let message: IWebSocketMessage = {
            message_channel: BeckiBackend.WS_CHANNEL_GARFIELD,
            message_type: 'device_test',
            message_id: this.backendService.uuid()
        };

        this.backendService.sendWebSocketMessage(message);
    }


    onConfigureDevice() {
        let message: IWebSocketGarfieldDeviceConfigure = {
            message_channel: BeckiBackend.WS_CHANNEL_GARFIELD,
            message_type: 'device_configure',
            message_id: this.backendService.uuid(),
            config: { // TODO real config
                normal_mqtt_host: 'dummy',
                normal_mqtt_port: '0000'
            }
        };

        this.backendService.sendWebSocketMessage(message);
    }

    // Testovací Tlačítka -----------------------------------------------------------------

    test_Garfield_Connected() {
        this.garfieldHardwareConnected = true;
    }

    test_Garfield_disconnected() {
        this.garfieldHardwareConnected = false;
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




