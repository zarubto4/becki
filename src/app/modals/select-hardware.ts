/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { TranslationService } from '../services/TranslationService';
import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import {
    IHardware, IHardwareGroup, IHardwareGroupList, IHardwareList, IHardwareType,
    IShortReference
} from '../backend/TyrionAPI';
import { FlashMessageError, NotificationService } from '../services/NotificationService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IError } from '../services/_backend_class/Responses';


export class ModalsSelectHardwareModel extends ModalModel {
    public selected_hardware: IHardware[] = [];
    public selected_hardware_groups: IHardwareGroup[] = [];
    constructor(
        public project_id: string,
        public hardware_type: IHardwareType = null,
        public multiple_select_support: boolean = true,
        public support_select_hw_groups = false,
        public support_select_hw = false,
        public preselected_groups: IShortReference[] = [],   // already selected hw groups
        public hw_group: IHardwareGroup = null               // for add HW to group and show what is in group
    ) {
        super();
        this.modalLarge = true;
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

    errorMessage: string = null;

    tab: string = '';

    devicesFilter: IHardwareList = null;
    groupFilter: IHardwareGroupList = null;
    selectedHardwareList: { [id: string]: IHardware } = {};
    selectedGroupList: { [id: string]: IHardwareGroup } = {};


    formHardwareFilter: FormGroup;

    constructor(private tyrionBackendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService, private notificationService: NotificationService) {
        this.formHardwareFilter = this.formBuilder.group({
            'alias': ['', [Validators.maxLength(60)]],
            'id': ['', [Validators.maxLength(60)], [BeckiAsyncValidators.validUUID()]],
            'full_id': ['', [Validators.maxLength(60)]],
            'description': ['', [Validators.maxLength(60)]],
            'orderBy': ['NAME', []],
            'order_schema': ['ASC', []],
        });
    }

    ngOnInit() {

        if (this.modalModel.support_select_hw) {
            this.tab = 'hardware';
            setTimeout(() => {
                this.onFilterHardware();
            }, 100);
        } else if  (this.modalModel.support_select_hw_groups) {
            this.tab = 'group';
            setTimeout(() => {
                this.onFilterHardwareGroup();
            }, 100);
        }

    }

    // TOGGLE TAB & PORTLET BUTTONS
    onToggleTab(tab: string) {
        this.tab = tab;

        if (this.tab === 'group' && this.groupFilter === null ) {
            this.onFilterHardwareGroup();
        }
    }

    onFilterHardware(pageNumber: number = 0 ): void {

        if (!this.formHardwareFilter.valid && this.formHardwareFilter.dirty) {
            return;
        }

        this.tyrionBackendService.boardsGetListByFilter(pageNumber, {
            projects: [this.modalModel.project_id],
            hardware_type_ids: [ (this.modalModel.hardware_type != null) ? this.modalModel.hardware_type.id : null],
            count_on_page: 10,
            order_by: this.formHardwareFilter.controls['orderBy'].value,
            order_schema: this.formHardwareFilter.controls['order_schema'].value,
            full_id: this.formHardwareFilter.controls['full_id'].value,
            id: this.formHardwareFilter.controls['id'].value,
            name: this.formHardwareFilter.controls['alias'].value,
            description: this.formHardwareFilter.controls['description'].value
        })
            .then((values) => {
                this.devicesFilter = values;
                this.devicesFilter.content.forEach((device, index, obj) => {
                    this.tyrionBackendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'Hardware' && device.id === status.model_id) {
                            device.online_state = status.online_state;
                        }
                    });
                });

                if (this.modalModel.hw_group) {
                    this.devicesFilter.content.forEach((device, index, obj) => {

                        let group: IShortReference = device.hardware_groups.find((g) => {
                            return g.id === this.modalModel.hw_group.id;
                        });

                        if (group) {
                            this.selectedHardwareList[device.id] = device;
                        }
                    });
                }
            })
            .catch((reason: IError) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                this.errorMessage = reason.message;
            });
    }

    onFilterHardwareGroup(pageNumber: number = 0): void {
        this.tyrionBackendService.hardwareGroupGetListByFilter(pageNumber, {
            project_id : this.modalModel.project_id,
            count_on_page: 10
        })
            .then((values) => {
                this.groupFilter = values;

                if (this.modalModel.preselected_groups) {

                    this.modalModel.preselected_groups.forEach((k, index, obj) => {

                        let group: IHardwareGroup = this.groupFilter.content.find((g) => {
                            return g.id === k.id;
                        });

                        if (group) {
                            this.selectedGroupList[group.id] = group;
                        }
                    });

                }
            })
            .catch((reason: IError) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                this.errorMessage = reason.message;
            });
    }

    onHardwareAddToList(hardware: IHardware): void {
        this.selectedHardwareList[hardware.id] = hardware;
        if (!this.modalModel.multiple_select_support) {
            this.onSubmitClick();
        }
    }

    onGroupAddToList(group: IHardwareGroup): void {
        this.selectedGroupList[group.id] = group;
        if (!this.modalModel.multiple_select_support) {
            this.onSubmitClick();
        }
    }

    onHardwareRemoveFromList(hardware: IHardwareGroup): void {
        console.info('onHardwareRemoveFromList');
        delete this.selectedHardwareList[hardware.id];
    }

    onGroupRemoveFromList(group: IHardwareGroup): void {
        delete this.selectedGroupList[group.id];
    }

    onDrobDownEmiter(action: string, object: any): void {
        if (action === 'label_select_hardware') {
            this.onHardwareAddToList(object);
        }
        if (action === 'label_remove_hardware') {
            this.onHardwareRemoveFromList(object);
        }
        if (action === 'label_select_group') {
            this.onGroupAddToList(object);
        }
        if (action === 'label_remove_group') {
            this.onGroupRemoveFromList(object);
        }
    }

    onSubmitClick(): void {
        // this.modalModel.selected_hardware = []; TODO maybe clean the array?
        for (let i in this.selectedHardwareList) {
            if (this.selectedHardwareList.hasOwnProperty(i)) {
                this.modalModel.selected_hardware.push(this.selectedHardwareList[i]);
            }
        }

        // this.modalModel.selected_hardware_groups = []; TODO maybe clean the array?
        for (let i in this.selectedGroupList) {
            if (this.selectedGroupList.hasOwnProperty(i)) {
                this.modalModel.selected_hardware_groups.push(this.selectedGroupList[i]);
            }
        }

        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
