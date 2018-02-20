import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { IInstanceSnapshot } from '../backend/TyrionAPI';

@Component({
    selector: 'bk-instance-timeline',
    templateUrl: './InstanceHistoryTimeLineComponent.html'
})
export class InstanceHistoryTimeLineComponent implements OnInit {
    position: number = 0;
    selected: number = -1;

    @Input()
    data: IInstanceSnapshot[] = [];

    @Output()
    onSelect: EventEmitter<{index: number, item: IInstanceSnapshot}> = new EventEmitter<{index: number, item: IInstanceSnapshot}>();

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

    public itemClick(index: number, item: IInstanceSnapshot) {
        this.onSelect.emit({index, item});
        this.selected = index;
        this.position = -index * 100;
    }
}
