/**
 * Created by davidhradek on 19.09.16.
 */

import { Directive, ElementRef, Input, Output, EventEmitter} from '@angular/core';
declare var $:JQueryStatic;

export interface DraggableEventParams {
    directive: Draggable;
    data: any;
    event: Event;
    ui: JQueryUI.DraggableEventUIParams;
}

@Directive({
    selector: '[draggable]'
})
export class Draggable {

    @Input('draggable') draggableConfig: JQueryUI.DraggableOptions;

    @Input('draggable-data') draggableData: any;

    @Output('draggable-onCreate') onCreate = new EventEmitter<DraggableEventParams>();
    @Output('draggable-onStart') onStart = new EventEmitter<DraggableEventParams>();
    @Output('draggable-onDrag') onDrag = new EventEmitter<DraggableEventParams>();
    @Output('draggable-onStop') onStop = new EventEmitter<DraggableEventParams>();

    constructor(protected elementRef: ElementRef) {
    }

    ngOnInit() {

        var options:any = {};
        for (var k in this.draggableConfig) {
            if (!this.draggableConfig.hasOwnProperty(k)) continue;
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
            event: event,
            ui: ui
        });
    }

    private drgOnStart(event: Event, ui: JQueryUI.DraggableEventUIParams) {
        this.onStart.emit({
            directive: this,
            data: this.draggableData,
            event: event,
            ui: ui
        });
    }

    private drgOnDrag(event: Event, ui: JQueryUI.DraggableEventUIParams) {
        this.onDrag.emit({
            directive: this,
            data: this.draggableData,
            event: event,
            ui: ui
        });
    }

    private drgOnStop(event: Event, ui: JQueryUI.DraggableEventUIParams) {
        this.onStop.emit({
            directive: this,
            data: this.draggableData,
            event: event,
            ui: ui
        });
    }
}
