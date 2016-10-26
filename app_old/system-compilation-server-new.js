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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ngCore = require("@angular/core");
var ngRouter = require("@angular/router");
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiCustomValidator = require("./lib-becki/custom-validator");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var Component = (function () {
    function Component(home, backEnd, notifications, router) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("System", ["/system"]),
            new libBeckiLayout.LabeledLink("New Compilation Server", ["/system/compilation/server/new"])
        ];
        this.nameField = "";
        this.typeField = "";
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        this.notifications.shift();
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.router.navigate(["/system"]);
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.updateBoardWithCProgram(this.nameField)
            .then(function () {
            _this.notifications.next.push(new libBeckiNotifications.Success("The server " + _this.nameField + " has been created."));
            _this.router.navigate(["/system"]);
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The server cannot be created.", reason));
        });
    };
    Component.prototype.validateNameField = function () {
        "use strict";
        var _this = this;
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        return function () { return _this.backEnd.getCompilationServers().then(function (servers) { return !servers.find(function (servers) { return servers.server_name == _this.nameField; }); }); };
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/system-compilation-server-new.html",
            directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngRouter.ROUTER_DIRECTIVES]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=system-compilation-server-new.js.map