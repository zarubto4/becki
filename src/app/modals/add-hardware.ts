/**
 * Created by davidhradek on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IBoardGroup } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { MultiSelectComponent } from '../components/MultiSelectComponent';
import { FlashMessageError, FlashMessage } from '../services/NotificationService';
import { TranslatePipe } from '../pipes/TranslationPipe';
import { TranslationService } from '../services/TranslationService';


export class ModalsAddHardwareModel extends ModalModel {
    constructor(
        public project_id: string,
        public deviceGroup: IBoardGroup[] = []
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

    registredDevices: string[] = [];
    failedDevices: string[] = [];

    afterFirstConfirm: boolean = false;

    step: string = null;
    group_options_available: FormSelectComponentOption[] = []; // Select Groups

    @ViewChild('groupList')
    listGroup: MultiSelectComponent;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder, private translationService: TranslationService) {

        this.form = this.formBuilder.group({
            'id': ['', [Validators.required], BeckiAsyncValidators.hardwareDeviceId(backendService)],
        });

        this.multiForm = this.formBuilder.group({
            'listOfIds': ['', [Validators.required]]
        });
        this.deviceInfoTextForm = this.formBuilder.group({
            'succesfulDevices': ['', []],
            'failedDevices': ['', []],
        });


    }

    multipleRegistration() {
        this.step = 'multipleRegistration';
    }

    singleRegistration() {
        this.step = 'singleRegistration';
    }

    ngOnInit() {

        this.group_options_available = this.modalModel.deviceGroup.map((pv) => {
            return {
                label: pv.name,
                value: pv.id
            };
        });

        (<FormControl>(this.form.controls['id'])).setValue('');
        (<FormControl>(this.multiForm.controls['listOfIds'])).setValue('');

    }

    sequenceRegistaration() {
        this.registredDevices = [];
        this.failedDevices = [];

        let groupIDs = this.listGroup.selectedItems.map(a => a.value);
        let data: string = this.multiForm.controls['listOfIds'].value;
        data.replace(' ', '');
        data.replace(',', ';');
        data.replace(/(?:\r\n|\r|\n)/g, '');
        data = data + ';';
        let devicesForRegistration: string[] = data.split(';');
        devicesForRegistration = devicesForRegistration.filter(device => device.length > 0);
        devicesForRegistration.forEach(device => {
            this.backendService.boardConnectWithProject({ group_ids: groupIDs, hash_for_adding: device, project_id: this.modalModel.project_id })
                .then(() => {
                    this.registredDevices.push(device);
                    devicesForRegistration.splice(devicesForRegistration.indexOf(device), 1);
                })
                .catch(reason => {
                    this.failedDevices.push(device + ': ' + reason.body.message);
                }).then(() => {
                    if (devicesForRegistration.length > 0) {
                        this.multiForm.controls['listOfIds'].setValue(devicesForRegistration);
                        this.deviceInfoTextForm.controls['succesfulDevices'].setValue(this.registredDevices.join(', \n'));
                        this.deviceInfoTextForm.controls['failedDevices'].setValue(this.failedDevices.join(', \n'));
                    } else {
                        this.modalClose.emit(true);
                    }
                });
        }
        );
    }


    singleRegistaration() {
        let groupIDs = this.listGroup.selectedItems.map(a => a.value);
        this.backendService.boardConnectWithProject({ group_ids: groupIDs, hash_for_adding: this.form.controls['id'].value, project_id: this.modalModel.project_id })
            .then(() => {
                this.modalClose.emit(true);
            })
            .catch(reason => {
                this.flashMesseage.emit(new FlashMessageError(this.translationService.translate('flash_cant_add_hardware', this), reason));
                this.modalClose.emit(false);
            });
    }

    onSubmitClick(): void {
        this.afterFirstConfirm = true;
        if (this.step === 'singleRegistration') {
            this.singleRegistaration();
        } else {
            this.sequenceRegistaration();
        }
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
