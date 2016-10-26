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
var libBeckiFieldApplication = require("./lib-becki/field-application");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var Component = (function () {
    function Component(home, backEnd, notifications, router) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("New Application", ["/user/application/new"])
        ];
        this.projectField = "";
        this.groupField = "";
        this.nameField = "";
        this.descriptionField = "";
        this.deviceField = "";
        this.devices = [];
        this.projectDevices = [];
        this.selected = false;
        this.codeField = "{}";
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }
    Object.defineProperty(Component.prototype, "allDevices", {
        get: function () {
            "use strict";
            return [].concat(this.devices, this.projectDevices);
        },
        enumerable: true,
        configurable: true
    });
    Component.prototype.ngOnInit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.getProjects()
            .then(function (projects) {
            _this.projects = projects.filter(function (project) { return project.m_projects_id.length > 0 || project.update_permission; });
            _this.loadFromProject();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("Projects cannot be loaded.", reason));
        });
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        this.backEnd.getScreenTypes()
            .then(function (devices) { return _this.devices = devices.public_types; })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Target devices cannot be loaded.", reason)); });
    };
    Component.prototype.getProject = function () {
        "use strict";
        return libBecki.getAdvancedField(this.projectField, this.projects.map(function (project) { return project.id; }));
    };
    Component.prototype.getGroup = function () {
        "use strict";
        return libBecki.getAdvancedField(this.groupField, this.groups.map(function (group) { return group.id; }));
    };
    Component.prototype.getBoard = function () {
        "use strict";
        var _this = this;
        return this.deviceField ? this.allDevices.find(function (device) { return device.id == _this.deviceField; }) : null;
    };
    Component.prototype.loadFromProject = function () {
        "use strict";
        var _this = this;
        this.groupField = "";
        this.groups = [];
        this.deviceField = "";
        this.projectDevices = [];
        if (this.getProject()) {
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            this.backEnd.getProject(this.getProject())
                .then(function (project) {
                return Promise.all([
                    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                    Promise.all(project.m_projects_id.map(function (id) { return _this.backEnd.getMProject(id); })),
                    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                    Promise.all(project.screen_size_types_id.map(function (id) { return _this.backEnd.getScreenType(id); }))
                ]);
            })
                .then(function (result) {
                var groups;
                groups = result[0], _this.projectDevices = result[1];
                _this.groups = groups;
            })
                .catch(function (reason) {
                _this.notifications.current.push(new libBeckiNotifications.Danger("Application groups/devices cannot be loaded: " + reason));
            });
        }
    };
    Component.prototype.onProjectChange = function () {
        "use strict";
        this.loadFromProject();
    };
    Component.prototype.validateNameField = function () {
        "use strict";
        var _this = this;
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        return function () { return _this.backEnd.getMPrograms().then(function (applications) { return !applications.find(function (application) { return application.program_name == _this.nameField; }); }); };
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        if (!this.selected) {
            this.selected = true;
            return;
        }
        this.notifications.shift();
        Promise.resolve(this.getProject() || this.backEnd.createDefaultProject().then(function (project) {
            _this.projects = [project];
            _this.projectField = project.id;
            return project.id;
        }))
            .then(function (project) {
            return _this.getGroup() || _this.backEnd.createMProject("Default", "An automatically created group. It can be edited or removed like any other group.", project).then(function (group) {
                _this.groups = [group];
                _this.groupField = group.id;
                return group.id;
            });
        })
            .then(function (group) {
            return _this.backEnd.createMProgram(_this.nameField, _this.descriptionField, _this.deviceField, _this.codeField, group);
        })
            .then(function () {
            _this.notifications.next.push(new libBeckiNotifications.Success("The application has been created."));
            _this.router.navigate(["/user/applications"]);
        })
            .catch(function (reason) {
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-302
            _this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-302"));
            _this.notifications.current.push(new libBeckiNotifications.Danger("The application cannot be created.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.router.navigate(["/user/applications"]);
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-application-new.html",
            directives: [
                libBeckiCustomValidator.Directive,
                libBeckiFieldApplication.Component,
                libBeckiLayout.Component,
                ngCommon.CORE_DIRECTIVES
            ]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-application-new.js.map