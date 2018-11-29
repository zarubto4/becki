/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
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

        <div class="col-md-6">
            <h4 *ngIf="labelComment" [innerHTML]="left_label"></h4>
            <div class="table-scrollable table-scrollable-borderless">
                <table  class="table table-hover table-light  " style="border-collapse: separate;">
                    <thead>
                        <tr>
                            <td class="col col-lg-10"></td>
                            <td class="col col-lg-2"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let item of options_left">
                            <style type="text/css">
                                table tr button {
                                    opacity: 0.05;
                                }
                                table tr:hover button {
                                    opacity: 1
                                }
                            </style>
                            <td class="vert-align no-wrap">
                                {{item.label}}
                            </td>
                            <td class="vert-align">
                                <button class="btn btn-icon-only btn-default" (click)="command_right(item.value)">
                                    <i class="fa fa-caret-right"></i>&nbsp;
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="col-md-6">
            <h4 *ngIf="labelComment" [innerHTML]="right_label"></h4>
            <div class="table-scrollable table-scrollable-borderless">
                <table  class="table table-hover table-light  " style="border-collapse: separate;">
                    <thead>
                    <tr>
                        <td class="col col-lg-2"></td>
                        <td class="col col-lg-10"></td>
                    </tr>
                    </thead>
                    <tbody >
                    <tr *ngFor="let item of options_right">
                        <style type="text/css">
                            table tr button {
                                opacity: 0.05;
                            }
                            table tr:hover button {
                                opacity: 1
                            }
                        </style>
                        <td class="vert-align">
                            <button class="btn btn-icon-only btn-default" (click)="command_left(item.value)">
                                <i class="fa fa-caret-left"></i>&nbsp;
                            </button>
                        </td>
                        <td class="vert-align no-wrap">
                            {{item.label}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
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

    constructor(public validatorErrorsService: ValidatorErrorsService) {
    }

    ngOnInit(): void {

    }

    command_right(value: string) {
        for (let i: number = this.options_left.length - 1; i >= 0; i--) {
            if (this.options_left[i].value === value) {
                this.options_right.push(this.options_left[i]);
                this.options_left.splice(i, 1);
            }
        }
    }

    command_left(value: string) {
        for (let i: number = this.options_right.length - 1; i >= 0; i--) {
            if (this.options_right[i].value === value) {
                this.options_left.push(this.options_right[i]);
                this.options_right.splice(i, 1);
            }
        }
    }

    get_left(): FormSelectComponentOption[] {
        return this.options_left;
    }

    get_right(): FormSelectComponentOption[] {
        return this.options_right;
    }

}
