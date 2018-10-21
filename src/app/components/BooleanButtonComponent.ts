import { Component, Input, Output, EventEmitter } from '@angular/core';



@Component({
    selector: 'bk-bool-button',
    /* tslint:disable:max-line-length */
    template: `

    <i *ngIf="componentValue" class="fa fa-toggle-on font-green-jungle cursor-hand" [style.vertical-align]="verticalAlign" [style.font-size]="fontSize"
    (click)="switchValue()"></i>
    <i *ngIf="!componentValue" class="fa fa-toggle-off font-grey-mint cursor-hand" [style.vertical-align]="verticalAlign" [style.font-size]="fontSize"
    (click)="switchValue()"></i>   
`
    /* tslint:enable */
})
export class BeckiBooleanButtonComponent {

    private componentValue: boolean = false;

    @Input()
    set baseValue(value: boolean) {
        this.componentValue = value;
    }

    @Input()
    verticalAlign: string = 'middle';

    @Input()
    fontSize: string = '1.8em';

    @Output()
    valueChanged: EventEmitter<{ value: boolean }> = new EventEmitter<{ value: boolean }>();

    @Input()
    readonly: boolean = false;

    switchValue() {
        if (!this.readonly) {
            this.componentValue = !this.componentValue;
            this.valueChanged.emit({value: this.componentValue});
        }
    }


}
