/**
 * Created by dominik on 20.04.17.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { IHardware, IHomerServer, IHomerServerList } from '../backend/TyrionAPI';
import { FlashMessageSuccess } from '../services/NotificationService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { TranslationService } from '../services/TranslationService';


export class ModalsHardwareChangeServerModel extends ModalModel {
    constructor(public board: IHardware) {
        super();
    }
}

@Component({
    selector: 'bk-modals-hardware-change-server',
    templateUrl: './hardware-change-server.html'
})
export class ModalsHardwareChangeServerComponent implements OnInit {

    @Input()
    modalModel: ModalsHardwareChangeServerModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    tab: ('manual' | 'selector') = 'selector';
    les: boolean = true;
    error_message: string = null;

    servers: IHomerServer[] = null;
    servers_options: FormSelectComponentOption[] = null;

    constructor(public backendService: TyrionBackendService, private formBuilder: FormBuilder, public translationService: TranslationService) {
        this.form = this.formBuilder.group({
            'serverSelector': ['', [BeckiValidators.condition(() => (this.tab === 'selector'), Validators.required)]],
            'serverUrl': ['', [BeckiValidators.condition(() => (this.tab === 'manual'), Validators.required), Validators.maxLength(31), Validators.minLength(8)]],      // TODO Valid URL alpha.homer.stage.byzance.cz
            'serverPort': [0, [BeckiValidators.condition(() => (this.tab === 'manual'), Validators.required)]]
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['serverPort'])).setValue(1881);
        (<FormControl>(this.form.controls['serverSelector'])).setValue('');
        (<FormControl>(this.form.controls['serverUrl'])).setValue('');
        this.findAllAccessibleServers();
    }

    onToggleHardwareTab(tab: ('manual' | 'selector')) {

        if (tab === 'selector' && this.servers == null) {
            this.findAllAccessibleServers();
        }

        this.tab = tab;

        this.form.controls['serverSelector'].updateValueAndValidity();
        this.form.controls['serverUrl'].updateValueAndValidity();
        this.form.controls['serverPort'].updateValueAndValidity();
    }

    findAllAccessibleServers(): void {
        this.backendService.homerServersGetList(0, {
            project_id : this.modalModel.board.project_id,
            server_types : ['PUBLIC', 'PRIVATE', 'MAIN']
        })
            .then((servers: IHomerServerList) => {
                this.servers = servers.content;
                this.servers_options = this.servers.map((pv) => {
                    let status = this.translationService.translateTable(pv.server_type, this, 'server_type');

                    if (this.modalModel.board.server.id === pv.id) {
                        status += ' - ' + this.translationService.translateTable('ALREADY_ON', this, 'server_type') + '!!';
                    }
                    return {
                        label: pv.name + ' - ' + status,
                        value: pv.id,
                    };
                });
            })
            .catch((reason) => {
                this.error_message = reason;
            });
    }

    onRedirectClick(): void {
        this.error_message = null; // Reset Values
        this.backendService.boardChangeserver(this.modalModel.board.id, {
            server_id: this.tab === 'selector' ? this.form.controls['serverSelector'].value : null,
            server_port: this.tab === 'manual' ? this.form.controls['serverPort'].value : null,
            server_url: this.tab === 'manual' ? this.form.controls['serverUrl'].value : null,
        }).then(() => {
            this.onSubmitClick();
        }).catch((reason) => {
            this.error_message = reason;
        });
    }

    onSubmitClick(): void {
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
