
import { IMyDpOptions, IMyDate, IMyDateModel } from 'mydatepicker';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { ConsoleSourceColor } from './ConsoleLogComponent';

/* tslint:disable:no-console max-line-length */
@Component({
    selector: 'bk-time-picker',
    template: `
        <div class="form-group" [class.has-success]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)" [class.has-error]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)" [class.has-warning]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)">
            <label *ngIf="labelEnabled">{{label}}</label>
            <div class="input-group">
                <input type="text" [readonly]="readonly" maxlength="5" [value]="hour+':'+minute" [formControl]="control"
                       placeholder="{{placeholder}}" class="form-control timepicker timepicker-no-seconds">
                <span class="input-group-btn">
            <button (click)="changeOpen()" class="btn default" type="button">
                <i class="fa fa-clock-o"></i>
            </button>
        </span>
            </div>
            <div *ngIf="open"
                 style="transition: color 1s ease-in-out; padding: 4px; box-shadow: 5px 5px rgba(102,102,102,.1); min-width: 100px;  position: absolute; border-color: #eee;  background: white; white-space: nowrap;  z-index: 500; "
                 class="col-md-1 text-center border">
                <table>
                    <tbody class="noselect">
                    <tr>
                        <td style="width: 25px;">
                            <a (click)="incrementHour()">
                                <span class="fa fa-angle-up"></span>
                            </a>
                        </td>
                        <td style="width: 25px;" class="separator">&nbsp;</td>
                        <td style="width: 25px;">
                            <a (click)="incrementMinute()">
                                <span class="fa fa-angle-up"></span>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 25px;">
                            <input type="text" disabled="true" class="time-picker-input" [value]="hour" maxlength="2">
                        </td>
                        <td style="width: 25px;" class="separator">:</td>
                        <td style="width: 25px;">
                            <input type="text" class="time-picker-input" disabled="true" [value]="minute" maxlength="2">
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 25px; border: thin">
                            <a (click)="decrementHour()" data-action="decrementMinute">
                                <span class="fa fa-angle-down"></span>
                            </a>
                        </td>
                        <td style="width: 25px;" class="separator"></td>
                        <td style="width: 25px;">
                            <a (click)="decrementMinute()">
                                <span class="fa fa-angle-down"></span>
                            </a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <span class="help-block" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)">{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
        </div>
    `
})
/* tslint:enable:no-console max-line-length */
export class TimePickerComponent {
    currentdate = new Date();

    @Input()
    control: AbstractControl = null;

    @Input()
    label: string = '';

    @Input()
    labelEnabled: boolean = true;

    @Input()
    placeholder: string = this.currentdate.getHours() + ':' + (this.currentdate.getMinutes());

    @Input()
    readonly: boolean = false;

    @Input()
    waitForTouch: boolean = true;

    open: boolean = false;

    minute: string = '' + (this.currentdate.getMinutes() + 2);

    hour: string = '' + this.currentdate.getHours();

    changeOpen() {
        this.open = !this.open;
    }


    OnOutsideClick(event: any) {
        if (event.value && this.open) {
            this.open = !this.open;
        }
    }

    addZero(num: number): string {
        let corrected = ('0' + num).slice(-2);


        return corrected;
    }

    updateControl() {
        this.control.setValue(this.hour + ':' + this.minute);

    }

    incrementHour() {
        let h = Number(this.hour);
        h++;
        if (h > 23) {
            h = 0;
        }

        this.hour = this.addZero(h);
        this.updateControl();
    }
    incrementMinute() {
        let m = Number(this.minute);
        m++;
        if (m > 59) {
            m = 0;
            this.incrementHour();

        }
        this.minute = this.addZero(m);
        this.updateControl();


    }
    decrementHour() {
        let h = Number(this.hour);
        h--;
        if (h < 0) {
            h = 23;
        }

        this.hour = this.addZero(h);
        this.updateControl();


    }
    decrementMinute() {
        let m = Number(this.minute);
        m--;
        if (m < 0) {
            m = 59;
            this.decrementHour();
            this.updateControl();

        }

        this.minute = this.addZero(m);

    }

    constructor(public validatorErrorsService: ValidatorErrorsService) {

    }

}
