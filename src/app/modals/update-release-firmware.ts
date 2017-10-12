/**
 * Created by davidhradek on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IBoardGroup, ICProgramShortDetail } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { IMyDpOptions } from 'mydatepicker';

export class ModalsUpdateReleaseFirmwareModel extends ModalModel {
    constructor(
        public deviceGroup: IBoardGroup[] = [],         // All possible Hardware groups for settings
        public cPrograms: ICProgramShortDetail[] = [],
        public deviceGroupStringIdsSelected: string[] = [],   // List with group ids for hardware update,
        public cProgramVersionId: string = '',
        public firmwareType: string = '',
        public timePlan: string = '',
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

    cProgramForSelect: FormSelectComponentOption[] = null;
    cProgramVersionForSelect: FormSelectComponentOption[] = null;

    immediately: boolean = true;


    firmwareTypeSelect: FormSelectComponentOption[] = [];


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

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'cProgramVersionId': ['', [Validators.required]],
            'deviceGroupStringIdsSelected': ['', [Validators.required]], // TODO Not Empty List Validator! Dominik
            'selectedCProgramId': ['', [Validators.required]],
            'firmwareType': ['', [Validators.required]],
            'datePlan': ['', [Validators.required]],
            'timePlan': ['', [Validators.required]],
        });
    }

    ngOnInit() {

        this.groupsForSelect = this.modalModel.deviceGroup.map((pv) => {
            return {
                label: pv.name,
                value: pv.id
            };
        });

        this.cProgramForSelect = this.modalModel.cPrograms.map((pv) => {
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

        (<FormControl>(this.form.controls['selectedCProgramId'])).setValue(this.modalModel.cProgramVersionId);
        (<FormControl>(this.form.controls['cProgramVersionId'])).setValue(this.modalModel.cProgramVersionId);
        (<FormControl>(this.form.controls['firmwareType'])).setValue(this.modalModel.firmwareType);
        (<FormControl>(this.form.controls['datePlan'])).setValue(this.modalModel.timePlan);
        (<FormControl>(this.form.controls['timePlan'])).setValue(this.modalModel.timePlan);
    }

    programSelected() {
        this.backendService.cProgramGet(this.form.controls['cProgramVersionId'].value)
            .then((codeProgram) => {
                this.cProgramVersionForSelect = codeProgram.program_versions.map((pv) => {
                    return {
                        label: pv.version_name,
                        value: pv.version_id
                    };
                });
            })
            .catch(reason => {
            });
    }

    onBooleanClick(value: boolean): void {
        this.immediately = value;
    }

    onSubmitClick(): void {
        this.modalModel.cProgramVersionId = this.form.controls['cProgramVersionId'].value;
        this.modalModel.firmwareType = this.form.controls['firmwareType'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
