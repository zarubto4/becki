/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import {
    IBootLoader, ICProgram, ICProgramVersionShortDetail, IProcessor, IProducer,
    ITypeOfBoard, ITypeOfBoardBatch
} from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { ModalsRemovalModel } from '../modals/removal';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsSetAsMainModel } from '../modals/set-as-main';
import { ModalsCreateTypeOfBoardModel } from '../modals/type-of-board-create';
import { ModalsBootloaderPropertyModel } from '../modals/bootloader-property';
import { ModalsCodePropertiesModel } from '../modals/code-properties';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import { ModalsPictureUploadModel } from '../modals/picture-upload';
import { ModalsFileUploadModel } from '../modals/file-upload';
import { ModalsCreateTypeOfBoardBatchModel } from '../modals/type-of-board-batch-create';

@Component({
    selector: 'bk-view-hardware-hardware-type',
    templateUrl: './hardware-hardware_type.html'
})
export class HardwareHardwareTypeComponent extends BaseMainComponent implements OnInit, OnDestroy {

    typeOfBoard: ITypeOfBoard = null;

    hardwareTypeId: string;
    routeParamsSubscription: Subscription;

    savedPicture: boolean = false;

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
                        this.backendService.typeOfBoardEdit(this.typeOfBoard.id, {
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
                                this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
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
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
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
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
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
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
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
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onRemoveVersionClick(version: ICProgramVersionShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(version.version_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.cProgramVersionDelete(version.version_id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_version_remove')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code_version'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onEditVersionClick(version: ICProgramVersionShortDetail): void {
        let model = new ModalsVersionDialogModel(version.version_name, version.version_description, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.cProgramVersionEditInformation(version.version_id, { // TODO [permission]: version.update_permission
                    version_name: model.name,
                    version_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_version_change', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_code_version', model.name, reason)));
                        this.refresh();
                    });
            }
        });
    }

    updatePictureClick(): void {
        let model = new ModalsPictureUploadModel(null, this.typeOfBoard.picture_link, false);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBoardUploadPicture(this.typeOfBoard.id, { // TODO [permission]: version.update_permission
                    file: model.file
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_file_uploaded')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_code_version'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onBootloaderUpdateFile(bootloader: IBootLoader) {
        let model = new ModalsFileUploadModel('Bootloader', this.translate('label_bootloader_comment'), ['.bin', '.png']);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.bootloaderUploadFile(bootloader.id, { // TODO [permission]: version.update_permission
                    file: model.file
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_file_uploaded')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_file_upload'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onCProgramDefaultSetMainClick(version: ICProgramVersionShortDetail) {
        this.modalService.showModal(new ModalsSetAsMainModel(this.translate('label_default_c_program_setting'), version.version_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeofboardSetcprogramversion_as_main(version.version_id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_set_as_default')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
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
                        this.fmSuccess(this.translate('flash_successfully_set_main'));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.fmError(this.translate('flash_cant_set_main'), reason);
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
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onCreateRevisionClick() {
        let model = new ModalsCreateTypeOfBoardBatchModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBoardBatchCreate(this.typeOfBoard.id, {
                    revision: model.revision,
                    production_batch: model.production_batch,
                    pcb_manufacture_name: model.pcb_manufacture_name,
                    pcb_manufacture_id: model.pcb_manufacture_id,
                    assembly_manufacture_name: model.assembly_manufacture_name,
                    assembly_manufacture_id: model.assembly_manufacture_id,
                    mac_address_start: model.mac_address_start,
                    mac_address_end: model.mac_address_end,
                    ean_number: model.ean_number,
                    date_of_assembly: model.date_of_assembly,
                    customer_product_name: model.customer_product_name,
                    customer_company_name: model.customer_company_name,
                    customer_company_made_description: model.customer_company_made_description,
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

    onEditRevisionClick(batch: ITypeOfBoardBatch) {
        let model = new ModalsCreateTypeOfBoardBatchModel(
            true,
            batch.revision,
            batch.production_batch,
            batch.pcb_manufacture_name,
            batch.pcb_manufacture_id,
            batch.assembly_manufacture_name,
            batch.assembly_manufacture_id,
            batch.mac_address_start,
            batch.mac_address_end,
            batch.ean_number,
            batch.date_of_assembly,
            batch.customer_product_name,
            batch.customer_company_name,
            batch.customer_company_made_description,
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBoardBatchEdit(batch.id, {
                    revision: model.revision,
                    production_batch: model.production_batch,
                    pcb_manufacture_name: model.pcb_manufacture_name,
                    pcb_manufacture_id: model.pcb_manufacture_id,
                    assembly_manufacture_name: model.assembly_manufacture_name,
                    assembly_manufacture_id: model.assembly_manufacture_id,
                    mac_address_start: model.mac_address_start,
                    mac_address_end: model.mac_address_end,
                    ean_number: model.ean_number,
                    date_of_assembly: model.date_of_assembly,
                    customer_product_name: model.customer_product_name,
                    customer_company_name: model.customer_company_name,
                    customer_company_made_description: model.customer_company_made_description,
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

    onDeleteRevisionClick(batch: ITypeOfBoardBatch) {
        this.modalService.showModal(new ModalsRemovalModel(batch.revision + ' ' + batch.production_batch)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBoardBatchDelete(batch.id)
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

}




