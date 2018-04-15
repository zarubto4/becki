/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { IInstanceSnapshot } from '../backend/TyrionAPI';
import { IMyDpOptions } from 'mydatepicker';
import { BeckiValidators } from '../helpers/BeckiValidators';
import * as moment from 'moment';

export class ModalsSnapShotDeployModel extends ModalModel {
    constructor(
        public snapshots: IInstanceSnapshot[] = [],
        public selected_snapshot_id: string = null,
        public time: number = 0,
        public timeZoneOffset: number = 0
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-snap-shot-deploy',
    templateUrl: './snapshot-deploy.html'
})
export class ModalsSnapShotDeployComponent implements OnInit {

    @Input()
    modalModel: ModalsSnapShotDeployModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;
    options: FormSelectComponentOption[] = null;

    immediately: boolean = true;

    // Timer

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

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
        let input: { [key: string]: any } = {
            'selected_snapshot': ['', [Validators.required]],
            'date': ['', [BeckiValidators.condition(() => (!this.immediately), Validators.required)]],
            'time': ['', [BeckiValidators.condition(() => (!this.immediately), Validators.required)]],
            'timeZoneOffset': ['', [BeckiValidators.condition(() => (!this.immediately), Validators.required)]],
        };
        this.form = this.formBuilder.group(input);
    }

    ngOnInit() {


        (<FormControl>(this.form.controls['date'])).setValue(this.dateNow.toDateString());
        (<FormControl>(this.form.controls['time'])).setValue(this.dateNow.getHours() + ':' + (this.dateNow.getMinutes() + 2));
        (<FormControl>(this.form.controls['timeZoneOffset'])).setValue('');

        (<FormControl>(this.form.controls['selected_snapshot'])).setValue('');

        this.options = this.modalModel.snapshots.map((pv: IInstanceSnapshot) => {
            return {
                label: pv.name + ' - ' + pv.description,
                value: pv.id,
            };
        });
    }

    onBooleanClick(value: boolean): void {
        this.immediately = value;
    }

    onSubmitClick(): void {
        this.modalModel.selected_snapshot_id = this.form.controls['selected_snapshot'].value;

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
