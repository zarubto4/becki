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
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var libPatternFlyListView = require("./lib-patternfly/list-view");
var Component = (function () {
    function Component(home, backEnd, notifications, router) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Applications", ["/user/applications"])
        ];
        this.tab = "applications";
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        this.notifications.shift();
        this.refresh();
    };
    Component.prototype.refresh = function () {
        "use strict";
        var _this = this;
        this.backEnd.getMPrograms()
            .then(function (applications) { return _this.applications = applications.map(function (application) { return new libPatternFlyListView.Item(application.id, application.program_name, application.program_description, ["/user/applications", application.id], application.delete_permission); }); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Applications cannot be loaded.", reason)); });
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        this.backEnd.getScreenTypes()
            .then(function (devices) { return _this.devices = [].concat(devices.public_types.map(function (device) { return new libPatternFlyListView.Item(device.id, device.name, "global", ["/application/devices", device.id], device.delete_permission); }), devices.private_types.map(function (device) { return new libPatternFlyListView.Item(device.id, device.name, "project specific", ["/application/devices", device.id], device.delete_permission); })); })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("Devices cannot be loaded.", reason));
        });
        this.backEnd.getProjects()
            .then(function (projects) { return Promise.all((_a = []).concat.apply(_a, projects.map(function (project) { return project.m_projects_id; })).map(function (id) { return _this.backEnd.getMProject(id); })); var _a; })
            .then(function (groups) { return _this.groups = groups.map(function (group) { return new libPatternFlyListView.Item(group.id, group.program_name, group.program_description, ["/user/application/groups", group.id], group.delete_permission); }); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Groups cannot be loaded.", reason)); });
    };
    Component.prototype.onAddClick = function () {
        "use strict";
        switch (this.tab) {
            case "applications":
                this.onAddApplicationClick();
                break;
            case "devices":
                this.onAddDeviceClick();
                break;
            case "groups":
                this.onAddGroupClick();
                break;
        }
    };
    Component.prototype.onAddApplicationClick = function () {
        "use strict";
        this.router.navigate(["/user/application/new"]);
    };
    Component.prototype.onAddDeviceClick = function () {
        "use strict";
        this.router.navigate(["/user/application/device/new"]);
    };
    Component.prototype.onAddGroupClick = function () {
        "use strict";
        this.router.navigate(["/user/application/group/new"]);
    };
    Component.prototype.onTabClick = function (tab) {
        "use strict";
        this.tab = tab;
    };
    Component.prototype.onRemoveApplicationClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteMProgram(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The application has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The application cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveDeviceClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteScreenType(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The device has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The device cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveGroupClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteMProject(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The group has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The group cannot be removed.", reason));
        });
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-applications.html",
            directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ngCommon.CORE_DIRECTIVES],
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-applications.js.map