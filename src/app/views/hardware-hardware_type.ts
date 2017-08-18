/**
 * Created by davidhradek on 05.12.16.
 */

import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import {
    IBootLoader, ICProgram, ICProgramVersionShortDetail, IProcessor, IProducer,
    ITypeOfBoard
} from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { ModalsRemovalModel } from '../modals/removal';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsSetAsMainComponent, ModalsSetAsMainModel } from '../modals/set-as-main';
import { ModalsCreateTypeOfBoardModel } from '../modals/create-type-of-board';
import { ModalsBootloaderPropertyModel } from '../modals/bootloader-property';
import { ModalsCodePropertiesModel } from '../modals/code-properties';

@Component({
    selector: 'bk-view-hardware-hardware-type',
    templateUrl: './hardware-hardware_type.html'
})
export class HardwareHardwareTypeComponent extends BaseMainComponent implements OnInit, OnDestroy {

    typeOfBoard: ITypeOfBoard = null;

    hardwareTypeId: string;
    routeParamsSubscription: Subscription;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.hardwareTypeId = params['hardware_type'];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {
        this.blockUI();
        this.backendService.typeOfBoardGet(this.hardwareTypeId)
            .then((typeOfBoard) => {
                this.typeOfBoard = typeOfBoard;
                // console.log(typeOfBoard);
                this.unblockUI();
            })
            .catch((reason) => {
                this.fmError(this.translate('flash_project_cant_load', reason));
                this.unblockUI();
            });
    }

    onEditClick() {
        this.blockUI();
        Promise.all<any>([this.backendService.processorGetAll(), this.backendService.producersGetAll()])
            .then((values: [IProcessor[], IProducer[]]) => {
                let model = new ModalsCreateTypeOfBoardModel(
                    values[0],
                    values[1],
                    this.typeOfBoard.name,
                    this.typeOfBoard.description,
                    this.typeOfBoard.connectible_to_internet,
                    this.typeOfBoard.compiler_target_name,
                    this.typeOfBoard.processor_id,
                    this.typeOfBoard.producer_id,
                    true
                );
                this.modalService.showModal(model).then((success) => {
                    if (success) {
                        this.blockUI();
                        this.backendService.typeOfBoardEdit( this.typeOfBoard.id, {
                            description: model.description,
                            name: model.name,
                            compiler_target_name: model.compiler_target_name,
                            connectible_to_internet: model.connectible_to_internet,
                            processor_id: model.processor,
                            producer_id: model.producer,
                        })
                            .then(() => {
                                this.refresh();
                            }).catch(reason => {
                                this.addFlashMessage(new FlashMessageError(this.translate('flash_fail', reason)));
                                this.refresh();
                            });
                    }
                });
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onRemoveClick() {
        this.modalService.showModal(new ModalsRemovalModel(this.typeOfBoard.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBoardDelete(this.typeOfBoard.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove', reason)));
                        this.router.navigate(['/admin/hardware']);
                    });
            }
        });
    }

    onCreateBootloaderClick() {
        let model = new ModalsBootloaderPropertyModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.bootloaderCreate(this.typeOfBoard.id, {
                    description: model.description,
                    name: model.name,
                    changing_note: model.changing_note,
                    version_identificator: model.version_identificator
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

    onBootloaderEditClick(bootloader: IBootLoader) {
        let model = new ModalsBootloaderPropertyModel(
            bootloader.description,
            bootloader.name,
            bootloader.changing_note,
            bootloader.version_identificator
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.bootloaderEdit(bootloader.id, {
                    description: model.description,
                    name: model.name,
                    changing_note: model.changing_note,
                    version_identificator: model.version_identificator
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

    onCProgramEditClick(code: ICProgram) {
        let model = new ModalsCodePropertiesModel(null, code.name, code.description, '', true, code.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.cProgramEdit(code.id, {
                    name: model.name,
                    description: model.description,
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code', reason)));
                        this.refresh();
                    });
            }
        });
    }

    onTypeOfBoardUpdatePicture() {

    }

    onBootloaderUpdateFile(bootloader: IBootLoader) {

    }

    onCProgramDefaultSetMainClick(version: ICProgramVersionShortDetail) {
        this.modalService.showModal(new ModalsSetAsMainModel(this.translate('label_default_c_program_setting'), version.version_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeofboardSetcprogramversion_as_main(version.version_id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove', reason)));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onBootloaderSetMainClick(bootloader: IBootLoader) {
        this.modalService.showModal(new ModalsSetAsMainModel(this.translate('label_bootloader'), bootloader.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.bootloaderEditSetAsMain(bootloader.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove', reason)));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onBootloaderDeleteClick(bootloader: IBootLoader) {
        this.modalService.showModal(new ModalsRemovalModel(bootloader.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.bootloaderDelete(bootloader.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove', reason)));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }
}




