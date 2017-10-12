/**
 * Created by davidhradek on 17.08.16.
 */

import {Component, Input, OnInit} from '@angular/core';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { FormSelectComponentOption } from './FormSelectComponent';

@Component({
    selector: 'bk-form-two-switch-list-select',
/* tslint:disable */
    template: `
<div>
    <div class="row">
        <div class="col-md-5">
            <h4 *ngIf="labelComment" [innerHTML]="left_label"></h4>
          
            <select multiple="" size="{{size}}"  style="width: 220px;">>
                <option *ngFor="let option of options_left" [value]="option.value">{{option.label}}</option>
            </select>
            
        </div>
        <div class="col-md-2 text-center" style="vertical-align:middle;">
            <br>
            <br>
            <br>
            <button class="btn btn-icon-only blue" (click)="command_right()"><i class="fa fa-chevron-right"></i></button>
            <button class="btn btn-icon-only red-flamingo" (click)="command_left()"><i class="fa fa-chevron-left"></i></button>
        </div>
        <div class="col-md-5">
            <h4 *ngIf="labelComment" [innerHTML]="right_label"></h4>
            <select multiple="" size="{{size}}" style="width: 220px;">
                <option *ngFor="let option of options_right" [value]="option.value">{{option.label}}</option>
            </select>
        </div>
    </div>
</div>
`
/* tslint:enable */
})
export class FormSwitchTwoListSelectComponent implements OnInit {

    @Input()
    left_label: string = 'Unknown label';

    @Input()
    right_label: string = 'Unknown label';

    @Input()
    size: number = 5;

    @Input()
    labelComment: boolean = true;

    @Input()
    waitForTouch: boolean = true;

    @Input()
    readonly: boolean = false;

    @Input()
    options_left: FormSelectComponentOption[] = [];

    @Input()
    options_right: FormSelectComponentOption[] = [];

    constructor(public validatorErrorsService: ValidatorErrorsService) {
    }

    ngOnInit(): void {

    }

    command_right(){

    }

    command_left(){

    }

}
