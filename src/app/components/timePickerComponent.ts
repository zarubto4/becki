
import { IMyDpOptions, IMyDate, IMyDateModel } from 'mydatepicker';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { BeckiValidators } from '../helpers/BeckiValidators';


@Component({
    selector: 'bk-time-picker',
    templateUrl: './timePickerComponent.html'
})

export class TimePickerComponent {
    currentdate = new Date();

    @Input()
    control: AbstractControl = null;

    @Input()
    label: string = '';

    @Input()
    placeholder: string = this.currentdate.getHours() + ':' + (this.currentdate.getMinutes() + 2);

    @Input()
    readonly: boolean = false;

    open: boolean = false;

    minute: string = '' + this.currentdate.getMinutes();

    hour: string = '' + this.currentdate.getHours();



    changeOpen() {
        this.open = !this.open;
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
