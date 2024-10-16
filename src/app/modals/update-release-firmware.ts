/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import {
    Input, Output, EventEmitter, Component, OnInit, ViewChild, AfterViewChecked,
    ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel, ModalService } from '../services/ModalService';
import {
    IHardwareGroup, IHardwareType,
    IHardwareGroupList, IShortReference, ICProgramVersion, ICProgram, IHardwareUpdateMakeHardwareType
} from '../backend/TyrionAPI';
import { FormSelectComponent, FormSelectComponentOption } from '../components/FormSelectComponent';
import { IMyDpOptions } from 'mydatepicker';
import * as moment from 'moment';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { TranslationService } from '../services/TranslationService';
import { FlashMessageError, NotificationService } from '../services/NotificationService';
import { IError } from '../services/_backend_class/Responses';
import { ModalsSelectCodeModel } from './code-select';

export class ModalsUpdateReleaseFirmwareModel extends ModalModel {
    constructor(
        public project_id: string = null,
        public name: string = null,
        public description: string = null,
        public deviceGroup: IHardwareGroupList = null,         // All possible Hardware groups for settings
        public deviceGroupStringIdSelected: string = '',   // List with group ids for hardware update,
        public firmwareType: ('FIRMWARE' | 'BACKUP' | 'BOOTLOADER') = 'FIRMWARE',
        public groups: IHardwareUpdateMakeHardwareType[] = [],
        public time: number = 0,
        public timeZoneOffset: number = 0,
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-update-release-firmware',
    templateUrl: './update-release-firmware.html'
})
export class ModalsUpdateReleaseFirmwareComponent implements OnInit, AfterViewChecked {

    @Input()
    modalModel: ModalsUpdateReleaseFirmwareModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    @ViewChild('GroupList')
    formGroupList: FormSelectComponent;
    groupsForSelect: FormSelectComponentOption[] = null;

    selectedDeviceGroup: IHardwareGroup = null;
    selectedProgram: { [hardwareTypeId: string]: {
        program: ICProgram,
        version: ICProgramVersion
    } } = {}; // List of Bootloaders ordered by HArdware Group ID

    immediately: boolean = true;

    bootloaders: { [hardwareTypeId: string]: FormSelectComponentOption[] } = {}; // List of Bootloaders ordered by HArdware Group ID

    firmwareTypeSelect: FormSelectComponentOption[] = [];

    // firmware / bootloader
    type: string = null;

    dateNow = new Date();
    dateOption: IMyDpOptions = { // can be found here: https://github.com/kekeh/mydatepicker/blob/master/README.md#options-attribute
        dateFormat: 'dd.mm.yyyy',
        showTodayBtn: true,
        disableUntil: {
            year: this.dateNow.getFullYear(),
            month: this.dateNow.getMonth() + 1,
            day: this.dateNow.getDate() - 1
        },
        disableSince: {
            year: this.dateNow.getFullYear(),
            month: this.dateNow.getMonth() + 12,
            day: this.dateNow.getDate()
        },
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        inline: false
    };


    ngAfterViewChecked() {
        if (this.selectedDeviceGroup  != null) { // check if it change, tell CD update view
            this.cdRef.detectChanges();
        }
    }

