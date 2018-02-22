import { IMyDpOptions, IMyDate, IMyDateModel } from 'mydatepicker';
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
// other imports here...

@Component({
    selector: 'bk-date-picker',
    /* tslint:disable:max-line-length */
    template: /*[formControl]="control"*/`
    <label *ngIf="labelEnabled">{{label}}</label>
    <my-date-picker [options]="dateOption" [formControl]="control" [placeholder]="placeholder" (dateChanged)="onDateChanged($event)"></my-date-picker>

`
    /* tslint:enable */
})

export class DatePickerComponent {

    dateNow = new Date();

    @Input()
    control: AbstractControl = null;

    @Input()
    label: string = '';

    @Input()
    labelEnabled: boolean = true;

    @Input()
    readonly: boolean = false;

    @Input()
    placeholder: string = this.dateNow.toDateString();

    @Input()
    dateOption: IMyDpOptions = { // can be found here: https://github.com/kekeh/mydatepicker/blob/master/README.md#options-attribute
        dateFormat: 'dd.mm.yyyy',
        showTodayBtn: true,
        disableUntil: {
            year: this.dateNow.getFullYear(),
            month: this.dateNow.getMonth() + 1,
            day: this.dateNow.getDate() - 1
        },
        disableSince: {
            year: this.dateNow.getFullYear(),
            month: this.dateNow.getMonth() + 2,
            day: this.dateNow.getDate()
        },
        firstDayOfWeek: 'mo',
        sunHighlight: true,
        inline: false
    };

    @Output()
    onChange: EventEmitter<IMyDateModel>;

    onDateChanged(event: IMyDateModel) {
        this.onChange.emit(event);
    }

    constructor() { }


}
