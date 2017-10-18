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
import { FlashMessageError } from '../services/NotificationService';


export class ModalsAddHardwareModel extends ModalModel {
    constructor(
        public project_id: string,
        public deviceGroup: IBoardGroup[] = []
    ) {
        super();
    }
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

    form: FormGroup;

    multiForm: FormGroup;

    multiErrorList: string[] = [];


    step: string = null;
    group_options_available: FormSelectComponentOption[] = []; // Select Groups

    @ViewChild('groupList')
    listGroup: MultiSelectComponent;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'id': ['', [Validators.required], BeckiAsyncValidators.hardwareDeviceId(backendService)],       // TODO DOminik - ID select this.step = 'singleRegistration'
        });

        this.multiForm = this.formBuilder.group({
            'listOfIds': ['', [Validators.required]] // TODO DOminik - ID select this.step = 'multipleRegistration'
        });


    }

    multipleRegistration() {
        this.step = 'multipleRegistration';
    }

    singleRegistration() {
        this.step = 'singleRegistration';
    }

    ngOnInit() {

        // Here are all in Device list
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
        this.multiErrorList = [];

        let groupIDs = this.listGroup.selectedItems.map(a => a.value);
        let data: string = this.multiForm.controls['listOfIds'].value;
        data.replace(' ', '');
        data.replace(',', ';');
        data.replace(/(?:\r\n|\r|\n)/g, '');
        data = data + ';';
        let devicesForRegistration: string[] = data.split(';');
        // devicesForRegistration = devicesForRegistration.filter(device => device.length === 24);
        devicesForRegistration.forEach(device => {
            this.backendService.boardConnectWithProject({ group_ids: groupIDs, hash_for_adding: device, project_id: this.modalModel.project_id })
                .then(() => {
                    this.multiErrorList.push('device ' + device + ' added');
                    devicesForRegistration.splice(devicesForRegistration.indexOf(device), 1);
                })
                .catch(reason => {
                    this.multiErrorList.push('cant add: ' + device + ' because ' + reason);
                }).then(() => {
                    this.multiForm.controls['listOfIds'].setValue(devicesForRegistration);
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

            });
    }

    onSubmitClick(): void {

        if (this.step === 'singleRegistration') {
            this.singleRegistaration();
        } else {
            this.sequenceRegistaration();
        }

        // Uzavření jen v případě úspěchu
        // Respektive - zde uděláme Rest Api na tyriona - zaregistrujeme HW, jeden nebo celý seznam.
        // Seznam uděláme for cyklem kdy vezmeme ID záznam ze stringu a ten zaregistrujeme - pokud se to povede odstraníme ho se zenamu
        // Pokud ne - vložíme ho do nového seznamu kde uděláme něco jako (Používáme chyby z Tyriona)
        // xxxxxxxxx: Already Registred
        // yyyyyyyyy: Not Found
        // ccccccccc: fjksadfhksdbfmnbsda,.mnfb

        // Toto zde nezavolám abych okno nezavřel - tedy až na konci když se podaří dokončit vše (registrace jednoho devicu nebo všech)
        // this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
