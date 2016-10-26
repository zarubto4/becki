/**
 * Created by davidhradek on 26.09.16.
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
} from "@angular/core";
import {AbstractControl} from "@angular/forms";
import {ValidatorErrorsService} from "../services/ValidatorErrorsService";
import {Subscription} from "rxjs";

@Component({
    selector: "becki-form-color-picker",
    template: `
<div class="form-group becki-form-color-picker" [class.has-success]="control && (!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid))" [class.has-error]="control && (!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid))" [class.has-warning]="control && (!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending))">
    <label>{{label}}</label>
    <input class="form-control" #colorSelector type="hidden">
    <span class="help-block" *ngIf="control && (!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid))">{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
</div>
`
})
export class BeckiFormColorPicker implements OnInit, OnDestroy, OnChanges {

    @Input()
    control: AbstractControl = null;

    @Input()
    value: string = "";

    @Output()
    valueChange: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    label: string = "Unknown label";

    @Input()
    waitForTouch: boolean = true;

    @ViewChild("colorSelector")
    colorSelector: ElementRef;

    valueSubscription: Subscription = null;

    constructor(protected validatorErrorsService: ValidatorErrorsService) {
    }

    ngOnInit(): void {
        if (this.control) {
            this.value = this.control.value;

            this.valueSubscription = this.control.valueChanges.subscribe((value)=> {
                if (value == this.value) return;
                //missing typings for minicolors
                (<any>$(this.colorSelector.nativeElement)).minicolors('value', value);
            });
        }

        //missing typings for minicolors
        (<any>$(this.colorSelector.nativeElement)).minicolors({
            theme: "bootstrap",
            defaultValue: this.value,
            change: (value: string) => {
                this.value = value;
                if (this.control) {
                    this.control.setValue(value);
                }
                this.valueChange.emit(value);
            },
            hide: () => {
                if (this.control) {
                    this.control.markAsTouched()
                }
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        let valueChanged = changes["value"];
        if (valueChanged) {
            var value = valueChanged.currentValue;
            if (value == this.value) return;
            //missing typings for minicolors
            (<any>$(this.colorSelector.nativeElement)).minicolors('value', value);
        }
    }

    ngOnDestroy(): void {
        if (this.valueSubscription) {
            this.valueSubscription.unsubscribe();
        }
        //missing typings for minicolors
        (<any>$(this.colorSelector.nativeElement)).minicolors('destroy');
    }

}