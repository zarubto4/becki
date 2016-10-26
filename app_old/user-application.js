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
var libBeckiCustomValidator = require("./lib-becki/custom-validator");
var libBeckiFieldApplication = require("./lib-becki/field-application");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var Component = (function () {
    function Component(home, activatedRoute, backEnd, notifications, router) {
        "use strict";
        this.name = "Loading...";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Applications", ["/user/applications"])
        ];
        this.editing = false;
        this.editApplication = false;
        this.showProject = false;
        this.showGroup = false;
        this.group = "Loading...";
        this.nameField = "Loading...";
        this.descriptionField = "Loading...";
        this.description = "Loading...";
        this.device = null;
        this.codeField = "{}";
        this.code = "{}";
        this.activatedRoute = activatedRoute;
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(function (params) {
            _this.id = params["application"];
            _this.refresh();
        });
    };
    Component.prototype.ngOnDestroy = function () {
        "use strict";
        this.routeParamsSubscription.unsubscribe();
    };
    Component.prototype.refresh = function () {
        "use strict";
        var _this = this;
        this.editing = false;
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        this.backEnd.getMProgram(this.id)
            .then(function (application) {
            return Promise.all([
                application,
                _this.backEnd.getProjects(),
                // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                _this.backEnd.getMProject(application.m_project_id),
                // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                _this.backEnd.getScreenType(application.screen_size_type_id)
            ]);
        })
            .then(function (result) {
            var application;
            var projects;
            var group;
            var device;
            application = result[0], projects = result[1], group = result[2], device = result[3];
            _this.name = application.program_name;
            _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(application.program_name, ["/user/applications", _this.id]));
            _this.editApplication = application.edit_permission;
            _this.showProject = projects.length > 1;
            _this.project = projects.find(function (project) { return project.id == group.project_id; });
            _this.showGroup = _this.project.m_projects_id.length > 1;
            _this.group = group.program_name;
            _this.nameField = application.program_name;
            _this.descriptionField = application.program_description;
            _this.description = application.program_description;
            if (!_this.device) {
                _this.device = device;
            }
            _this.codeField = application.m_code;
            _this.code = application.m_code;
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The application " + _this.id + " cannot be loaded.", reason));
        });
    };
    Component.prototype.onEditClick = function () {
        "use strict";
        this.editing = !this.editing;
    };
    Component.prototype.validateNameField = function () {
        "use strict";
        var _this = this;
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        return function () { return _this.backEnd.getMPrograms().then(function (applications) { return !applications.find(function (application) { return application.id != _this.id && application.program_name == _this.nameField; }); }); };
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.updateMProgram(this.id, this.nameField, this.descriptionField, this.device.id, this.codeField)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The application has been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The application cannot be updated.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.editing = false;
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-application.html",
            directives: [
                libBeckiCustomValidator.Directive, libBeckiFieldApplication.Component, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES
            ]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-application.js.map