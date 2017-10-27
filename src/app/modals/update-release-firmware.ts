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
import {
    IActualizationProcedureMakeTypeOfBoard,
    IBoardGroup, IBootLoader, IBPair, ICProgramFilter, ICProgramList, ICProgramShortDetail,
    ICProgramShortDetailForBlocko, ITypeOfBoard, ITypeOfBoardShortDetail
} from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { IMyDpOptions } from 'mydatepicker';

export class ModalsUpdateReleaseFirmwareModel extends ModalModel {
    constructor(
        public project_id: string = null,
        public deviceGroup: IBoardGroup[] = [],         // All possible Hardware groups for settings
        public deviceGroupStringIdSelected: string = '',   // List with group ids for hardware update,
        public firmwareType: string = '',
        public groups: IActualizationProcedureMakeTypeOfBoard[] = [],
        public timePlan: number = 0,
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-update-release-firmware',
    templateUrl: './update-release-firmware.html'
})
export class ModalsUpdateReleaseFirmwareComponent implements OnInit {

    @Input()
    modalModel: ModalsUpdateReleaseFirmwareModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    @ViewChild('GroupList')
    groupsForSelect: FormSelectComponentOption[] = null;

    // cProgramForSelect: FormSelectComponentOption[] = null;
    // cProgramVersionForSelect: FormSelectComponentOption[] = null;
    type_of_boards: ITypeOfBoard[] = null;
    deviceGroup: IBoardGroup = null;
    immediately: boolean = true;

    cPrograms: { [typeOfBoardId: string]: ICProgramList } = {};
    bootloaders: { [typeOfBoardId: string]: IBootLoader[] } = {};


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

    constructor(public backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'deviceGroupStringIdSelected': ['', [Validators.required]], // TODO Not Empty List Validator! Dominik
            'firmwareType': [''],
            'datePlan': [''],
            'timePlan': [''],
        });
    }

    set_firmware() {
        this.type = 'firmware';
    }

    set_bootloader() {
        this.type = 'bootloader';
    }

    onGroupChange() {
        let group_id: string = this.form.controls['deviceGroupStringIdSelected'].value;

        console.log("Vybraná skupina je:: ", group_id);

        for (let i: number = 0; i < this.modalModel.deviceGroup.length; i++) {

            if (this.modalModel.deviceGroup[i].id === group_id ) {

                this.deviceGroup = this.modalModel.deviceGroup[i];
                this.modalModel.deviceGroup[i].type_of_boards_short_detail.forEach((tp: ITypeOfBoardShortDetail) => {

                    this.form.addControl(tp.id + '_selectedBootloaderId', new FormControl('', []));
                    this.form.addControl(tp.id + '_selectedCProgramVersionId', new FormControl('', []));

                    if (this.cPrograms[tp.id] == null) {
                        this.backendService.cProgramGetListByFilter(0, {
                            project_id: this.modalModel.project_id,
                            type_of_board_ids: [tp.id]
                        }).then((list: ICProgramList) => {
                            this.cPrograms[tp.id] = list;
                        }).catch(reason => {
                        });
                    }
                });

                this.modalModel.deviceGroup[i].type_of_boards_short_detail.forEach((tp: ITypeOfBoardShortDetail) => {
                    if (this.bootloaders[tp.id] == null) {
                        this.backendService.typeOfBoardGet(tp.id)
                            .then((typeOfBoard) => {
                                this.bootloaders[tp.id] = typeOfBoard.boot_loaders;
                            }).catch(reason => {
                            });
                    }
                });
            }
        }

    }

    hwCProgramVersionChanged(typeOfBoardId: string, cProgramVersion: string) {
        (<FormControl>(this.form.controls[typeOfBoardId + '_selectedCProgramVersionId'])).setValue(cProgramVersion);
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

        this.groupsForSelect = this.modalModel.deviceGroup.map((pv) => {
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
        (<FormControl>(this.form.controls['datePlan'])).setValue(this.modalModel.timePlan);
        (<FormControl>(this.form.controls['timePlan'])).setValue(this.modalModel.timePlan);
    }

    onBooleanClick(value: boolean): void {
        this.immediately = value;
    }

    onSubmitClick(): void {
        this.modalModel.deviceGroupStringIdSelected = this.form.controls['deviceGroupStringIdSelected'].value;

        if (this.type === 'bootloader') {
            this.modalModel.firmwareType = 'bootloader';
        } else {
            this.modalModel.firmwareType = this.form.controls['firmwareType'].value;
        }

        this.deviceGroup.type_of_boards_short_detail.forEach((typeOfBoard: ITypeOfBoardShortDetail) => {

            let bootloader_id: string = this.form.controls[typeOfBoard.id + '_selectedBootloaderId'].value;
            let c_program_version_id: string  = this.form.controls[typeOfBoard.id + '_selectedCProgramVersionId'].value;

            let gr: IActualizationProcedureMakeTypeOfBoard = {
                type_of_board_id: typeOfBoard.id,
                bootloader_id: bootloader_id,
                c_program_version_id: c_program_version_id
            };

            this.modalModel.groups.push(gr);
        });

        this.modalModel.timePlan = this.form.controls['datePlan'].value + this.form.controls['timePlan'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
