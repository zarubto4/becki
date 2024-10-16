/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IHardwareList, IProcessor, IProducer, IHardwareType, IHardware } from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsCreateProducerModel } from '../modals/create-producer';
import { ModalsCreateProcessorModel } from '../modals/create-processor';
import { ModalsCreateHardwareTypeModel } from '../modals/type-of-board-create';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsAdminCreateHardwareModel } from '../modals/admin-create-hardware';
import { ModalsDeviceEditDescriptionModel } from '../modals/device-edit-description';
import { ModalsHardwareFindHash } from '../modals/hardware-find-hash';
import { FormGroup, Validators } from '@angular/forms';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-admin-hardware-type',
    templateUrl: './admin-hardware-type.html'
})
export class AdminHardwareComponent extends _BaseMainComponent implements OnInit {

    hardwareTypes: IHardwareType[] = null;
    processors: IProcessor[] = null;
    producers: IProducer[] = null;
    devicesFilter: IHardwareList = null;

    tab: string = 'hardware_list';

    formFilterGroup: FormGroup;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();

        this.formFilterGroup = this.formBuilder.group({
            'alias': ['', [Validators.maxLength(60)]],
            'id': ['', [Validators.maxLength(60)], [BeckiAsyncValidators.validUUID()]],
            'full_id': ['', [Validators.maxLength(60)]],
            'description': ['', [Validators.maxLength(60)]],
            'orderBy': ['NAME', []],
            'order_schema': ['ASC', []],
        });

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
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onPortletClick(action: string): void {
        if (action === 'add_hardware') {
            this.onCreateHardwareClick();
        }

        if (action === 'register_new_hardware') {
            this.onGarfieldListClick();
        }
        if (action === 'find_hardware_hash') {
            this.onGetHardwareHash();
        }

        if (action === 'new_hardware_type') {
            this.onCreateHardwareTypeClick();
        }

        if (action === 'add_producer') {
            this.onCreateProducerClick();
        }

        if (action === 'add_processor') {
            this.onCreateProcessorClick();
        }
    }

    // Hardware Type Operations  ---------------------------------------------------------------------------------------

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
                    .then(hardwareType => {
                        this.onHardwareTypeClick(hardwareType.id);
                    }).catch((reason: IError) => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.refresh();
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
            hardwareType.processor.id,
            hardwareType.producer.id,
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
                    }).catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.unblockUI();
                        this.refresh();
                    });
            }
        });
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
                    .catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    // Procesor Operations  --------------------------------------------------------------------------------------------

    onCreateProcessorClick(): void {
        let model = new ModalsCreateProcessorModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.processorCreate({
                    description: model.description,
                    processor_code: model.processor_code,
                    name: model.name,
                    speed: model.speed
                })
                    .then(() => {
                        this.refresh();
                    }).catch((reason: IError) => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onProcessorEditClick(processor: IProcessor): void {
        let model = new ModalsCreateProcessorModel(processor.description, processor.processor_code, processor.name, processor.speed, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.processorEdit(processor.id, {
                    description: model.description,
                    processor_code: model.processor_code,
                    name: model.name,
                    speed: model.speed
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

    onProcessorDeleteClick(processor: IProcessor): void {
        this.modalService.showModal(new ModalsRemovalModel(processor.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.processorDelete(processor.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.refresh(); // also unblockUI
                    })
                    .catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    // Producer Operations  --------------------------------------------------------------------------------------------

    onCreateProducerClick(): void {
        let model = new ModalsCreateProducerModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.producerCreate({
                    description: model.description,
                    name: model.name
                })
                    .then(producer => {
                        this.onProducerClick(producer.id);
                    }).catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.unblockUI();
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
                    }).catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
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
                    .catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    // Hardware Operations  --------------------------------------------------------------------------------------------

    onCreateHardwareClick(): void {
        let model = new ModalsAdminCreateHardwareModel(this.hardwareTypes);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.hardwareCreateManual({
                    full_id: model.processorId,
                    hardware_type_id: model.hardwareTypeId
                })
                    .then(() => {
                        this.onFilterHardware();
                        this.unblockUI();
                    }).catch((reason: IError) => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                    });
            }
        });
    }

    onRemoveHardwareClick(board: IHardware): void {
        this.modalService.showModal(new ModalsRemovalModel(board.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.boardDeactivate(board.id)
                    .then(() => {
                        this.refresh();
                        this.unblockUI();
                    }).catch((reason: IError) => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                    });
            }
        });
    }

    onEditHardwareClick(device: IHardware): void {
        let model = new ModalsDeviceEditDescriptionModel(null, device);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.boardEditPersonalDescription(device.id, {
                    name: model.hardware.name,
                    description: model.hardware.description,
                    tags: model.hardware.tags
                })
                    .then(() => {
                        this.refresh();
                        this.unblockUI();
                    })
                    .catch((reason: IError) => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_edit_device_fail'), reason));
                    });
            }
        });
    }

    onPrintLabelHardwareClick(device: IHardware): void {
        this.blockUI();
        this.tyrionBackendService.boardPrintlabel(device.id)
            .then(() => {
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(this.translate('flash_edit_device_fail'), reason));
            });
    }

    // Hardware Hash ----------------------------------------------------------------------------------------------------

    onGetHardwareHash(): void {
        let model = new ModalsHardwareFindHash();
        this.modalService.showModal(model).then((success) => {});
    }

    // Hardware Filter --------------------------------------------------------------------------------------------------

    onFilterHardware(pageNumber: number = 0): void {

        if (!this.formFilterGroup.valid && this.formFilterGroup.dirty) {
            return;
        }

        this.blockUI();
        this.tyrionBackendService.boardsGetListByFilter(pageNumber, {
            hardware_type_ids: [],
            order_by: this.formFilterGroup.controls['orderBy'].value,
            order_schema: this.formFilterGroup.controls['order_schema'].value,
            full_id: this.formFilterGroup.controls['full_id'].value,
            id: this.formFilterGroup.controls['id'].value,
            name: this.formFilterGroup.controls['alias'].value,
            description: this.formFilterGroup.controls['description'].value
        })
            .then((values) => {
                this.unblockUI();
                this.devicesFilter = values;

                this.devicesFilter.content.forEach((device, index, obj) => {
                    this.tyrionBackendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'Hardware' && device.id === status.model_id) {
                            device.online_state = status.online_state;
                        }
                    });
                });
            })
            .catch((reason: IError) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onDrobDownEmiter(action: string, object: any): void {
        if (action === 'print_device') {
            this.onPrintLabelHardwareClick(object);
        }

        if (action === 'edit_device') {
            this.onEditHardwareClick(object);
        }
        if (action === 'remove_device') {
            this.onRemoveHardwareClick(object);
        }

        if (action === 'edit_hardwareType') {
            this.onHardwareTypeEditClick(object);
        }

        if (action === 'remove_hardwareType') {
            this.onHardwareTypeDeleteClick(object);
        }

        if (action === 'edit_producer') {
            this.onProducerEditClick(object);
        }
        if (action === 'remove_producer') {
            this.onProducerDeleteClick(object);
        }

        if (action === 'edit_pprocessor') {
            this.onProducerEditClick(object);
        }
        if (action === 'remove_processor') {
            this.onProducerDeleteClick(object);
        }
    }

}




