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
var Toggle = (function () {
    function Toggle() {
        this.click = new ngCore.EventEmitter();
    }
    Toggle.prototype.onClick = function (event) {
        "use strict";
        this.click.emit(null);
        event.stopPropagation();
    };
    Toggle = __decorate([
        ngCore.Directive({
            selector: ".dropdown-toggle",
            host: { "(click)": "onClick($event)" }
        }), 
        __metadata('design:paramtypes', [])
    ], Toggle);
    return Toggle;
}());
var Dropdown = (function () {
    function Dropdown() {
        this.open = false;
    }
    Dropdown.prototype.ngAfterContentInit = function () {
        "use strict";
        var _this = this;
        this.toggles.forEach(function (toggle) { return toggle.click.subscribe(function () { return _this.open = !_this.open; }); });
    };
    Dropdown.prototype.onDocumentClick = function () {
        "use strict";
        this.open = false;
    };
    __decorate([
        ngCore.ContentChildren(Toggle), 
        __metadata('design:type', ngCore.QueryList)
    ], Dropdown.prototype, "toggles", void 0);
    __decorate([
        ngCore.HostListener("document:click"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], Dropdown.prototype, "onDocumentClick", null);
    Dropdown = __decorate([
        ngCore.Directive({
            selector: ".dropdown",
            host: { "[class.open]": "open" }
        }), 
        __metadata('design:paramtypes', [])
    ], Dropdown);
    return Dropdown;
}());
exports.DIRECTIVES = [Dropdown, Toggle];
//# sourceMappingURL=dropdown.js.map