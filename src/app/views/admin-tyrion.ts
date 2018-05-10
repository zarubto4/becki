/**
 * Created by Alexandr Tylš on 26.10.17.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IGitHubReleases, IServerUpdate, IServerUpdates } from '../backend/TyrionAPI';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';

@Component({
    selector: 'bk-view-admin-tyrion',
    templateUrl: './admin-tyrion.html'
})
export class TyrionComponent extends _BaseMainComponent implements OnInit {

    updates: IServerUpdates = null;

    form: FormGroup = null;

    versionSelect: FormSelectComponentOption[] = [];

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

    constructor(injector: Injector) {
        super(injector);
        this.form = this.formBuilder.group({
            'version': ['', [Validators.required]],
            'date': ['', [Validators.required]],
            'time': ['', [Validators.required]]
        });
    };

    ngOnInit(): void {

        (<FormControl>(this.form.controls['date'])).setValue(this.dateNow.toDateString());
        (<FormControl>(this.form.controls['time'])).setValue(this.dateNow.getHours() + ':' + (this.dateNow.getMinutes() + 1));

        this.refresh();
    }

    refresh(): void {
        this.blockUI();

        this.tyrionBackendService.serverGetUpdates()
            .then((updates: IServerUpdates) => {
                this.updates = updates;
                this.updates.releases.forEach((release: IGitHubReleases) => {
                    this.versionSelect.push({
                        value: release.tag_name,
                        label: release.tag_name
                    });
                });
                this.unblockUI();
            })
            .catch((reason) => {
                this.fmError(this.translate('flash_cannot_load_updates'), reason);
                this.unblockUI();
            });
    }

    onScheduleRemove() {
        this.blockUI();
        this.tyrionBackendService.serverRemoveUpdateServerComponent()
            .then(() => {
                this.unblockUI();
                this.fmSuccess(this.translate('flash_successfully_scheduled'));
                this.refresh();
            }).catch((reason) => {
                this.unblockUI();
                this.fmError(this.translate('flash_schedule_remove_fail'), reason);
            });
    }

    onScheduleUpdate(on_time: boolean = true) {
        this.blockUI();

        console.info(JSON.stringify(this.form.controls['date'].value));
        let time: number[] = this.form.controls['time'].value.toString().split(':');

        let complete_date: Date = new Date( moment(this.form.controls['date'].value.jsdate).unix() * 1000);
        complete_date.setHours(time[0]);
        complete_date.setMinutes(time[1]);

        // console.log('ON TIME ', complete_date.getTime());

        this.tyrionBackendService.serverUpdateServerComponent({
            version: this.form.controls['version'].value,
            update_time: on_time ? complete_date.getTime() : 0
        })
            .then((result) => {
                this.unblockUI();
                this.fmSuccess(this.translate('flash_successfully_scheduled'));
                this.refresh();
            }).catch((reason) => {
                this.unblockUI();
                this.fmError(this.translate('flash_schedule_fail'), reason);
            });
    }
}
