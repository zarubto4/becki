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

    step: string = null;
    group_options_available: FormSelectComponentOption[] = []; // Select Groups

    @ViewChild('groupList')
    listGroup: MultiSelectComponent;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'id': ['', [Validators.required], BeckiAsyncValidators.hardwareDeviceId(backendService)],       // TODO DOminik - ID select this.step = 'singleRegistration'
            'listOfIds': ['', [Validators.required], BeckiAsyncValidators.hardwareDeviceId(backendService)] // TODO DOminik - ID select this.step = 'multipleRegistration'
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
        (<FormControl>(this.form.controls['listOfIds'])).setValue('');

    }

    sequenceRegistaration() {
        // Zde budeš registrovat sekvenšně ze seznamu
        // Pokaždé když registruješ ID ho odstraníš ze seznamu
        // Pokud je nějaký problém, Vypíšeš ID do nějakého nového text area a hlášku k tomu
    }

    singleRegistaration() {
        // Zde budeš registrovat jedno ID - a zavřeš modal
    }

    onSubmitClick(): void {


        // Uzavření jen v případě úspěchu
        // Respektive - zde uděláme Rest Api na tyriona - zaregistrujeme HW, jeden nebo celý seznam.
        // Seznam uděláme for cyklem kdy vezmeme ID záznam ze stringu a ten zaregistrujeme - pokud se to povede odstraníme ho se zenamu
        // Pokud ne - vložíme ho do nového seznamu kde uděláme něco jako (Používáme chyby z Tyriona)
        // xxxxxxxxx: Already Registred
        // yyyyyyyyy: Not Found
        // ccccccccc: fjksadfhksdbfmnbsda,.mnfb

        // Toto zde nezavolám abych okno nezavřel - tedy až na konci když se podaří dokončit vše (registrace jednoho devicu nebo všech)
        this.modalClose.emit(true);
    }

    // Zde registruji -- Tady asi nedává smysl registrovat Hash - ten vím že buĎ nemám nebo mám
    inRegistration() {

        // Seznam ID Skupiny
        let selectedGroupIdsList: string[] = [];
        this.listGroup.selectedItems.forEach((value: FormSelectComponentOption) => {
            selectedGroupIdsList.push(value.value);
        });


        this.backendService.boardConnectWithProject({
            group_ids: selectedGroupIdsList,
            hash_for_adding: 'xxxxxxxxx',
            project_id: this.modalModel.project_id
        })
            .then(() => {

                // Registruji jen jeden device - úspěšně zaregistrováno a tak můžu zavřít modal
                if (this.form.controls['id'].value != null ) {
                    this.modalClose.emit(true);
                }

                // Registurji seznam a tak pokračuji dokud není prázdný

            })
            .catch(reason => {
                // Zaznamenám chybu - pokud
            });
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
