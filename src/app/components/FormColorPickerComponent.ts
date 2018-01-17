/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import {
    Component,
    Input,
    OnInit,
    ElementRef,
    ViewChild,
    OnDestroy,
    EventEmitter,
    Output,
    SimpleChanges,
    OnChanges
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/TranslationService';


const parseColor = require('parse-color');

@Component({
    selector: 'bk-form-color-picker',
/* tslint:disable:max-line-length */
    template: `
<div class="form-group becki-form-color-picker" [class.has-success]="control && (!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid))" [class.has-error]="control && (!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid))" [class.has-warning]="control && (!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending))">
    <label>{{label}}</label>
    <input class="form-control color-input" #colorSelector type="text">
    <div *ngIf="rgbaOutput" class="opacity-input">
        <label>Opacity:</label>
        <input class="form-control" #opacitySelector type="number" [attr.step]="0.1" [attr.min]="0" [attr.max]="1" [(ngModel)]="opacity" (change)="onOpacityChange()">
    </div>
    <span class="help-block" *ngIf="control && (!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid))">{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
</div>
`
/* tslint:enable */
})
export class FormColorPickerComponent implements OnInit, OnDestroy, OnChanges {

    @Input()
    control: AbstractControl = null;

    @Input()
    value: string = '';

    @Output()
    valueChange: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    label: string = 'Unknown label';

    @Input()
    waitForTouch: boolean = true;

    @Input()
    readonly: boolean = false;

    @Input()
    rgbaOutput: boolean = false;

    @ViewChild('colorSelector')
    colorSelector: ElementRef;

    valueSubscription: Subscription = null;
    opacity: number = 1;

    constructor(public validatorErrorsService: ValidatorErrorsService, private translationService: TranslationService) {
    }

    ngOnInit(): void {
        if (this.readonly) {
            throw Error(this.translationService.translate('error_readonly_not_support', this, null));
        }

        if (this.value === 'transparent') {
            this.value = 'rgba(0,0,0,0)';
        }

        if (this.control) {
            this.value = this.control.value;

            this.valueSubscription = this.control.valueChanges.subscribe((value) => {
                if (value === this.value) {
                    return;
                }
                // missing typings for minicolors
                (<any>$(this.colorSelector.nativeElement)).minicolors('value', parseColor(value).hex);
            });
        }

        if (this.rgbaOutput) {
            this.opacity = parseColor( this.value ).rgba[3];
        }

        // missing typings for minicolors
        (<any>$(this.colorSelector.nativeElement)).minicolors({
            theme: 'bootstrap',
            defaultValue: parseColor(this.value).hex,
            change: (value: string) => {
                this.value = value;
                this.emitChange();
            },
            hide: () => {
                if (this.control) {
                    this.control.markAsTouched();
                }
            }
        });
    }

    emitChange() {
        let outputValue = this.value;
        if (this.rgbaOutput) {
            outputValue = parseColor(outputValue).rgb;
            outputValue = 'rgba(' + outputValue[0] + ',' + outputValue[1] + ',' + outputValue[2] + ',' + this.opacity + ')';
        }

        if (this.control) {
            this.control.setValue(outputValue);
        }
        this.valueChange.emit(outputValue);
    }

    onOpacityChange = () => {
        this.opacity = Math.min(1.0, Math.max(0, this.opacity));
        this.emitChange();
    }

    ngOnChanges(changes: SimpleChanges): void {
        let valueChanged = changes['value'];
        if (valueChanged) {
            let value = valueChanged.currentValue;
            if (value === this.value) {
                return;
            }
            // missing typings for minicolors
            (<any>$(this.colorSelector.nativeElement)).minicolors('value', value);
        }
    }

    ngOnDestroy(): void {
        if (this.valueSubscription) {
            this.valueSubscription.unsubscribe();
        }
        // missing typings for minicolors
        (<any>$(this.colorSelector.nativeElement)).minicolors('destroy');
    }

}
