/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';

@Component({
    selector: 'bk-form-input',
/* tslint:disable:max-line-length */
    template: `
<div class="form-group"
     [class.has-success]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)"
     [class.has-error]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)"
     [class.has-warning]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)">
    <label *ngIf="showLabel" [innerHTML]="label"></label>

    <div [class.input-group]="showButton != null">

        <div class="input-icon right">
            <i *ngIf="icon != null" class="fa {{icon}} fa-fw"></i>

            <i class="right fa fa-check" *ngIf="icon == null && !readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)"></i>
            <i class="right fa fa-warning" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)"></i>
            <i class="right fa fa-spinner fa-spin" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)"></i>

            <button *ngIf="showPasswordVisible"
                    [class.showPasswordBtnRight]="icon!= null"
                    [class.showPasswordBtnLeft]="icon == null"
                    type="button"
                    (click)="onBtnShowPassword()"><i [class]="type==='password'? 'fa fa-eye' : ' fa fa-eye-slash'"></i>
            </button>


            <input  *ngIf="control" class="form-control"
                   (keydown)="onEnter($event)"
                   (ngModelChange)="onSelectedChange($event)"
                   [class.input-small]="widthSize == 'small'"
                   [class.input-medium]="widthSize == 'medium'"
                   [class.input-xlarge]="widthSize == 'large'"
                   [class.input-fluid]="widthSize == 'fluid'"
                   [attr.type]="type"
                   [attr.placeholder]="(placeholder?placeholder:'')"
                   [readonly]="readonly"
                   [formControl]="control"
                   >

            <input *ngIf="!control" class="form-control"
                   (keydown)="onEnter($event)"
                   (ngModelChange)="onSelectedChange($event)"
                   [class.input-small]="widthSize == 'small'"
                   [class.input-medium]="widthSize == 'medium'"
                   [class.input-xlarge]="widthSize == 'large'"
                   [class.input-fluid]="widthSize == 'fluid'"
                   [attr.type]="type"
                   [attr.placeholder]="(placeholder?placeholder:'')"
                   [readonly]="readonly">

        </div>

        <span *ngIf="showButton != null" class="input-group-btn">
               <button class="btn"
                       [class.red-sunglo]="showButton.colorType=='REMOVE'"
                       [class.yellow-crusta]="showButton.colorType=='EDIT' || showButton.colorType=='UPDATE'"
                       [class.blue-madison]="showButton.colorType=='ACTIVE'"
                       [class.purple-plum]="showButton.colorType=='DEACTIVE'"
                       [class.blue]="showButton.colorType=='ADD' || showButton.colorType=='CREATE'"
                       [class.grey-cascade]="showButton.colorType == '' || showButton.colorType == null"
                       type="button"
                       (click)="onBtnClick()">
                       <i class="fa {{showButton.btn_icon}} fa-fw"></i> {{showButton.btn_label_for_person}}
                </button>
        </span>


    </div>
    <span class="help-block" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)" >{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
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
    icon: string = null;

    @Input()
    showButton: {
        btn_label_for_person: string,
        colorType?: ('ADD'| 'EDIT' | 'UPDATE' | 'CREATE' | 'REMOVE' | 'ACTIVE' | 'DEACTIVE'),
        btn_icon: string
    } = null;

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

    @Output()
    onBtnClickEvent: EventEmitter<any> = new EventEmitter<any>();

    showPasswordVisible: boolean;

    constructor(public validatorErrorsService: ValidatorErrorsService, private formBuilder: FormBuilder) {
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

        if (this.control == null) {
            console.info('FormInputComponent is null');
            let form: FormGroup = this.formBuilder.group({
                'value': ['']
            });

            this.control = form.controls['value'];
        }

        if (this.type === 'password') {
            this.showPasswordVisible = true;
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

    onBtnClick() {
        this.onBtnClickEvent.emit(true);
    }

    onBtnShowPassword() {
        if (this.type === 'password') {
            this.type = 'text';
        } else {
            this.type = 'password';
        }
    }
}
