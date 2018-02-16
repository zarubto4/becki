/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import {
    IHardwareFilter, IHardwareList, IHardwareShortDetail, IProcessor, IProducer,
    IHardwareType
} from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsCreateProducerModel } from '../modals/create-producer';
import { ModalsCreateProcessorModel } from '../modals/create-processor';
import { ModalsCreateHardwareTypeModel } from '../modals/type-of-board-create';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsAdminCreateHardwareModel } from '../modals/admin-create-hardware';
import { ModalsDeviceEditDescriptionModel } from '../modals/device-edit-description';

@Component({
    selector: 'bk-view-admin-hardware-type',
    templateUrl: './admin-hardware-type.html'
})
export class AdminHardwareComponent extends BaseMainComponent implements OnInit {

    hardwareTypes: IHardwareType[] = null;
    processors: IProcessor[] = null;
    producers: IProducer[] = null;
    boardsFiler: IHardwareList = null;

    tab: string = 'hardware_list';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
        this.onFilterHardware();
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([this.tyrionBackendService.hardwareTypesGetAll(), this.tyrionBackendService.processorGetAll(), this.tyrionBackendService.producersGetAll()])
            .then((values: [IHardwareType[], IProcessor[], IProducer[]]) => {
                this.hardwareTypes = values[0];
                this.processors = values[1];
                this.producers = values[2];
                this.unblockUI();

            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }


    onCreateHardwareTypeClick(): void {
        let model = new ModalsCreateHardwareTypeModel(this.processors, this.producers);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.hardwareTypeCreate({
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
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onCreateProducerClick(): void {
        let model = new ModalsCreateProducerModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.producerCreate({
                    description: model.description,
                    name: model.name
                })
                    .then(() => {
                        this.refresh();
                    }).catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.unblockUI();
                        this.refresh();
                    });
            }
        });
    }

    onCreateProcessorClick(): void {
        let model = new ModalsCreateProcessorModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.processorCreate({
                    description: model.description,
                    processor_code: model.processor_code,
                    processor_name: model.processor_name,
                    speed: model.speed
                })
                    .then(() => {
                        this.refresh();
                    }).catch(reason => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onProcessorEditClick(processor: IProcessor): void {
        let model = new ModalsCreateProcessorModel(processor.description, processor.processor_code, processor.processor_name, processor.speed, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.processorEdit(processor.id, {
                    description: model.description,
                    processor_code: model.processor_code,
                    processor_name: model.processor_name,
                    speed: model.speed
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

    onProducerEditClick(producer: IProducer): void {
        let model = new ModalsCreateProducerModel(producer.description, producer.name, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.producerEdit(producer.id, {
                    description: model.description,
                    name: model.name
                })
                    .then(() => {
                        this.refresh();
                    }).catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                    });
            }
        });
    }

    onHardwareTypeEditClick(hardwareType: IHardwareType): void {
        let model = new ModalsCreateHardwareTypeModel(
            this.processors,
            this.producers,
            hardwareType.name,
            hardwareType.description,
            hardwareType.connectible_to_internet,
            hardwareType.compiler_target_name,
            hardwareType.processor_id,
            hardwareType.producer_id,
            true
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.hardwareTypeEdit(hardwareType.id, {
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
                        this.unblockUI();
                        this.refresh();
                    });
            }
        });
    }

    onHardwareTypeClick(boardTypeId: string): void {
        this.router.navigate(['/hardware', boardTypeId]);
    }

    onProducerClick(producer: string): void {
        this.router.navigate(['/producers', producer]);
    }

    onHardwareTypeDeleteClick(hardwareType: IHardwareType): void {
        this.modalService.showModal(new ModalsRemovalModel(hardwareType.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.hardwareTypeDelete(hardwareType.id)
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

    onProcessorDeleteClick(processor: IProcessor): void {
        this.modalService.showModal(new ModalsRemovalModel(processor.processor_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.processorDelete(processor.id)
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

    onProducerDeleteClick(producer: IProducer): void {
        this.modalService.showModal(new ModalsRemovalModel(producer.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.producerDelete(producer.id)
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

    onCreateHardwareClick(): void {
        let model = new ModalsAdminCreateHardwareModel(this.hardwareTypes);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.boardCreateManualRegistration({
                    full_id: model.processorId,
                    type_of_board_id: model.hardwareType
                })
                    .then(() => {
                        this.onFilterHardware();
                        this.unblockUI();
                    }).catch(reason => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                    });
            }
        });
    }

    selectedFilterPageHardware(event: { index: number}) {
        this.onFilterHardware(event.index);
    }

    onFilterHardware(pageNumber: number = 0, boardTypes: string[] = []): void {

        this.tyrionBackendService.boardsGetWithFilterParameters(pageNumber, {
            type_of_board_ids: boardTypes
        })
            .then((values) => {
                this.boardsFiler = values;

                this.unblockUI();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onDeviceClick(device: IHardwareShortDetail): void {
        this.navigate(['/device', device.id]);
    }

    onRemoveHardwareClick(board: IHardwareShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(board.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.boardDeactivate(board.id)
                    .then(() => {
                        this.refresh();
                        this.unblockUI();
                    }).catch(reason => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                    });
            }
        });
    }

    onEditHardwareClick(device: IHardwareShortDetail): void {
        let model = new ModalsDeviceEditDescriptionModel(device.id, device.name, device.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.boardEditPersonalDescription(device.id, { name: model.name, description: model.description })
                    .then(() => {
                        this.refresh();
                        this.unblockUI();
                    })
                    .catch(reason => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_edit_device_fail'), reason));
                    });
            }
        });
    }


    onHardwareSynchronize(): void {
        this.blockUI();
        this.tyrionBackendService.boardSynchronizeAllWithCentralRegistrationAuthority()
            .then(() => {
                this.unblockUI();
                this.onFilterHardware(0);
            })
            .catch(reason => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(this.translate('flash_edit_device_fail'), reason));

            });
    }

    onPrintLabelHardwareClick(device: IHardwareShortDetail): void {
        this.blockUI();
        this.tyrionBackendService.boardPrintlabel(device.id)
            .then(() => {
                this.unblockUI();
            })
            .catch(reason => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(this.translate('flash_edit_device_fail'), reason));
            });
    }


}




