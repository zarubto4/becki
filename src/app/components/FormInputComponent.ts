/**
 * Created by davidhradek on 04.08.16.
 */

import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';

@Component({
    selector: 'bk-form-input',
/* tslint:disable:max-line-length */
    template: `
<div class="form-group" [class.has-success]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)" [class.has-error]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)" [class.has-warning]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)">
    <label *ngIf="showLabel">{{label}}</label>
    <div class="input-icon right">
        <i class="fa fa-check" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)"></i>
        <i class="fa fa-warning" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)"></i>
        <i class="fa fa-spinner fa-spin" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)"></i>
        <input class="form-control" [class.input-small]="widthSize == 'small'" [class.input-medium]="widthSize == 'medium'" [class.input-xlarge]="widthSize == 'large'" [attr.type]="type" [attr.placeholder]="(placeholder?placeholder:label)" [formControl]="control" [readonly]="readonly">
    </div>
    <span class="help-block" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)">{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
</div>
`
/* tslint:enable */
})
export class FormInputComponent implements OnInit {

    @Input()
    control: AbstractControl = null;

    @Input()
    label: string = 'Unknown label';

    @Input()
    placeholder: string = null;

    @Input()
    type: string = 'text';

    @Input()
    showLabel: boolean = true;

    @Input()
    readonly: boolean = false;

    @Input()
    waitForTouch: boolean = true;

    @Input()
    widthSize: ('small' | 'medium' | 'large' | 'fluid') = 'fluid';  // Fluid - from left to right 100% content

    constructor(public validatorErrorsService: ValidatorErrorsService) {
    }

    ngOnInit() {
        // Not wait for tuch if control.value is not null (for example edit)
        if (this.waitForTouch) {
            if (this.control !== null && this.control.value !== null && this.control.value !== '') {
                this.waitForTouch = false;
            }
        }

    }

}
