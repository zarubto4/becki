/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
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
var ngCore = require("@angular/core");
var theGrid = require("the-grid");
var libBootstrapModal = require("../modals/modal");
var modal = require("./modal");
var notifications = require("./notifications");
var Component = (function () {
    function Component(modalComponent, notificationsService) {
        "use strict";
        var _this = this;
        this.controller = new theGrid.Core.Controller();
        this.controller.registerDataChangedCallback(function () {
            _this.modal.closeModal(false);
            _this.modelChange.emit(_this.controller.getDataJson());
        });
        this.controller.registerWidget(theGrid.Widgets.TimeWidget);
        this.controller.registerWidget(theGrid.Widgets.LabelWidget);
        this.controller.registerWidget(theGrid.Widgets.WeatherWidget);
        this.controller.registerWidget(theGrid.Widgets.ButtonWidget);
        this.controller.registerWidget(theGrid.Widgets.FAButtonWidget);
        this.controller.registerWidget(theGrid.Widgets.KnobWidget);
        this.readonly = false;
        this.modelChange = new ngCore.EventEmitter();
        this.modal = modalComponent;
        this.notifications = notificationsService;
    }
    Component.prototype.ngOnChanges = function (changes) {
        "use strict";
        var device = changes["device"];
        if (device) {
            if (device.isFirstChange()) {
                this.controller.deviceProfile = new theGrid.Core.DeviceProfile(device.currentValue.name, [
                    new theGrid.Core.ScreenProfile("portrait", device.currentValue.portrait_width, device.currentValue.portrait_height, device.currentValue.portrait_square_width, device.currentValue.portrait_square_height, device.currentValue.portrait_min_screens, device.currentValue.portrait_max_screens),
                    new theGrid.Core.ScreenProfile("landscape", device.currentValue.landscape_width, device.currentValue.landscape_height, device.currentValue.landscape_square_width, device.currentValue.landscape_square_height, device.currentValue.landscape_min_screens, device.currentValue.landscape_max_screens)
                ]);
            }
            else {
                this.notifications.current.push(new notifications.Danger("The device cannot be changed."));
            }
        }
        var model = changes["model"];
        if (model) {
            if (model.isFirstChange()) {
                this.initialModel = model.currentValue;
            }
            else {
                this.controller.setDataJson(model.currentValue);
            }
        }
    };
    Component.prototype.ngAfterViewInit = function () {
        "use strict";
        var _this = this;
        if (!this.controller.deviceProfile) {
            this.controller.deviceProfile = new theGrid.DeviceProfiles.iPhone6();
        }
        var renderer = new theGrid.EditorRenderer.ControllerRenderer(this.controller, this.toolbar.nativeElement, this.screens.nativeElement);
        renderer.registerOpenConfigCallback(function (widget) {
            return _this.modal.showModal(new modal.WidgetModel(widget, _this.readonly)).then(function (save) {
                if (save) {
                    widget.emitOnConfigsChanged();
                }
            });
        });
        this.controller.setRenderer(renderer);
        if (this.initialModel) {
            this.controller.setDataJson(this.initialModel);
        }
    };
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', Boolean)
    ], Component.prototype, "readonly", void 0);
    __decorate([
        ngCore.ViewChild("toolbar"), 
        __metadata('design:type', ngCore.ElementRef)
    ], Component.prototype, "toolbar", void 0);
    __decorate([
        ngCore.ViewChild("screens"), 
        __metadata('design:type', ngCore.ElementRef)
    ], Component.prototype, "screens", void 0);
    __decorate([
        ngCore.Output("fieldApplicationChange"), 
        __metadata('design:type', ngCore.EventEmitter)
    ], Component.prototype, "modelChange", void 0);
    Component = __decorate([
        ngCore.Component({
            selector: "[fieldApplication]",
            templateUrl: "app/lib-becki/field-application.html",
            inputs: ["model: fieldApplication", "device"]
        }), 
        __metadata('design:paramtypes', [Object, notifications.Service])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=field-application.js.map