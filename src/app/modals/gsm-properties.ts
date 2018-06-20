/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption, formSelectComponentOptionsMaker } from '../components/FormSelectComponent';
import { IGSM } from '../backend/TyrionAPI';
import { BeckiValidators } from '../helpers/BeckiValidators';

export class ModalsGsmPropertiesModel extends ModalModel {
    constructor (public gsm: IGSM) {
        super();
    }
}

@Component({
    selector: 'bk-modals-gsm-properties',
    templateUrl: './gsm-properties.html'
})
export class ModalsGsmPropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsGsmPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options: FormSelectComponentOption[] = null;

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {

        let input: { [key: string]: any } = {
            'name': [this.modalModel.gsm.name, [Validators.maxLength(32)]],
            'description': [this.modalModel.gsm.description, [Validators.maxLength(255)]],
            'total_traffic_threshold': [this.modalModel.gsm.total_traffic_threshold ? this.modalModel.gsm.total_traffic_threshold : 0, [Validators.required, BeckiValidators.number, Validators.maxLength(12)]],
            'monthly_traffic_threshold': [this.modalModel.gsm.monthly_traffic_threshold ? this.modalModel.gsm.monthly_traffic_threshold : 0, [Validators.required, BeckiValidators.number, Validators.maxLength(12)]],
            'daily_traffic_threshold': [this.modalModel.gsm.daily_traffic_threshold ? this.modalModel.gsm.daily_traffic_threshold : 0, [Validators.required, BeckiValidators.number, Validators.maxLength(12)]],
            'tags': [this.modalModel.gsm.tags]
        };

        this.form = this.formBuilder.group(input);
    }



    onSubmitClick(): void {
        this.modalModel.gsm.name = this.form.controls['name'].value;
        this.modalModel.gsm.description = this.form.controls['description'].value;
        this.modalModel.gsm.tags = this.form.controls['tags'].value;
        this.modalModel.gsm.total_traffic_threshold = this.form.controls['total_traffic_threshold'].value;
        this.modalModel.gsm.monthly_traffic_threshold = this.form.controls['monthly_traffic_threshold'].value;
        this.modalModel.gsm.daily_traffic_threshold = this.form.controls['daily_traffic_threshold'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
