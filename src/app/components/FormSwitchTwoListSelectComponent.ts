/**
 * Created by davidhradek on 17.08.16.
 */

import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { FormSelectComponentOption } from './FormSelectComponent';
import { MultiSelectComponent } from './MultiSelectComponent';

@Component({
    selector: 'bk-form-two-switch-list-select',
/* tslint:disable */
    template: `
<div>
    <div class="row">
        <div class="col-md-5">
            <h4 *ngIf="labelComment" [innerHTML]="left_label"></h4>
            <bk-multi-select [items]="options_left" #left [labelComment]="false"></bk-multi-select>
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
            <bk-multi-select [items]="options_right" #right [labelComment]="false"></bk-multi-select>
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
    labelComment: boolean = true;

    @Input()
    size: number = 5;

    @Input()
    waitForTouch: boolean = true;

    @Input()
    readonly: boolean = false;

    @Input()
    options_left: FormSelectComponentOption[] = [];

    @Input()
    options_right: FormSelectComponentOption[] = [];

    @ViewChild('right')
    right: MultiSelectComponent;

    @ViewChild('left')
    left: MultiSelectComponent;

    constructor(public validatorErrorsService: ValidatorErrorsService) {
    }

    ngOnInit(): void {

    }

    command_right() {
        let c: FormSelectComponentOption[] = this.left.getAndRemoveSelectedItems();
        this.right.addItems(c);
    }

    command_left() {
        let c: FormSelectComponentOption[] = this.right.getAndRemoveSelectedItems();
        this.left.addItems(c);
    }

    get_left(): FormSelectComponentOption[] {
        return this.left.items;
    }

    get_right(): FormSelectComponentOption[] {
        return this.right.items;
    }

}
