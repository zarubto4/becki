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
import { ModalModel } from '../services/ModalService';
import {
    IHardwareGroup,
    IBootLoader,
    IActualizationProcedureMakeHardwareType,
    ICProgramList,
    IHardwareType,
    IHardwareGroupList
} from '../backend/TyrionAPI';
import { FormSelectComponent, FormSelectComponentOption } from '../components/FormSelectComponent';
import { IMyDpOptions } from 'mydatepicker';
import * as moment from 'moment';
import { BeckiValidators } from '../helpers/BeckiValidators';

export class ModalsUpdateReleaseFirmwareModel extends ModalModel {
    constructor(
        public project_id: string = null,
        public deviceGroup: IHardwareGroupList = null,         // All possible Hardware groups for settings
        public deviceGroupStringIdSelected: string = '',   // List with group ids for hardware update,
        public firmwareType: string = 'firmware',
        public groups: IActualizationProcedureMakeHardwareType[] = [],
        public time: number = 0,
        public timeZoneOffset: number = 0) {

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

    type_of_boards: IHardwareType[] = null;
    selectedDeviceGroup: IHardwareGroup = null;
    immediately: boolean = true;

    cPrograms: { [hardwareTypeId: string]: ICProgramList } = {};
    bootloaders: { [hardwareTypeId: string]: IBootLoader[] } = {};

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
        if (this.selectedDeviceGroup != null) { // check if it change, tell CD update view
            this.cdRef.detectChanges();
        }
    }

    constructor(public backendService: TyrionBackendService, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef) {
        this.form = this.formBuilder.group({
            'deviceGroupStringIdSelected': ['', [Validators.required]],
            'firmwareType': ['', [Validators.required]],
            'date': ['', [BeckiValidators.condition(() => (!this.immediately), Validators.required)]],
            'time': ['', [BeckiValidators.condition(() => (!this.immediately), Validators.required)]],
            'timeZoneOffset': ['', [BeckiValidators.condition(() => (!this.immediately), Validators.required)]],
            'versionSelected': ['', [Validators.required]]
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

        (<FormControl>(this.form.controls['versionSelected'])).setValue(null);
        let devgroup: IHardwareGroup = null;

        for (let i: number = 0; i < this.modalModel.deviceGroup.content.length; i++) {

            if (this.modalModel.deviceGroup.content[i].id === value) {

                // console.log("onGroupChange:: Našel jsem skupinu a jmenuje se", this.modalModel.deviceGroup.content[i].name);
                // console.log("onGroupChange:: hardware_types nad skupinou", this.modalModel.deviceGroup.content[i].hardware_types);

                devgroup = this.modalModel.deviceGroup.content[i];
                if (devgroup.hardware_types != null && devgroup.hardware_types.length > 0) {

                    // console.log("onGroupChange:: Budu hledat pro každý typ hardware_types");

                    devgroup.hardware_types.forEach((tp: IHardwareType) => {

                        // console.log("onGroupChange:: Pro každého: ", tp.name);

                        this.form.addControl(tp.id + '_selectedBootloaderId', new FormControl('', []));
                        this.form.addControl(tp.id + '_selectedCProgramVersionId', new FormControl('', []));

                        if (this.cPrograms[tp.id] == null) {
                            // console.log("onGroupChange:: this.cPrograms[tp.id] == null ");
                            this.backendService.cProgramGetListByFilter(0, {
                                project_id: this.modalModel.project_id,
                                hardware_type_ids: [tp.id]
                            }).then((list: ICProgramList) => {
                                this.cPrograms[tp.id] = list;

                                if (this.cPrograms[tp.id] && this.bootloaders[tp.id]) {
                                    this.selectedDeviceGroup = devgroup;
                                }

                            }).catch(reason => {
                                console.error('Error:cProgramGetListByFilter', reason);
                            });
                        }

                        if (this.bootloaders[tp.id] == null) {
                            // console.log("onGroupChange:: this.bootloaders[tp.id] == null ");
                            this.backendService.hardwareTypeGet(tp.id)
                                .then((hardwareType) => {
                                    this.bootloaders[tp.id] = hardwareType.boot_loaders;

                                    if (this.cPrograms[tp.id] && this.bootloaders[tp.id]) {
                                        this.selectedDeviceGroup = devgroup;
                                    }
                                })
                                .catch(reason => {
                                    console.error('hardwareTypeGet:cProgramGetListByFilter', reason);
                                });
                        }

                        if (this.cPrograms[tp.id] && this.bootloaders[tp.id]) {
                            // console.log("this.cPrograms[tp.id] && this.bootloaders[tp.id] ");
                            this.selectedDeviceGroup = devgroup;
                        }

                    });
                } else {
                    // console.log("onGroupChange:: Nemám žádné skupiny, ukončuju a přiřazuji skupinu :", devgroup);
                    // No HW groups
                    this.selectedDeviceGroup = devgroup;
                }
            }
        }
    }

    hwCProgramVersionChanged(hardwareTypeId: string, cProgramVersion: string) {
        (<FormControl>(this.form.controls[hardwareTypeId + '_selectedCProgramVersionId'])).setValue(cProgramVersion);
        (<FormControl>(this.form.controls['versionSelected'])).setValue(cProgramVersion);
    }

    get_bootloader_option(boot_loaders: IBootLoader[]): FormSelectComponentOption[] {
        return boot_loaders.map((pv) => {
            return {
                label: pv.name,
                value: pv.id
            };
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
            value: 'firmware',
            label: 'Firmware - Main'
        });

        // Set Manual Selector
        this.firmwareTypeSelect.push({
            value: 'backup',
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

        if (this.type === 'bootloader') {
            this.modalModel.firmwareType = 'bootloader';
        } else {
            this.modalModel.firmwareType = this.form.controls['firmwareType'].value;
        }

        this.selectedDeviceGroup.hardware_types.forEach((hardwareType: IHardwareType) => {

            let bootloader_id: string = this.form.controls[hardwareType.id + '_selectedBootloaderId'].value;
            let c_program_version_id: string = this.form.controls[hardwareType.id + '_selectedCProgramVersionId'].value;

            let gr: IActualizationProcedureMakeHardwareType = {
                hardware_type_id: hardwareType.id,
                bootloader_id: bootloader_id,
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

            let complete_date: Date = new Date(moment(this.form.controls['date'].value.jsdate).unix() * 1000);
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
