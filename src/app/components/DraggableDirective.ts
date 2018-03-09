/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

declare var $: JQueryStatic;
import { Directive, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';

export interface DraggableEventParams {
    directive: DraggableDirective;
    data: any;
    type: ('block'|'code'|'grid'|'hardware');
    event: Event;
    ui: JQueryUI.DraggableEventUIParams;
}

@Directive({
    selector: '[bkDraggable]'
})
export class DraggableDirective implements OnInit {

/* tslint:disable:no-input-rename no-output-rename */
    @Input('bkDraggable')
    draggableConfig: JQueryUI.DraggableOptions;

    @Input('bkDraggableData')
    draggableData: any;

    @Input('bkDraggableDataType')
    draggableDataType: ('block'|'code'|'grid'|'hardware');

    @Output('bkDraggableOnCreate')
    onCreate = new EventEmitter<DraggableEventParams>();
    @Output('bkDraggableOnStart')
    onStart = new EventEmitter<DraggableEventParams>();
    @Output('bkDraggableOnDrag')
    onDrag = new EventEmitter<DraggableEventParams>();
    @Output('bkDraggableOnStop')
    onStop = new EventEmitter<DraggableEventParams>();
/* tslint:enable */

    constructor(protected elementRef: ElementRef) {
    }

    ngOnInit() {

        let options: any = {};
        for (let k in this.draggableConfig) {
            if (!this.draggableConfig.hasOwnProperty(k)) { continue; }
            options[k] = (<any>this.draggableConfig)[k];
        }

        options.create = (event: Event, ui: JQueryUI.DraggableEventUIParams) => this.drgOnCreate(event, ui);
        options.start = (event: Event, ui: JQueryUI.DraggableEventUIParams) => this.drgOnStart(event, ui);
        options.drag = (event: Event, ui: JQueryUI.DraggableEventUIParams) => this.drgOnDrag(event, ui);
        options.stop = (event: Event, ui: JQueryUI.DraggableEventUIParams) => this.drgOnStop(event, ui);

        $(this.elementRef.nativeElement).draggable(options);
    }

    private drgOnCreate(event: Event, ui: JQueryUI.DraggableEventUIParams) {
        this.onCreate.emit({
            directive: this,
            data: this.draggableData,
            type: this.draggableDataType,
            event: event,
            ui: ui
        });
    }

    private drgOnStart(event: Event, ui: JQueryUI.DraggableEventUIParams) {
        this.onStart.emit({
            directive: this,
            data: this.draggableData,
            type: this.draggableDataType,
            event: event,
            ui: ui
        });
    }

    private drgOnDrag(event: Event, ui: JQueryUI.DraggableEventUIParams) {
        this.onDrag.emit({
            directive: this,
            data: this.draggableData,
            type: this.draggableDataType,
            event: event,
            ui: ui
        });
    }

    private drgOnStop(event: Event, ui: JQueryUI.DraggableEventUIParams) {
        this.onStop.emit({
            directive: this,
            data: this.draggableData,
            type: this.draggableDataType,
            event: event,
            ui: ui
        });
    }
}
