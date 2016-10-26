/**
 * Created by davidhradek on 28.07.16.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var DraggableDirective = (function () {
    function DraggableDirective(elementRef) {
        this.elementRef = elementRef;
        this.onCreate = new core_1.EventEmitter();
        this.onStart = new core_1.EventEmitter();
        this.onDrag = new core_1.EventEmitter();
        this.onStop = new core_1.EventEmitter();
    }
    DraggableDirective.prototype.ngOnInit = function () {
        var _this = this;
        var options = {};
        for (var k in this.draggableConfig) {
            if (!this.draggableConfig.hasOwnProperty(k))
                continue;
            options[k] = this.draggableConfig[k];
        }
        options.create = function (event, ui) { return _this.drgOnCreate(event, ui); };
        options.start = function (event, ui) { return _this.drgOnStart(event, ui); };
        options.drag = function (event, ui) { return _this.drgOnDrag(event, ui); };
        options.stop = function (event, ui) { return _this.drgOnStop(event, ui); };
        $(this.elementRef.nativeElement).draggable(options);
    };
    DraggableDirective.prototype.drgOnCreate = function (event, ui) {
        this.onCreate.emit({
            directive: this,
            data: this.draggableData,
            event: event,
            ui: ui
        });
    };
    DraggableDirective.prototype.drgOnStart = function (event, ui) {
        this.onStart.emit({
            directive: this,
            data: this.draggableData,
            event: event,
            ui: ui
        });
    };
    DraggableDirective.prototype.drgOnDrag = function (event, ui) {
        this.onDrag.emit({
            directive: this,
            data: this.draggableData,
            event: event,
            ui: ui
        });
    };
    DraggableDirective.prototype.drgOnStop = function (event, ui) {
        this.onStop.emit({
            directive: this,
            data: this.draggableData,
            event: event,
            ui: ui
        });
    };
    __decorate([
        core_1.Input('draggable'), 
        __metadata('design:type', Object)
    ], DraggableDirective.prototype, "draggableConfig", void 0);
    __decorate([
        core_1.Input('draggable-data'), 
        __metadata('design:type', Object)
    ], DraggableDirective.prototype, "draggableData", void 0);
    __decorate([
        core_1.Output('draggable-onCreate'), 
        __metadata('design:type', Object)
    ], DraggableDirective.prototype, "onCreate", void 0);
    __decorate([
        core_1.Output('draggable-onStart'), 
        __metadata('design:type', Object)
    ], DraggableDirective.prototype, "onStart", void 0);
    __decorate([
        core_1.Output('draggable-onDrag'), 
        __metadata('design:type', Object)
    ], DraggableDirective.prototype, "onDrag", void 0);
    __decorate([
        core_1.Output('draggable-onStop'), 
        __metadata('design:type', Object)
    ], DraggableDirective.prototype, "onStop", void 0);
    DraggableDirective = __decorate([
        core_1.Directive({
            selector: '[draggable]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], DraggableDirective);
    return DraggableDirective;
}());
exports.DraggableDirective = DraggableDirective;
//# sourceMappingURL=draggable-directive.js.map