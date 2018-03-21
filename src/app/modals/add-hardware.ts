/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { AsyncValidatorDebounce, BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IHardwareGroup, IHardwareGroupList } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { MultiSelectComponent } from '../components/MultiSelectComponent';
import { FlashMessageError, FlashMessage } from '../services/NotificationService';
import { TranslatePipe } from '../pipes/TranslationPipe';
import { TranslationService } from '../services/TranslationService';


export class ModalsAddHardwareModel extends ModalModel {
    constructor(
        public project_id: string,
        public deviceGroup: IHardwareGroupList = null
    ) {
        super();
    }
}

export interface StatusMesseage {
    icon: string;
    color: string;
    text: string;
}

@Component({
    selector: 'bk-modals-add-hardware',
    templateUrl: './add-hardware.html'
})
export class ModalsAddHardwareComponent implements OnInit {

    @Input()
    modalModel: ModalsAddHardwareModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    @Output()
    flashMesseage = new EventEmitter<FlashMessage>();

    form: FormGroup;

    multiForm: FormGroup;

    deviceInfoTextForm: FormGroup;

    registeredDevices: string[] = [];
    failedDevices: string[] = [];

    afterFirstConfirm: boolean = false;

    multiSelectedHardwareGroups: string[] = null;

    step: string = null;
    group_options_available: FormSelectComponentOption[] = []; // Select Groups

    @ViewChild('groupList')
    listGroup: MultiSelectComponent;

    single_error_status: string = null;
    single_error_message: string = null;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService) {
        this.form = this.formBuilder.group({
            'id' : ['', [Validators.required]]
        });

        this.multiForm = this.formBuilder.group({
            'listOfIds': ['', [Validators.required]]
        });

        this.deviceInfoTextForm = this.formBuilder.group({
            'successfulDevices': ['', []],
            'failedDevices': ['', []],
        });
    }

    set_multipleRegistration() {
        this.step = 'multipleRegistration';
    }

    set_singleRegistration() {
        this.step = 'singleRegistration';
    }

    ngOnInit() {

        this.group_options_available = this.modalModel.deviceGroup.content.map((pv) => {
            return {
                label: pv.name,
                value: pv.id
            };
        });

        (<FormControl>(this.form.controls['id'])).setValue('');
        (<FormControl>(this.multiForm.controls['listOfIds'])).setValue('');

    }

    /**
     * Only for Individual HW registration
     * @param hw_value
     * @returns {(control:FormControl)=>Promise<T>}
     */
    onChangeIndividualHashValue(hw_value: string) {
        this.single_error_status = null;
        this.backendService.boardCheckRegistrationStatus(hw_value, this.modalModel.project_id)
            .then((result) => {
                // CAN_REGISTER, ALREADY_REGISTERED_IN_YOUR_ACCOUNT, ALREADY_REGISTERED, PERMANENTLY_DISABLED, BROKEN_DEVICE
                this.single_error_status = result.status;
            })
            .catch(() => {

            });
    }

    sequenceRegistration() {
        this.registeredDevices = [];
        this.failedDevices = [];

        if (this.multiSelectedHardwareGroups === null && this.modalModel.deviceGroup && this.modalModel.deviceGroup.content.length > 0) {
            this.multiSelectedHardwareGroups = this.listGroup.selectedItems.map(a => a.value);
        }

        let data: string = this.multiForm.controls['listOfIds'].value;
        data.replace(',', ';');
        data.replace(/(\r?\n|\r)*(\s)*/g, '');
        data = data + ';';
        let devicesForRegistration: string[] = data.split(';');
        devicesForRegistration = devicesForRegistration.filter(device => device.length > 0);

        devicesForRegistration.forEach(device => {
            this.backendService.projectAddHW({
                group_ids: this.multiSelectedHardwareGroups,
                registration_hash: device,
                project_id: this.modalModel.project_id
            })
                .then(() => {

                    this.registeredDevices.push(device);
                    devicesForRegistration.splice(devicesForRegistration.indexOf(device), 1);
                })
                .catch(reason => {
                    this.failedDevices.push(device + ':  ' + reason.body.message);
                }).then(() => {
                    if (devicesForRegistration.length > 0) {
                        this.multiForm.controls['listOfIds'].setValue(devicesForRegistration.join(';'));
                        this.deviceInfoTextForm.controls['successfulDevices'].setValue(this.registeredDevices.join(',  \n'));
                        this.deviceInfoTextForm.controls['failedDevices'].setValue(this.failedDevices.join(',  \n'));
                    } else {
                        this.modalClose.emit(true);
                    }
                });
        });
    }


    singleRegistration() {

        this.single_error_message = null;

        if (this.multiSelectedHardwareGroups === null && this.modalModel.deviceGroup && this.modalModel.deviceGroup.content.length > 0) {
            this.multiSelectedHardwareGroups = this.listGroup.selectedItems.map(a => a.value);
        }

        this.backendService.projectAddHW({
            group_ids: this.multiSelectedHardwareGroups,
            registration_hash: this.form.controls['id'].value,
            project_id: this.modalModel.project_id
        })
            .then(() => {
                this.modalClose.emit(true);
            })
            .catch(reason => {
                this.single_error_message = reason.body.message;

            });
    }

    onSubmitClick(): void {
        this.afterFirstConfirm = true;
        if (this.step === 'singleRegistration') {
            this.singleRegistration();
        } else {
            this.sequenceRegistration();
        }
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
