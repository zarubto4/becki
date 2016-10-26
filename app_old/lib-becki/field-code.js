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
require("ace");
require("ace/ext-language_tools");
require("ace/mode-c_cpp");
require("ace/mode-javascript");
var ngCore = require("@angular/core");
var Component = (function () {
    function Component() {
        this.annotations = [];
        this.modelChange = new ngCore.EventEmitter();
    }
    Component.prototype.ngOnChanges = function (changes) {
        "use strict";
        var model = changes["model"];
        // TODO: https://github.com/angular/angular/issues/6114
        if (model && this.editor && model.currentValue != this.editor.getValue()) {
            this.editor.setValue(model.currentValue, 1);
        }
        var mode = changes["mode"];
        if (mode && this.editor) {
            this.editor.getSession().setMode(mode.currentValue);
        }
        var readonly = changes["readonly"];
        if (readonly && this.editor) {
            this.editor.setReadOnly(readonly.currentValue);
        }
        var annotations = changes["annotations"];
        if (annotations && this.editor) {
            this.editor.getSession().setAnnotations(annotations.currentValue);
        }
    };
    Component.prototype.ngAfterViewInit = function () {
        "use strict";
        var _this = this;
        this.editor = ace.edit(this.field.nativeElement);
        this.editor.setOptions({ enableBasicAutocompletion: true });
        this.editor.setReadOnly(this.readonly);
        this.editor.getSession().setMode(this.mode);
        this.editor.getSession().setAnnotations(this.annotations);
        this.editor.getSession().on("change", function () {
            _this.model = _this.editor.getValue();
            _this.modelChange.emit(_this.model);
        });
    };
    Component.prototype.ngOnDestroy = function () {
        "use strict";
        this.editor.destroy();
    };
    __decorate([
        ngCore.Input("fieldCode"), 
        __metadata('design:type', String)
    ], Component.prototype, "model", void 0);
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', String)
    ], Component.prototype, "mode", void 0);
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', Boolean)
    ], Component.prototype, "readonly", void 0);
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', Array)
    ], Component.prototype, "annotations", void 0);
    __decorate([
        ngCore.ViewChild("field"), 
        __metadata('design:type', ngCore.ElementRef)
    ], Component.prototype, "field", void 0);
    __decorate([
        ngCore.Output("fieldCodeChange"), 
        __metadata('design:type', Object)
    ], Component.prototype, "modelChange", void 0);
    Component = __decorate([
        ngCore.Component({
            selector: "[fieldCode]",
            templateUrl: "app/lib-becki/field-code.html"
        }), 
        __metadata('design:paramtypes', [])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=field-code.js.map