/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { TranslationService } from './../services/TranslationService';
import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { IHardware, IHardwareList, IHardwareType } from '../backend/TyrionAPI';


export class ModalsSelectHardwareModel extends ModalModel {
    constructor(public project_id: string, public hardware_type: IHardwareType, public selected_hardware: IHardware[] = []) {
        super();
    }
}

@Component({
    selector: 'bk-modals-select-hardware',
    templateUrl: './select-hardware.html'
})
export class ModalsSelectHardwareComponent implements OnInit {

    @Input()
    modalModel: ModalsSelectHardwareModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    devicesFilter: IHardwareList = null;

    constructor(private tyrionBackendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService) {

    }

    ngOnInit() {
        this.onFilterHardware();
    }

    onFilterHardware(pageNumber: number = 0 ): void {
        this.tyrionBackendService.boardsGetWithFilterParameters(pageNumber, {
            projects: [this.modalModel.project_id],
            hardware_type_ids: [this.modalModel.hardware_type.id]
        })
            .then((values) => {

                this.devicesFilter = values;
                this.devicesFilter.content.forEach((device, index, obj) => {
                    this.tyrionBackendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'Board' && device.id === status.model_id) {
                            device.online_state = status.online_state;
                        }
                    });
                });

            })
            .catch((reason) => {

            });
    }

    onAddToList(hardware: IHardware): void {
        for (let i = this.modalModel.selected_hardware.length - 1; i >= 0; i--) {
            if (this.modalModel.selected_hardware[i].id === hardware.id) {
                return;
            }
        }

        this.modalModel.selected_hardware.push(hardware);
    }

    onRemoveFromList(hardware: IHardware): void {
        for (let i = this.modalModel.selected_hardware.length - 1; i >= 0; i--) {
            if (this.modalModel.selected_hardware[i].id === hardware.id) {
                this.modalModel.selected_hardware.splice(i, 1);
            }
        }
    }


    onSubmitClick(): void {
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
