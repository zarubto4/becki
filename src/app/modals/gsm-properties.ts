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
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';

export class ModalsGsmPropertiesModel extends ModalModel {
    constructor (public project_id: string, public gsm: IGSM) {
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

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        /* tslint:disable:max-line-length */
        let input: { [key: string]: any } = {
            'name': [this.modalModel.gsm != null ? this.modalModel.gsm.name : this.modalModel.gsm.id,
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.gsm && this.modalModel.gsm.name.length > 3 && this.modalModel.gsm.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'GSM',  this.modalModel.project_id)
                )
            ],
            'description': [this.modalModel.gsm != null ? this.modalModel.gsm.description : '', [Validators.maxLength(255)]],
            'total_traffic_threshold': [this.modalModel.gsm.sim_tm_status.total_traffic_threshold ? this.onMathRound(this.modalModel.gsm.sim_tm_status.total_traffic_threshold) : 0, [Validators.required, BeckiValidators.number, Validators.maxLength(12)]],
            'monthly_traffic_threshold': [this.modalModel.gsm.sim_tm_status.monthly_traffic_threshold ? this.onMathRound( this.modalModel.gsm.sim_tm_status.monthly_traffic_threshold) : 0, [Validators.required, BeckiValidators.number, Validators.maxLength(12)]],
            'daily_traffic_threshold': [this.modalModel.gsm.sim_tm_status.daily_traffic_threshold ? this.onMathRound(this.modalModel.gsm.sim_tm_status.daily_traffic_threshold) : 0, [Validators.required, BeckiValidators.number, Validators.maxLength(12)]],
            'tags': [this.modalModel.gsm != null ? this.modalModel.gsm.tags : ''],
        };
        /* tslint:enable:max-line-length */

        this.form = this.formBuilder.group(input);
    }

    onMathRound(num: number): string {

        if (num === 0) {
            return '0';
        }

        return '' + Math.round((num / 1024 / 1024) * 100) / 100;
    }


    onSubmitClick(): void {
        this.modalModel.gsm.name = this.form.controls['name'].value;
        this.modalModel.gsm.description = this.form.controls['description'].value;
        this.modalModel.gsm.tags = this.form.controls['tags'].value;
        this.modalModel.gsm.sim_tm_status.total_traffic_threshold = this.form.controls['total_traffic_threshold'].value;
        this.modalModel.gsm.sim_tm_status.monthly_traffic_threshold = this.form.controls['monthly_traffic_threshold'].value;
        this.modalModel.gsm.sim_tm_status.daily_traffic_threshold = this.form.controls['daily_traffic_threshold'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
