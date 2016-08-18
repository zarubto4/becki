/**
 * Created by davidhradek on 04.08.16.
 */

import {Component, Input} from "@angular/core";
import {AbstractControl, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {ValidatorErrorsService} from "../services/ValidatorErrorsService";

@Component({
    selector: "becki-form-input",
    directives: [REACTIVE_FORM_DIRECTIVES],
    template: `
<div class="form-group" [class.has-success]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)" [class.has-error]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)" [class.has-warning]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)">
    <label>{{label}}</label>
    <div class="input-icon right">
        <i class="fa fa-check" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)"></i>
        <i class="fa fa-warning" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)"></i>
        <i class="fa fa-spinner fa-spin" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)"></i>
        <input class="form-control" [attr.type]="type" [attr.placeholder]="(placeholder?placeholder:label)" [formControl]="control" [readonly]="readonly">
    </div>
    <span class="help-block" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)">{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
</div>
`
})
export class BeckiFormInput {

    @Input()
    control:AbstractControl = null;

    @Input()
    label:string = "Unknown label";

    @Input()
    placeholder:string = null;

    @Input()
    type:string = "text";

    @Input()
    readonly:boolean = false;

    @Input()
    waitForTouch:boolean = true;

    constructor(protected validatorErrorsService:ValidatorErrorsService) {}

}