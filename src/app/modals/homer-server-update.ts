/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { IHomerServer } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { IAvailableVersion, IVersionOverview } from '../backend/HomerAPI';
import { NotificationService } from '../services/NotificationService';
import { TranslationService } from '../services/TranslationService';
import { IError } from '../services/_backend_class/Responses';


export class ModalsUpdateHomerServerModel extends ModalModel {
    constructor(
        public homer_server: IHomerServer
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-homer-update-server',
    templateUrl: './homer-server-update.html'
})
export class ModalsUpdateHomerServerComponent implements OnInit {

    @Input()
    modalModel: ModalsUpdateHomerServerModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options_available_version: FormSelectComponentOption[] = null;
    form: FormGroup;

    constructor(private tyrionBackendService: TyrionBackendService, private formBuilder: FormBuilder, protected notificationService: NotificationService) {

        this.form = this.formBuilder.group({
            'selected_version': ['', [Validators.required]],
            'planed_date': ['', []],    // TODO
            'planed_time': ['', []],    // TODO
            'planed_time_zone_offset': ['', []], // TODO
        });
    }

    ngOnInit() {

        console.info('URL: ', this.modalModel.homer_server.server_url);
        console.info('PORT: ', this.modalModel.homer_server.rest_api_port);
        console.info('http://' + this.modalModel.homer_server.server_url + (this.modalModel.homer_server.rest_api_port !== null  ? `:` + this.modalModel.homer_server.rest_api_port : ``) + `/v1` + `/versions/available_versions`);
        setTimeout(() => {
            this.tyrionBackendService.serverServerGetListAvailableVersions(this.modalModel.homer_server)
                .then((versions: IAvailableVersion[]) => {
                    this.options_available_version = versions.map((version) => {
                        return {
                            label: version.tag,
                            value: version.tag
                        };
                    });
                })
                .catch((reason: IError) => {
                    this.notificationService.fmError(reason);
                    console.error(reason);
                    this.onCancelClick();
                });
        }, 100);
    }

    onSubmitClick(): void {

        // TODO zpracování času [TZ]
        this.tyrionBackendService.homerServerUpdateToNewVersion(this.modalModel.homer_server, {
            tag: this.form.controls['selected_version'].value,
            time: 0
        })
            .then(() => {
                this.onCloseClick();
            })
            .catch((reason: IError) => {
                this.notificationService.fmError(reason);
                console.error(reason);
                this.onCancelClick();
            });
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
