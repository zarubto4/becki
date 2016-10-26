/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
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
var blocko = require("blocko");
var ngCommon = require("@angular/common");
var ngCore = require("@angular/core");
var backEnd = require("./back-end");
var libBootstrapModal = require("../modals/modal");
var modal = require("./modal");
var notifications = require("./notifications");
var Component = (function () {
    function Component(backendService, notificationsService, modalComponent) {
        "use strict";
        var _this = this;
        this.readonly = false;
        this.fieldRenderer = new blocko.BlockoSnapRenderer.RendererController();
        this.fieldRenderer.registerOpenConfigCallback(function (block) {
            return modalComponent.showModal(new modal.BlockModel(block, _this.readonly)).then(function (save) {
                if (save) {
                    block.emitConfigsChanged();
                }
            });
        });
        this.fieldController = new blocko.BlockoCore.Controller();
        this.fieldController.rendererFactory = this.fieldRenderer;
        this.fieldController.registerDataChangedCallback(function () {
            modalComponent.closeModal(false);
            _this.modelChange.emit(_this.fieldController.getDataJson());
        });
        this.fieldController.registerBlocks(blocko.BlockoBasicBlocks.Manager.getAllBlocks());
        this.modelChange = new ngCore.EventEmitter();
        this.backEnd = backendService;
        this.backEnd.interactionsOpened.subscribe(function () {
            if (_this.spy) {
                _this.backEnd.requestInteractionsSchemeValues(_this.spy);
            }
        });
        this.backEnd.interactionsSchemeSubscribed.subscribe(function () {
            if (_this.spy) {
                _this.backEnd.requestInteractionsSchemeValues(_this.spy);
            }
        });
        this.backEnd.BProgramValuesReceived.subscribe(function (values) {
            if (_this.spy) {
                Object.keys(values.digital).forEach(function (hwId) {
                    _this.fieldController.setDigitalValue(hwId, values.digital[hwId]);
                });
                Object.keys(values.analog).forEach(function (hwId) {
                    _this.fieldController.setAnalogValue(hwId, values.analog[hwId]);
                });
                Object.keys(values.connector).forEach(function (blockId) {
                    var block = values.connector[blockId];
                    Object.keys(block.inputs).forEach(function (connectorName) {
                        _this.fieldController.setInputConnectorValue(blockId, connectorName, block.inputs[connectorName]);
                    });
                    Object.keys(block.outputs).forEach(function (connectorName) {
                        _this.fieldController.setOutputConnectorValue(blockId, connectorName, block.outputs[connectorName]);
                    });
                });
            }
        });
        this.backEnd.BProgramAnalogValueReceived.subscribe(function (value) {
            if (_this.spy) {
                _this.fieldController.setAnalogValue(value.hwId, value.value);
            }
        });
        this.backEnd.BProgramDigitalValueReceived.subscribe(function (value) {
            if (_this.spy) {
                _this.fieldController.setDigitalValue(value.hwId, value.value);
            }
        });
        this.backEnd.BProgramInputConnectorValueReceived.subscribe(function (value) {
            if (_this.spy) {
                _this.fieldController.setInputConnectorValue(value.blockId, value.connectorName, value.value);
            }
        });
        this.backEnd.BProgramOutputConnectorValueReceived.subscribe(function (value) {
            if (_this.spy) {
                _this.fieldController.setOutputConnectorValue(value.blockId, value.connectorName, value.value);
            }
        });
        this.notifications = notificationsService;
    }
    Object.defineProperty(Component.prototype, "model", {
        set: function (scheme) {
            "use strict";
            this.fieldController.setDataJson(scheme);
        },
        enumerable: true,
        configurable: true
    });
    Component.prototype.ngOnChanges = function (changes) {
        "use strict";
        var readonly = changes["readonly"];
        if (readonly && !readonly.isFirstChange()) {
            this.notifications.current.push(new notifications.Danger("The readability cannot be changed."));
            this.readonly = readonly.previousValue;
        }
        var spy = changes["spy"];
        if (spy && !spy.isFirstChange()) {
            if (spy.previousValue) {
                this.unsubscribeSpy(spy.previousValue);
            }
            if (spy.currentValue) {
                this.subscribeSpy(spy.currentValue);
            }
        }
    };
    Component.prototype.ngAfterViewInit = function () {
        "use strict";
        if (!this.readonly) {
            new blocko.BlockoBasicBlocks.ExecutionController(this.fieldController);
        }
        if (this.spy) {
            this.subscribeSpy(this.spy);
        }
        this.fieldRenderer.setEditorElement(this.field.nativeElement);
    };
    Component.prototype.ngOnDestroy = function () {
        "use strict";
        if (this.spy) {
            this.unsubscribeSpy(this.spy);
        }
    };
    Component.prototype.subscribeSpy = function (spy) {
        "use strict";
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-262
        this.notifications.current.push(new notifications.Danger("issue/TYRION-262"));
        this.backEnd.subscribeBProgram(spy);
    };
    Component.prototype.unsubscribeSpy = function (spy) {
        "use strict";
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-261
    };
    Component.prototype.onSwitchClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.Switch);
    };
    Component.prototype.onButtonClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.PushButton);
    };
    Component.prototype.onLightClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.Light);
    };
    Component.prototype.onInputClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.AnalogInput);
    };
    Component.prototype.onOutputClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.AnalogOutput);
    };
    Component.prototype.onAndClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.And);
    };
    Component.prototype.onOrClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.Or);
    };
    Component.prototype.onXorClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.Xor);
    };
    Component.prototype.onNotClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.Not);
    };
    Component.prototype.onFlipFlopClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.FlipFlop);
    };
    Component.prototype.onDelayClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.DelayTimer);
    };
    Component.prototype.onAsyncClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.AsyncGenerator);
    };
    Component.prototype.onRangeClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.AnalogRange);
    };
    Component.prototype.onCustomClick = function () {
        "use strict";
        this.addBlock(blocko.BlockoBasicBlocks.JSBlock);
    };
    Component.prototype.addBlock = function (cls) {
        "use strict";
        if (this.readonly) {
            throw new Error("read only");
        }
        this.fieldController.addBlock(new cls(this.fieldController.getFreeBlockId()));
    };
    Component.prototype.onClearClick = function () {
        "use strict";
        if (this.readonly) {
            throw new Error("read only");
        }
        this.fieldController.removeAllBlocks();
    };
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', Boolean)
    ], Component.prototype, "readonly", void 0);
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', String)
    ], Component.prototype, "spy", void 0);
    __decorate([
        ngCore.ViewChild("field"), 
        __metadata('design:type', ngCore.ElementRef)
    ], Component.prototype, "field", void 0);
    __decorate([
        ngCore.Output("fieldInteractionsSchemeChange"), 
        __metadata('design:type', ngCore.EventEmitter)
    ], Component.prototype, "modelChange", void 0);
    __decorate([
        ngCore.Input("fieldInteractionsScheme"), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], Component.prototype, "model", null);
    Component = __decorate([
        ngCore.Component({
            selector: "[fieldInteractionsScheme]",
            templateUrl: "app/lib-becki/field-interactions-scheme.html",
            directives: [ngCommon.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [backEnd.Service, notifications.Service, Object])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=field-interactions-scheme.js.map