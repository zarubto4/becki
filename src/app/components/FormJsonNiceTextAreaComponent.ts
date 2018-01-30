/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';

@Component({
    selector: 'bk-form-nice-json',
    /* tslint:disable:max-line-length */
    template: `
        <div class="form-group" [class.has-success]="!readonly && !control && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)" [class.has-error]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)" [class.has-warning]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)">
            <label>{{description}}</label>
            <div class="input-icon right">
                <i class="fa fa-check" *ngIf="!readonly && !control && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)"></i>
                <i class="fa fa-warning" *ngIf="!readonly && !control && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)"></i>
                <i class="fa fa-spinner fa-spin" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)"></i>
                <textarea *ngIf="!readonly" [formControl]="control" [(ngModel)]='content' rows="{{row}}" cols="{{cols}}" [style.max-width]="maxWidth"></textarea>
                <textarea *ngIf="readonly" [(ngModel)]='content' [readonly]="readonly" rows="{{row}}" cols="{{cols}}" [style.max-width]="maxWidth"></textarea>
            </div>
            <span class="help-block" *ngIf="!readonly && !control && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)">{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
        </div>
    `
    /* tslint:enable */
})
export class FormJsonNiceTextAreaComponent implements OnInit {

    @Input()
    maxWidth: string = null;

    @Input()
    control: AbstractControl = null;

    @Input()
    description: string = '';

    @Input()
    row: number = 4;

    @Input()
    cols: number = 50;

    @Input()
    content: string = '{}';

    @Input()
    placeholder: string = null;

    @Input()
    type: string = 'text';

    @Input()
    readonly: boolean = false;

    @Input()
    waitForTouch: boolean = true;

    flag: boolean = true;

    constructor(public validatorErrorsService: ValidatorErrorsService) {
    }

    ngOnInit() {

        try {
            let obj = JSON.parse(this.content);
            this.content = JSON.stringify(obj, null, 2);
        }catch (e) {
            this.content = JSON.stringify('[]', null, 2);
        }
    }


}
