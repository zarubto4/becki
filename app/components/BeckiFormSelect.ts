/**
 * Created by davidhradek on 17.08.16.
 */

import {Component, Input} from "@angular/core";
import {AbstractControl, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {ValidatorErrorsService} from "../services/ValidatorErrorsService";

export var beckiFormSelectOptionsMaker = (objects:any[], valueFieldName:string, labelFieldName:string):BeckiFormSelectOption[] => {
    console.log("beckiFormSelectOptionsMaker called");
    if (!Array.isArray(objects)) throw "beckiFormSelectOptionsMaker first param must be array";

    var out:BeckiFormSelectOption[] = [];

    objects.forEach((o:any) => {
        var v:string = null;
        var l:string = null;
        if (typeof o[valueFieldName] == "string" || typeof o[valueFieldName] == "number") {
            v = ""+o[valueFieldName];
        }
        if (typeof o[labelFieldName] == "string" || typeof o[labelFieldName] == "number") {
            l = ""+o[labelFieldName];
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

export interface BeckiFormSelectOption {
    value:string,
    label:string
}

@Component({
    selector: "becki-form-select",
    directives: [REACTIVE_FORM_DIRECTIVES],
    template: `
<div class="form-group" [class.has-success]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)" [class.has-error]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)" [class.has-warning]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)">
    <label>{{label}}</label>
    <select class="form-control" [formControl]="control" [disabled]="readonly">
        <option value="" disabled>{{(placeholder?placeholder:label)}}</option>
        <option *ngFor="let option of options" [value]="option.value">{{option.label}}</option>
    </select>
    <span class="help-block" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)">{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
</div>
`
})
export class BeckiFormSelect {

    @Input()
    control:AbstractControl = null;

    @Input()
    label:string = "Unknown label";

    @Input()
    placeholder:string = null;

    @Input()
    readonly:boolean = false;

    @Input()
    waitForTouch:boolean = true;

    @Input()
    options:BeckiFormSelectOption[] = [];

    constructor(protected validatorErrorsService:ValidatorErrorsService) {}

}