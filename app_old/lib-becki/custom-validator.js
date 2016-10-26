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
var notifications = require("./notifications");
var Directive = (function () {
    function Directive(field, notificationsService) {
        "use strict";
        this.message = "Please fill out a valid value.";
        this.field = field;
        this.warned = false;
        this.notifications = notificationsService;
    }
    Directive.prototype.clear = function () {
        "use strict";
        this.field.nativeElement.setCustomValidity("");
    };
    Directive.prototype.validate = function () {
        "use strict";
        var _this = this;
        this.customValidator()
            .then(function (valid) {
            if (_this.warned) {
                _this.notifications.current.push(new notifications.Success("Can validate a field again."));
            }
            _this.warned = false;
            return valid;
        })
            .catch(function (reason) {
            if (!_this.warned) {
                _this.notifications.current.push(new notifications.Warning("Cannot validate a field.", reason));
            }
            _this.warned = true;
            return true;
        })
            .then(function (valid) {
            _this.field.nativeElement.setCustomValidity(valid ? "" : _this.message);
        })
            .catch(function (reason) {
            _this.notifications.current.push(new notifications.Danger("An unexpected error occurred during validating a field.", reason));
        });
    };
    __decorate([
        ngCore.Input("customValidator"), 
        __metadata('design:type', Function)
    ], Directive.prototype, "customValidator", void 0);
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', String)
    ], Directive.prototype, "message", void 0);
    Directive = __decorate([
        ngCore.Directive({
            selector: "[customValidator]",
            host: { "(input)": "clear()", "(change)": "validate()", "(blur)": "validate()" }
        }), 
        __metadata('design:paramtypes', [ngCore.ElementRef, notifications.Service])
    ], Directive);
    return Directive;
}());
exports.Directive = Directive;
//# sourceMappingURL=custom-validator.js.map