    constructor(public backendService: TyrionBackendService, private modalService: ModalService, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef,
        private translationService: TranslationService, protected notificationService: NotificationService, ) {
        this.form = this.formBuilder.group({
            'deviceGroupStringIdSelected': ['', [Validators.required]],
            'name': ['',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ]
            ],
            'description': ['', [Validators.maxLength(255)]],
            'firmwareType': ['', [Validators.required]],
            'date': ['', [BeckiValidators.condition(() => (!this.immediately), Validators.required)]],
            'time': ['', [BeckiValidators.condition(() => (!this.immediately), Validators.required)]],
            'timeZoneOffset': ['', [BeckiValidators.condition(() => (!this.immediately), Validators.required)]],
        });
    }

    set_firmware() {
        this.type = 'firmware';
    }

    set_bootloader() {
        this.type = 'bootloader';
    }

    onGroupChange(value: string) {
      // console.log('onGroupChange value:: ', value);
        this.selectedDeviceGroup = null;
        if (value === null) {
            return;
        }

        let devgroup: IHardwareGroup = null;

        for (let i: number = 0; i < this.modalModel.deviceGroup.content.length; i++) {

            if (this.modalModel.deviceGroup.content[i].id === value ) {

                console.info('onGroupChange:: Našel jsem skupinu a jmenuje se', this.modalModel.deviceGroup.content[i].name);
                console.info('onGroupChange:: hardware_types nad skupinou', this.modalModel.deviceGroup.content[i].hardware_types);

                devgroup = this.modalModel.deviceGroup.content[i];
                if ( devgroup.hardware_types != null && devgroup.hardware_types.length > 0) {

                    console.info('onGroupChange:: Budu hledat pro každý typ hardware_types');

                    devgroup.hardware_types.forEach((tp: IShortReference) => {

                        console.info('onGroupChange:: Pro každého: ', tp.name);
                        this.form.addControl(tp.id + '_selectedBootloaderId', new FormControl('', []));
                        this.form.addControl(tp.id + '_selectedCProgramVersionId', new FormControl('', []));

                        this.backendService.hardwareTypeGet(tp.id)
                            .then((hardwareType) => {
                                this.bootloaders[tp.id] = hardwareType.boot_loaders.map((pv) => {
                                    return {
                                        label: pv.name,
                                        value: pv.id
                                    };
                                });

                            }).catch((reason: IError) => {
                                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                                console.error('hardwareTypeGet:cProgramGetListByFilter', reason);
                            });

                    });

                }


                this.selectedDeviceGroup = devgroup;

            }
        }
    }

    onSelectCProgramVersion = (hardwareType: IShortReference) => {
        console.info('onSelectCProgramVersion: hardwareType', hardwareType);
        console.info('onSelectCProgramVersion: project_ID', this.modalModel.project_id);

        let model = new ModalsSelectCodeModel(this.modalModel.project_id, hardwareType.id);


        console.info('onSelectCProgramVersion: model', model);
        console.info('onSelectCProgramVersion: model', model.project_id, model.selected_c_program);

        this.modalService.showModal(model).then((success) => {

            if (success) {
                this.selectedProgram[hardwareType.id] = {
                    program: model.selected_c_program,
                    version: model.selected_c_program_version
                };
                (<FormControl>(this.form.controls[hardwareType.id + '_selectedCProgramVersionId'])).setValue(model.selected_c_program_version.id);
            }

        }).catch((exception) => {
            console.error('onSelectCProgramVersion:: error:: ', exception);
        });
    }


    ngOnInit() {
        this.set_firmware();

        this.groupsForSelect = this.modalModel.deviceGroup.content.map((pv) => {
            return {
                label: pv.name,
                value: pv.id
            };
        });

        // Set Manual Selector
        this.firmwareTypeSelect.push({
            value: 'FIRMWARE',
            label: 'Firmware - Main'
        });

        // Set Manual Selector
        this.firmwareTypeSelect.push({
            value: 'BACKUP',
            label: 'Firmware - Backup'
        });


        (<FormControl>(this.form.controls['firmwareType'])).setValue(this.modalModel.firmwareType);
        (<FormControl>(this.form.controls['deviceGroupStringIdSelected'])).setValue('');
        (<FormControl>(this.form.controls['date'])).setValue(this.dateNow.toDateString());
        (<FormControl>(this.form.controls['time'])).setValue(this.dateNow.getHours() + ':' + (this.dateNow.getMinutes() + 2));
        (<FormControl>(this.form.controls['timeZoneOffset'])).setValue('');
    }

    onBooleanClick(value: boolean): void {
        this.immediately = value;
    }

    onSubmitClick(): void {

        this.modalModel.deviceGroupStringIdSelected = this.formGroupList.selectedValue;

        if (this.type === 'BOOTLOADER') {
            this.modalModel.firmwareType = 'BOOTLOADER';
        } else {
            this.modalModel.firmwareType = this.form.controls['firmwareType'].value;
        }

        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.description = this.form.controls['description'].value;

        this.selectedDeviceGroup.hardware_types.forEach((hardwareType: IShortReference) => {

            let bootloader_id: string = this.form.controls[hardwareType.id + '_selectedBootloaderId'].value;
            let c_program_version_id: string = this.form.controls[hardwareType.id + '_selectedCProgramVersionId'].value;

            let gr: IHardwareUpdateMakeHardwareType = {
                hardware_type_id: hardwareType.id,
                bootloader_id: bootloader_id,               // TODO check if this contain id too
                c_program_version_id: c_program_version_id
            };

            this.modalModel.groups.push(gr);
        });

        if (!this.immediately) {

            let time: number[] = this.form.controls['time'].value.toString().split(':');
            // console.log('Time:: ', time);

            let date: number = this.form.controls['date'].value;
            // console.log('Date:: ', date);
            // console.log('Date:: ', '' + date.toString());

            // console.log('date jsdat:: ', this.form.controls['date'].value.jsdat);
            // console.log('date in unix:: ', moment(this.form.controls['date'].value.jsdate).unix());

            let complete_date: Date = new Date( moment(this.form.controls['date'].value.jsdate).unix() * 1000);
            complete_date.setHours(time[0]);
            complete_date.setMinutes(time[1]);

            // console.log('update_time:: To String ', complete_date.toString());
            // console.log('update_time:: Unix ',  moment(complete_date).unix());
            this.modalModel.time = moment(complete_date).unix();
            this.modalModel.timeZoneOffset = this.form.controls['timeZoneOffset'].value;
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
