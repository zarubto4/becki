import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { FormSelectComponentOption } from './FormSelectComponent';

interface TimeZones {
    label: string;
    value: number;
}

@Component({
    selector: 'bk-time-zone-selector',
    templateUrl: './TimeZoneComponent.html'
})
export class TimeZoneSelectorComponent implements OnInit {

    @Input()
    control: AbstractControl = null;

    @Input()
    label: string = 'Select Time Zone';

    @Input()
    labelEnabled: boolean = true;

    @Input()
    readonly: boolean = false;

    @Input()
    waitForTouch: boolean = true;

    public _options: FormSelectComponentOption[] = null;

    private opp: TimeZones[] = [
        {
            label: '(GMT -12:00) Eniwetok, Kwajalein',
            value: 720
        },
        {
            label: '(GMT -11:00) Midway Island, Samoa',
            value: 660
        },
        {
            label: '(GMT -10:00) Hawaii',
            value: 600
        },
        {
            label: '(GMT -9:00) Alaska',
            value: 540
        },
        {
            label: '(GMT -8:00) Pacific Time (US & Canada)',
            value: 480
        },
        {
            label: '(GMT -7:00) Mountain Time (US &amp; Canada)',
            value: 420
        },
        {
            label: '(GMT -6:00) Central Time (US &amp; Canada), Mexico City',
            value: 360
        },
        {
            label: '(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima',
            value: 300
        },
        {
            label: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz',
            value: 240
        },
        {
            label: '(GMT -3:30) Newfoundland',
            value: 210
        },
        {
            label: '(GMT -3:00) Brazil, Buenos Aires, Georgetown',
            value: 180
        },
        {
            label: '(GMT -2:00) Mid-Atlantic',
            value: 120
        },
        {
            label: '(GMT -1:00 hour) Azores, Cape Verde Islands',
            value: 60
        },
        {
            label: '(GMT) Western Europe Time, London, Lisbon, Casablanca',
            value: 0
        },
        {
            label: '(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris, Prague',
            value: -60
        },
        {
            label: '(GMT +2:00) Kaliningrad, South Africa',
            value: -120
        },
        {
            label: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg',
            value: -180
        },
        {
            label: '(GMT +3:30) Tehran',
            value: -210
        },
        {
            label: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi',
            value: -240
        },
        {
            label: '(GMT +4:30) Kabul',
            value: -270
        },
        {
            label: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent',
            value: -300
        },
        {
            label: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi',
            value: -330
        },
        {
            label: '(GMT +5:45) Kathmandu',
            value: -345
        },
        {
            label: '(GMT +6:00) Almaty, Dhaka, Colombo',
            value: -360
        },
        {
            label: '(GMT +7:00) Bangkok, Hanoi, Jakarta',
            value: -420
        },
        {
            label: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong',
            value: -480
        },
        {
            label: '(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk',
            value: -540
        },
        {
            label: '(GMT +9:30) Adelaide, Darwin',
            value: -570
        },
        {
            label: '(GMT +10:00) Eastern Australia, Guam, Vladivostok',
            value: -600
        },
        {
            label: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia',
            value: -660
        },
        {
            label: '(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka',
            value: -720
        },
    ];

    constructor(public validatorErrorsService: ValidatorErrorsService) {}

    onSelectedChange(newValue: string) {

        if (newValue == null) {
            return;
        }

        // console.log('onSelectedChange:' + newValue);
        // console.log('offset:' +  moment(newValue).utcOffset());
    }

    ngOnInit() {

        this._options = this.opp.map((pv) => {
            return {
                label: pv.label,
                value: '' + pv.value
            };
        });

        this._options.unshift({
            label: 'Your Local Time (GMT' + this.getOffset() + ')',
            value: this.getOffset()
        });

    }

    getOffset(): string {
        let offset: number = new Date().getTimezoneOffset();

        let time_prefix: string = '' + (Math.abs(offset) / 60) + ':00';

        if (offset < 0) {
            time_prefix = '+' + time_prefix;
        } else {
            time_prefix = '-' + time_prefix;
        }

        return time_prefix;
    }


}
