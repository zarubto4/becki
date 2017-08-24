/**
 * Created by davidhradek on 05.12.16.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import {
    IBootLoader, ICProgramVersionShortDetail, IGarfield, IPrinter, IProducer,
    ITypeOfBoard
} from '../backend/TyrionAPI';
import { ModalsRemovalModel } from '../modals/removal';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsGarfieldModel } from '../modals/garfield';
import { Subscription } from 'rxjs';

@Component({
    selector: 'bk-view-garfield-garfield',
    templateUrl: './garfield-garfield.html'
})
export class GarfieldGarfieldComponent extends BaseMainComponent implements OnInit {

    garfield: IGarfield = null;
    garfieldId: string;
    typeOfBoard: ITypeOfBoard = null;

    firmwareTestMainVersion: ICProgramVersionShortDetail = null;    // Main Test Firmware
    firmwareMainVersion: ICProgramVersionShortDetail = null;        // Main Production Firmware
    bootLoader: IBootLoader = null;

    bootloader_file_Base64: string = null;     // Main & Test bootloader File
    test_firmware_file_Base64: string = null;  // Main Production Firmware

    printer_label_1: IPrinter = null; // Printer
    printer_label_2: IPrinter = null; // Printer
    print_sticker: IPrinter = null;   // Printer

    garfieldHardwareConnected: boolean = false; // Flag Register for initialization of connection (garfield Kit)
    testHardwareConnected: boolean = false; // Flag Register for initialization of connection (Device for testing)

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
    }

    refresh(): void {
        this.blockUI();
        this.backendService.garfieldGet(this.garfieldId)
            .then((garfield) => {
                this.garfield = garfield;

                this.typeOfBoard = garfield.type_of_board;
                this.bootLoader = garfield.type_of_board.main_boot_loader;

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
                            this.unblockUI();
                        });
                }

                if (this.firmwareTestMainVersion) {
                    this.backendService.cProgramVersionGetFileRecord(this.firmwareTestMainVersion.version_id)
                        .then((file) => {
                            this.test_firmware_file_Base64 = file.file_in_base64;
                        })
                        .catch((reason) => {
                            this.fmError(this.translate('flash_cant_load_bootloader_file', reason));
                            this.unblockUI();
                        });
                }

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




