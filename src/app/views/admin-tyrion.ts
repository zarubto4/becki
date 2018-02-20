/**
 * Created by Alexandr Tylš on 26.10.17.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IGitHubReleases, IServerUpdate, IServerUpdates } from '../backend/TyrionAPI';
import { FormGroup, Validators } from '@angular/forms';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import * as moment from 'moment';

@Component({
    selector: 'bk-view-admin-tyrion',
    templateUrl: './admin-tyrion.html'
})
export class TyrionComponent extends _BaseMainComponent implements OnInit {

    updates: IServerUpdates = null;

    form: FormGroup = null;

    versionSelect: FormSelectComponentOption[] = [];

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            'version': ['', [Validators.required]],
            'date': ['', [Validators.required]],
            'time': ['', [Validators.required]]
        });
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

    onScheduleUpdate() {
        this.blockUI();

        console.info(JSON.stringify(this.form.controls['date'].value));
        let time: string[] = this.form.controls['time'].value.toString().split(':');
        let update_time: number = moment(this.form.controls['date'].value.jsdate).add(time[0], 'hour').add(time[1], 'minute').unix() * 1000;

        let body: IServerUpdate = {
            version: this.form.controls['version'].value,
            update_time: update_time
        };
        console.info(JSON.stringify(body));
        this.tyrionBackendService.serverUpdateServerComponent(body)
            .then((result) => {
                this.unblockUI();
                this.fmSuccess(this.translate('flash_successfully_scheduled'));
            }).catch((reason) => {
                this.unblockUI();
                this.fmError(this.translate('flash_schedule_fail'), reason);
            });
    }
}
