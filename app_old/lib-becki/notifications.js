/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ngCommon = require("@angular/common");
var ngCore = require("@angular/core");
var libBackEnd = require("../lib-back-end/index");
var Notification = (function () {
    function Notification(type, icon, body, reason) {
        "use strict";
        this.type = type;
        this.icon = icon;
        this.body = body;
        if (reason instanceof libBackEnd.BugFoundError) {
            this.body += " An unexpected error ";
            if (reason.userMessage) {
                this.body += "with message \"" + reason.userMessage + "\" ";
            }
            this.body += "have occurred. Please, report following text to administrators in order to get it fixed: " + JSON.stringify(reason.adminMessage);
        }
        else if (reason instanceof libBackEnd.PermissionMissingError) {
            if (reason.userMessage) {
                this.body += " An authorization error with message \"" + reason.userMessage + "\" have occurred.";
            }
            this.body += " Please ask an authorized person to give you the necessary permissions.";
        }
        else if (reason instanceof libBackEnd.UnauthorizedError) {
            this.body += " An authorization error with message \"" + reason.userMessage + "\" have occurred. Please sign in.";
        }
    }
    return Notification;
}());
exports.Notification = Notification;
var Success = (function (_super) {
    __extends(Success, _super);
    function Success(body) {
        "use strict";
        _super.call(this, "success", "ok", body);
    }
    return Success;
}(Notification));
exports.Success = Success;
var Info = (function (_super) {
    __extends(Info, _super);
    function Info(body) {
        "use strict";
        _super.call(this, "info", "info", body);
    }
    return Info;
}(Notification));
exports.Info = Info;
var Warning = (function (_super) {
    __extends(Warning, _super);
    function Warning(body, reason) {
        "use strict";
        _super.call(this, "warning", "warning-triangle-o", body, reason);
    }
    return Warning;
}(Notification));
exports.Warning = Warning;
var Danger = (function (_super) {
    __extends(Danger, _super);
    function Danger(body, reason) {
        "use strict";
        _super.call(this, "danger", "error-circle-o", body, reason);
    }
    return Danger;
}(Notification));
exports.Danger = Danger;
var Service = (function () {
    function Service() {
        this.current = [];
        this.next = [];
    }
    Service.prototype.shift = function () {
        "use strict";
        (_a = this.current).splice.apply(_a, [0, this.current.length].concat(this.next.splice(0)));
        var _a;
    };
    Service = __decorate([
        ngCore.Injectable(), 
        __metadata('design:paramtypes', [])
    ], Service);
    return Service;
}());
exports.Service = Service;
var Component = (function () {
    function Component(service) {
        "use strict";
        this.service = service;
    }
    Component.prototype.onCloseClick = function (notification) {
        "use strict";
        this.service.current.splice(this.service.current.indexOf(notification), 1);
    };
    Component = __decorate([
        ngCore.Component({
            selector: "notifications",
            templateUrl: "app/lib-becki/notifications.html",
            directives: [ngCommon.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [Service])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=notifications.js.map