/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { IHardware, IHardwareGroupList, IResultBadRequest } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { MultiSelectComponent } from '../components/MultiSelectComponent';
import { FlashMessage, NotificationService } from '../services/NotificationService';
import { TranslationService } from '../services/TranslationService';
import { IError } from '../services/_backend_class/Responses';


export class ModalsAddHardwareModel extends ModalModel {
    constructor(
        public project_id: string,
        public deviceGroup: IHardwareGroupList = null
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-add-hardware',
    templateUrl: './add-hardware.html'
})
export class ModalsAddHardwareComponent  implements OnInit {

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


    devicesForRegistration: string[] = null;
    inprogress: boolean = false;
    list_finish: boolean = false;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService, protected notificationService: NotificationService) {
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

        hw_value =  hw_value.replace(/ /g, '');

        this.backendService.boardCheckRegistrationStatus(hw_value, this.modalModel.project_id)
            .then((result) => {
                // CAN_REGISTER, ALREADY_REGISTERED_IN_YOUR_ACCOUNT, ALREADY_REGISTERED, PERMANENTLY_DISABLED, BROKEN_DEVICE
                this.single_error_status = result.status;
            })
            .catch( (reason: IError) => {
                // this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                this.single_error_message = reason.message;
            });
    }

    /*

    HWdde7f9e988a54e7a9398237a, HW9a665d2eab764b35b6fab664, HWefac1814e2ae44128275d95c,
    HWfa91606175874efab5ffea5d,  HWad617ccd8dc04b2581a0c433,HW5e725a1ba7b8446fbf06c70d

    */

    sequenceRegistration() {

        console.info('Console Registration');
        this.devicesForRegistration = null;

        this.registeredDevices = [];
        this.failedDevices = [];

        if (this.multiSelectedHardwareGroups === null && this.modalModel.deviceGroup && this.modalModel.deviceGroup.content.length > 0) {
            this.multiSelectedHardwareGroups = this.listGroup.selectedItems.map(a => a.value);
        }

        this.inprogress = true;

        let data: string = this.multiForm.controls['listOfIds'].value;

        data = data.replace(/,/g, ';');

        data = data.replace(/\s+/g, '');
        data = data.replace(/(\r?\n|\r)*(\s)*/g, '');


        console.info('Result Před splitem: ', data);
        let devicesForRegistration: string[] = data.split(';');

        console.info('Result list:', devicesForRegistration);
        this.devicesForRegistration = devicesForRegistration.filter(device => device.length > 20);
        console.info('Result list:',  this.devicesForRegistration);


        this.sequenceRegistrationPromise(0);

    }


    sequenceRegistrationPromise(pointer: number) {

        if (pointer >= this.devicesForRegistration.length) {
            this.inprogress = false;
            this.list_finish = true;
            return;
        }

        // console.info("Registurji number: ", pointer, "Pole: ", this.devicesForRegistration[pointer]);

        this.backendService.projectAddHW({
            group_ids: this.multiSelectedHardwareGroups,
            registration_hash: this.devicesForRegistration[pointer],
            project_id: this.modalModel.project_id
        })
            .then((device: IHardware) => {

                console.error('Podařilo se ', device.id );

                this.registeredDevices.push(device.id + ' - Success');
                this.deviceInfoTextForm.controls['successfulDevices'].setValue(this.registeredDevices.join(',  \n'));

                this.sequenceRegistrationPromise(++pointer);

            })
            .catch((reason: IResultBadRequest) => {

                // this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_cant_add_hardware', this), reason));
                console.warn('Nepodařilo se pro ', this.devicesForRegistration[pointer], ' důvod?', reason.message);

                this.failedDevices.push(this.devicesForRegistration[pointer] + ': ' + reason.message);
                this.deviceInfoTextForm.controls['failedDevices'].setValue(this.failedDevices.join(',  \n'));

                this.sequenceRegistrationPromise(++pointer);
            });
    }






    singleRegistration() {

        this.single_error_message = null;

        if (this.multiSelectedHardwareGroups === null && this.modalModel.deviceGroup && this.modalModel.deviceGroup.content.length > 0) {
            this.multiSelectedHardwareGroups = this.listGroup.selectedItems.map(a => a.value);
        }

        let registration_hash: string = this.form.controls['id'].value;
        registration_hash =  registration_hash.replace(/ /g, '');

        this.backendService.projectAddHW({
            group_ids: this.multiSelectedHardwareGroups,
            registration_hash: registration_hash,
            project_id: this.modalModel.project_id
        })
            .then(() => {
                this.modalClose.emit(true);
            })
            .catch((reason: IResultBadRequest) => {
                this.single_error_message = reason.message;
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
