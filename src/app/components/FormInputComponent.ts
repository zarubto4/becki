/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';

@Component({
    selector: 'bk-form-input',
    /* tslint:disable:max-line-length */
    template: `
        <div class="form-group"
             [class.has-success]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)"
             [class.has-error]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)"
             [class.has-warning]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)">
            <label *ngIf="showLabel">{{label}}</label>
            <div class="input-icon right">

                <i class="fa fa-check"
                   *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)"></i>
                <i class="fa fa-warning"
                   *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)"></i>
                <i class="fa fa-spinner fa-spin"
                   *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)"></i>

                <input *ngIf="control" class="form-control"
                       (keydown)="onEnter($event)"
                       (ngModelChange)="onSelectedChange($event)"
                       [class.input-small]="widthSize == 'small'"
                       [class.input-medium]="widthSize == 'medium'"
                       [class.input-xlarge]="widthSize == 'large'"
                       [attr.type]="type"
                       [attr.placeholder]="(placeholder?placeholder:label)"
                       [readonly]="readonly"
                       [formControl]="control"
                >

                <input *ngIf="!control" class="form-control"
                       (keydown)="onEnter($event)"
                       (ngModelChange)="onSelectedChange($event)"
                       [class.input-small]="widthSize == 'small'"
                       [class.input-medium]="widthSize == 'medium'"
                       [class.input-xlarge]="widthSize == 'large'"
                       [attr.type]="type"
                       [attr.placeholder]="(placeholder?placeholder:label)"
                       [readonly]="readonly">

            </div>
            <span class="help-block"
                  *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)">{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
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

    @Output()
    valueChange: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    onEnterEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(public validatorErrorsService: ValidatorErrorsService) {
    }

    ngOnInit() {
        if (!this.readonly) {
            // Not wait for tuch if control.value is not null (for example edit)
            if (this.waitForTouch) {
                if (this.control !== null && this.control.value !== null && this.control.value !== '') {
                    this.waitForTouch = false;
                }
            }
        }
    }

    onEnter(event: any) {
        if (!this.readonly) {
            if (event.keyCode === 13) {
                this.onEnterEvent.emit(event);
            }
        }
    }

    onSelectedChange(newValue: string) {
        if (!this.readonly) {
            this.valueChange.emit(newValue);
        }
    }

}
