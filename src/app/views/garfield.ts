/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IGarfield, IProducer, ITypeOfBoard } from '../backend/TyrionAPI';
import { ModalsRemovalModel } from '../modals/removal';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsGarfieldModel } from '../modals/garfield';

@Component({
    selector: 'bk-view-garfield',
    templateUrl: './garfield.html'
})
export class GarfieldComponent extends BaseMainComponent implements OnInit {

    garfield_s: IGarfield[] = null;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.blockUI();
        this.backendService.garfieldGetList()
            .then((garfield_s) => {
                this.garfield_s = garfield_s;
                this.unblockUI();
            })
            .catch((reason) => {
                this.fmError(this.translate('flash_cant_load', reason));
                this.unblockUI();
            });
    }

    onCreateGarfield() {
        this.blockUI();
        Promise.all<any>([this.backendService.producersGetAll(), this.backendService.typeOfBoardsGetAll()])
            .then((values: [IProducer[], ITypeOfBoard[]]) => {
                let model = new ModalsGarfieldModel(
                    values[0],
                    values[1],
                );
                this.modalService.showModal(model).then((success) => {
                    if (success) {
                        this.blockUI();
                        this.backendService.garfieldCreate({
                            description: model.description,
                            name: model.name,
                            print_label_id_1: model.print_label_id_1,
                            print_label_id_2: model.print_label_id_2,
                            print_sticker_id: model.print_sticker_id,
                            hardware_tester_id: model.hardware_tester_id,
                            producer_id: model.producer,
                            type_of_board_id: model.typeOfBoard,
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

    onEditGarfield(garfield: IGarfield) {
        let model = new ModalsGarfieldModel(
            null,
            null,
            garfield.name,
            garfield.description,
            garfield.print_label_id_1,
            garfield.print_label_id_2,
            garfield.print_sticker_id,
            garfield.hardware_tester_id,
            true,
            garfield.producer.name,
            garfield.type_of_board.name
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.garfieldEdit(garfield.id, {
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

    onDeleteGarfield(garfield: IGarfield) {
        this.modalService.showModal(new ModalsRemovalModel(garfield.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.garfieldDelete(garfield.id)
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

    onGarfieldClick(garfield: IGarfield) {
        this.navigate(['/admin/garfield', garfield.id]);
    }

    onProducerClick(producer: IProducer) {
        this.navigate(['/producers', producer.id]);
    }

    onTypeOfBoardClick(typeOfBoard: ITypeOfBoard) {
        this.navigate(['/hardware', typeOfBoard.id]);
    }

}




