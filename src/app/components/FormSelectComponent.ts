/**
 * Created by davidhradek on 17.08.16.
 */

import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';

export let formSelectComponentOptionsMaker = (objects: any[], valueFieldName: string, labelFieldName: string, interactive: boolean = false): FormSelectComponentOption[] => {
    // console.log('beckiFormSelectOptionsMaker called');
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
    <select class="form-control" [formControl]="control"> 
      <option *ngIf="!pickFirstOption" value="" disabled>{{(placeholder?placeholder:label)}}</option> 
      <option *ngFor="let option of options" [value]="option.value">{{option.label}}</option>
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
    label: string = 'Unknown label';

    @Input()
    labelComment: boolean = true;

    @Input()
    placeholder: string = null;

    @Input()
    waitForTouch: boolean = true;

    @Input()
    readonly: boolean = false;

    @Input()
    regexFirstOption:  string  = null;

    @Input()
    pickFirstOption: boolean = null;

    private _options: FormSelectComponentOption[] = [];

    @Input() set options(option: FormSelectComponentOption[]) {
        if (option) {
            this._options = option;
            if (this.pickFirstOption) {
                let toPick: number = 0;
                if (this.regexFirstOption) {
                    toPick = option.findIndex(item => {
                        if (item.label.match(this.regexFirstOption)) {
                            console.log(item);
                            return true;
                        }
                    });
                }
                this.control.setValue(option[toPick].value);
            }
        }
    }

    get options(): FormSelectComponentOption[] {
        return this._options;
    }

    constructor(public validatorErrorsService: ValidatorErrorsService) {

    }

}
