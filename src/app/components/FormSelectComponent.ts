/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Component, EventEmitter, Output, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';

export let formSelectComponentOptionsMaker = (objects: any[], valueFieldName: string, labelFieldName: string, interactive: boolean = false): FormSelectComponentOption[] => {
    if (!Array.isArray(objects)) {
        throw new Error('formSelectComponentOptionsMaker first param must be array');
    }

    let out: FormSelectComponentOption[] = [];

    objects.forEach((o: any) => {
        let v: string = null;
        let l: string = null;
        if (typeof o[valueFieldName] === 'string' || typeof o[valueFieldName] === 'number') {
            v = '' + o[valueFieldName];
        }
        if (interactive) {
            l = labelFieldName;
            for (let k in o) {
                if (!o.hasOwnProperty(k)) { continue; }
                l = l.replace(new RegExp('%' + k + '%', 'g'), o[k]);
            }
        } else {
            if (typeof o[labelFieldName] === 'string' || typeof o[labelFieldName] === 'number') {
                l = '' + o[labelFieldName];
            }
        }
        if (v != null && l != null) {
            out.push({
                value: v,
                label: l
            });
        }
    });

    return out;
};

export interface FormSelectComponentOption {
    value: string;
    label: string;
    data?: any;
}

@Component({
    selector: 'bk-form-select',
    /* tslint:disable:max-line-length */
    template: `
<div class="form-group" [class.has-success]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)" [class.has-error]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)" [class.has-warning]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)">
    <label *ngIf="labelComment" [innerHTML]="label"></label>
    <select class="form-control" [formControl]="control" [ngModel]="selectedValue" (ngModelChange)="onSelectedChange($event)">
      <template [ngIf]="_options">
         <option *ngFor="let option of _options" [value]="option.value">{{option.label}}</option>
      </template>
    </select>
    <span class="help-block" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)">{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
</div>
`
    /* tslint:enable */
})
export class FormSelectComponent {

    @Input()
    control: AbstractControl = null;

    @Input()
    label: string = 'Select one';

    @Input()
    labelComment: boolean = true;

    @Input()
    placeholder: string = null;

    @Input()
    waitForTouch: boolean = true;

    @Input()
    readonly: boolean = false;

    @Input()
    regexFirstOption: string = null;

    @Input()
    positionFirstOption: number = null;

    firstSelect: boolean = true;
    selectedValue: string = null;

    @Output()
    valueChanged: EventEmitter<string> = new EventEmitter<string>();


    private _options: FormSelectComponentOption[] = [];

    @Input()
    set options(option: FormSelectComponentOption[]) {
        if (option && option.length > 0) {

            if (this.regexFirstOption) {

                console.info('FormSelectComponent: Regex: ', this.regexFirstOption);
                console.info('FormSelectComponent: Option: ', option);

                let toPick: number = 0;

                toPick = option.findIndex(item => {
                    if (item.value.match(this.regexFirstOption) || item.label.match(this.regexFirstOption)) {
                        return true;
                    }
                });

                console.info('FormSelectComponent: TO Pick: ', toPick);

                if (toPick === -1) {
                    this.selectedValue = option[0].value;
                    this.control.setValue(option[0].value);
                } else {

                    this.selectedValue = option[toPick].value;
                    this.control.setValue(option[toPick].value);

                    console.info('FormSelectComponent: This Selected Value' , this.selectedValue );
                }
            } else if (this.positionFirstOption && this.positionFirstOption > -1 && this.positionFirstOption < option.length) {

                this.selectedValue = option[this.positionFirstOption].value;
                this.control.setValue(option[this.positionFirstOption].value);

            } else {

                if (option.length > 0) {
                    // console.log("options:: pickFirstOption selected ");
                    this.selectedValue = option[0].value;
                    this.control.setValue(option[0].value);
                }
            }

            this._options = option;
        } else {
            console.error('options is empty');
        }
    }

    onSelectedChange(newValue: string) {

        this.control.updateValueAndValidity();

        console.info('onSelectedChange:', newValue);

        // Select first
        if (newValue == null) {
            return;
        }

        if (this.firstSelect && newValue != null) {
            console.info('this.firstSelect && newValue != null');
            this.firstSelect = false;
            this.valueChanged.emit(newValue);
            return;
        }

        if (this.selectedValue === newValue) {
            console.info('onSelectedChange:: this.selectedValue === newValue ');
            return;
        }

        this.selectedValue = newValue;
        console.info('callEmit with:', this.selectedValue );

        this.valueChanged.emit(newValue);
    }

    constructor(public validatorErrorsService: ValidatorErrorsService) {

    }

}
