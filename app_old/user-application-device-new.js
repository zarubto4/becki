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
var ngCommon = require("@angular/common");
var ngCore = require("@angular/core");
var ngRouter = require("@angular/router");
var libBecki = require("./lib-becki/index");
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiCustomValidator = require("./lib-becki/custom-validator");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var Component = (function () {
    function Component(home, backEnd, notifications, router) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("New Board for Applications", ["/user/application/device/new"])
        ];
        this.projectField = "";
        this.nameField = "";
        this.widthField = 1;
        this.heightField = 1;
        this.columnsField = 1;
        this.rowsField = 1;
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.getProjects()
            .then(function (projects) { return _this.projects = projects.filter(function (project) { return project.update_permission; }); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Projects cannot be loaded.", reason)); });
    };
    Component.prototype.validateNameField = function () {
        "use strict";
        var _this = this;
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return function () { return _this.backEnd.getScreenTypes().then(function (devices) { return ![].concat(devices.public_types, devices.private_types).find(function (device) { return device.name == _this.nameField; }); }); };
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        Promise.resolve(libBecki.getAdvancedField(this.projectField, this.projects.map(function (project) { return project.id; })) || this.backEnd.createDefaultProject().then(function (project) {
            _this.projects = [project];
            _this.projectField = project.id;
            return project.id;
        }))
            .then(function (project) {
            return _this.backEnd.createScreenType(_this.nameField, _this.widthField, _this.heightField, _this.columnsField, _this.rowsField, project);
        })
            .then(function () {
            _this.notifications.next.push(new libBeckiNotifications.Success("The device has been created."));
            _this.router.navigate(["/user/application/devices"]);
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The device cannot be created.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.router.navigate(["/user/application/devices"]);
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-application-device-new.html",
            directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-application-device-new.js.map