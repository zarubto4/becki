import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';



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
export class BeckiBooleanButtonComponent implements OnInit, OnChanges {

    private componentValue: boolean = false;

    @Input()
    baseValue: boolean;

    @Input()
    verticalAlign: string = 'middle';

    @Input()
    fontSize: string = '1.8em';

    @Output()
    valueChanged: EventEmitter<{ value: boolean }> = new EventEmitter<{ value: boolean }>();



    ngOnInit(): void {
        if (this.baseValue) {
            this.baseValue = this.componentValue;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
        this.componentValue = changes.baseValue.currentValue;
    }

    switchValue() {
        this.componentValue = !this.componentValue;
        this.valueChanged.emit({ value: this.componentValue });
    }


}
