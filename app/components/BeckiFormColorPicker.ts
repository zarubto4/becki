/**
 * Created by davidhradek on 26.09.16.
 */

import {Component, Input, OnInit, ElementRef, ViewChild, OnDestroy} from "@angular/core";
import {AbstractControl, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {ValidatorErrorsService} from "../services/ValidatorErrorsService";
import {Subscription} from "rxjs";

@Component({
    selector: "becki-form-color-picker",
    directives: [REACTIVE_FORM_DIRECTIVES],
    template: `
<div class="form-group becki-form-color-picker" [class.has-success]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)" [class.has-error]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)" [class.has-warning]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)">
    <label>{{label}}</label>
    <input class="form-control" #colorSelector type="hidden">
    <span class="help-block" *ngIf="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)">{{validatorErrorsService.getMessageForErrors(control.errors)}}</span>
</div>
`
})
export class BeckiFormColorPicker implements OnInit, OnDestroy {

    @Input()
    control:AbstractControl = null;

    @Input()
    label:string = "Unknown label";

    @Input()
    waitForTouch:boolean = true;

    @ViewChild("colorSelector")
    colorSelector:ElementRef;

    value:string = "";
    valueSubscription:Subscription = null;

    constructor(protected validatorErrorsService:ValidatorErrorsService) {}

    ngOnInit(): void {
        this.value = this.control.value;

        this.valueSubscription = this.control.valueChanges.subscribe((value)=> {
            if (value == this.value) return;
            //missing typings for minicolors
            (<any>$(this.colorSelector.nativeElement)).minicolors('value', value);
        });

        //missing typings for minicolors
        (<any>$(this.colorSelector.nativeElement)).minicolors({
            theme: "bootstrap",
            defaultValue: this.control.value,
            change: (value:string) => {
                this.value = value;
                this.control.setValue(value);
            },
            hide: () => {
                this.control.markAsTouched()
            }
        });
    }

    ngOnDestroy():void {
        this.valueSubscription.unsubscribe();
        //missing typings for minicolors
        (<any>$(this.colorSelector.nativeElement)).minicolors('destroy');
    }

}