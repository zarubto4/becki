import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { IHomerInstanceRecord } from '../backend/TyrionAPI';

@Component({
    selector: 'bk-instance-timeline',
    template: `
        <div class="instance-timeline">
            <a (click)="timelineMoveLeft()" class="timeline-button btn-left">
                <i class="fa fa-chevron-left"></i>
            </a>
            <a (click)="timelineMoveRight()" class="timeline-button btn-right">
                <i class="fa fa-chevron-right"></i>
            </a>
            <div *ngIf="data" class="timeline-container">
                <div class="line"></div>
                <div class="center-holder">
                    <div class="slider" [style.left]="position+'%'">

                        <a *ngFor="let instance of data; let i = index" [class.selected]="i == selected" (click)="itemClick(i, instance)">
                            <span style="text-overflow: ellipsis; display:block; overflow: hidden;white-space: nowrap;">{{instance.b_program_version_name}}</span> 
                            <span class="font-grey-salsa" style="display: block; font-size: 70%">{{instance.createdd|bkUnixTimeToDate}}</span>
                        </a>

                    </div>
                </div>
            </div>
        </div>
`
})
export class InstanceHistoryTimelineComponent implements OnInit {
    position: number = 0;
    selected: number = -1;

    @Input()
    data: IHomerInstanceRecord[] = [];

    @Output()
    onSelect: EventEmitter<{index: number, item: IHomerInstanceRecord}> = new EventEmitter<{index: number, item: IHomerInstanceRecord}>();

    constructor() {}

    ngOnInit(): void {
        if (this.data) {
            this.position = -(this.data.length - 1) * 100;
        }
    }

    public timelineMoveLeft() {
        this.position += 100;

        if (this.position > 0) {
            this.position = 0;
        }
    }

    public timelineMoveRight() {
        this.position -= 100;

        if (this.position < -(this.data.length - 1) * 100) {
            this.position = -(this.data.length - 1) * 100;
        }
    }

    public itemClick(index: number, item: IHomerInstanceRecord) {
        this.onSelect.emit({index, item});
        this.selected = index;
        this.position = -index * 100;
    }
}
