/**
 * Created by davidhradek on 05.12.16.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { ICompilationServer, IHomerServer, IProcessor, IProducer, ITypeOfBoard } from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsCreateCompilerServerModel } from '../modals/compiler-server-create';
import { ModalsCreateHomerServerModel } from '../modals/homer-server-create';
import { ModalsCreateProducerModel } from '../modals/create-producer';
import { ModalsCreateProcessorModel } from '../modals/create-processor';
import { ModalsCreateTypeOfBoardModel } from '../modals/type-of-board-create';
import {ModalsRemovalModel} from "../modals/removal";

@Component({
    selector: 'bk-view-admin-hardware-type',
    templateUrl: './admin-hardware-type.html'
})
export class AdminHardwareComponent extends BaseMainComponent implements OnInit {

    typeOfBoards: ITypeOfBoard[] = null;
    processors: IProcessor[] = null;
    producers: IProducer[] = null;

    tab: string = 'hardware_type';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([this.backendService.typeOfBoardsGetAll(), this.backendService.processorGetAll(), this.backendService.producersGetAll()])
            .then((values: [ITypeOfBoard[], IProcessor[], IProducer[]]) => {
                this.typeOfBoards = values[0];
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

    onCreateTypeOfBoardClick(): void {
        let model = new ModalsCreateTypeOfBoardModel(this.processors, this.producers);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBoardCreate({
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
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail', reason)));
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
                this.backendService.producerCreate({
                    description: model.description,
                    name: model.name
                })
                    .then(() => {
                        this.refresh();
                    }).catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail', reason)));
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
                this.backendService.processorCreate({
                    description: model.description,
                    processor_code: model.processor_code,
                    processor_name: model.processor_name,
                    speed: model.speed
                })
                    .then(() => {
                        this.refresh();
                    }).catch(reason => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail', reason)));
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
                this.backendService.processorEdit( processor.id, {
                    description: model.description,
                    processor_code: model.processor_code,
                    processor_name: model.processor_name,
                    speed: model.speed
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

    onProducerEditClick(producer: IProducer): void {
        let model = new ModalsCreateProducerModel(producer.description, producer.name, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.producerEdit( producer.id, {
                    description: model.description,
                    name: model.name
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

    onTypeOfBoardEditClick(typeOfBoard: ITypeOfBoard): void {
        let model = new ModalsCreateTypeOfBoardModel(
            this.processors,
            this.producers,
            typeOfBoard.name,
            typeOfBoard.description,
            typeOfBoard.connectible_to_internet,
            typeOfBoard.compiler_target_name,
            typeOfBoard.processor_id,
            typeOfBoard.producer_id,
            true
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBoardEdit( typeOfBoard.id, {
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
                        this.unblockUI();
                        this.refresh();
                    });
            }
        });
    }

    onTypeOfBoardClick(boardTypeId: string): void {
        this.router.navigate(['/hardware', boardTypeId]);
    }

    onTypeOfBoardDeleteClick(typeOfBoard: ITypeOfBoard): void {
        this.modalService.showModal(new ModalsRemovalModel(typeOfBoard.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBoardDelete(typeOfBoard.id)
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


    onProcessorDeleteClick(processor: IProcessor): void {
        this.modalService.showModal(new ModalsRemovalModel(processor.processor_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.processorDelete(processor.id)
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


    onProducerDeleteClick(producer: IProducer): void {
        this.modalService.showModal(new ModalsRemovalModel(producer.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.producerDelete(producer.id)
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




