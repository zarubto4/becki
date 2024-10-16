

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';

@Component({
    selector: 'bk-form-text-area',
/* tslint:disable:max-line-length */
    template: `
<div class="form-group" [class.has-success]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)" [class.has-error]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)" [class.has-warning]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)">
    <label *ngIf="labelComment">{{label}}</label>
    <div class="input-icon right">
        <i class="fa fa-check" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)"></i>
        <i class="fa fa-warning" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)"></i>
        <i class="fa fa-spinner fa-spin" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)"></i>
        <textarea rows="{{row}}" cols="{{cols}}"  class="form-control" [attr.type]="type" [attr.placeholder]="(placeholder?placeholder:label)"  (ngModelChange)="onSelectedChange($event)"  [formControl]="control" [readonly]="readonly"></textarea>
    </div>
    <span class="help-block" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)">{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
</div>
`
/* tslint:enable */
})
export class FormTextAreaComponent {

    @Input()
    control: AbstractControl = null;

    @Input()
    row: number = 4;

    @Input()
    cols: number = 50;

    @Input()
    label: string = '';

    @Input()
    labelComment: boolean = true;

    @Input()
    placeholder: string = null;

    @Output()
    valueChange: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    type: string = 'text';

    @Input()
    readonly: boolean = false;

    @Input()
    waitForTouch: boolean = true;

    constructor(public validatorErrorsService: ValidatorErrorsService) {
    }


    onSelectedChange(newValue: string) {
        if (!this.readonly) {
            this.valueChange.emit(newValue);
        }
    }
}
