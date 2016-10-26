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
var ngCommon = require("@angular/common");
var ngCore = require("@angular/core");
var ngRouter = require("@angular/router");
var libBackEnd = require("./lib-back-end/index");
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiCustomValidator = require("./lib-becki/custom-validator");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var libPatternFlyListView = require("./lib-patternfly/list-view");
var router_1 = require("@angular/router");
var Component = (function () {
    function Component(activatedRoute, backEnd, notifications, router) {
        "use strict";
        this.name = "Loading...";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink("home", ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Projects", ["/user/projects"])
        ];
        this.tab = "details";
        this.nameField = "Loading...";
        this.descriptionField = "Loading...";
        this.description = "Loading...";
        this.editProject = false;
        this.addCollaborator = false;
        this.addIntoProject = false;
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
            _this.id = params["project"];
            _this.refresh();
        });
    };
    Component.prototype.ngOnDestroy = function () {
        "use strict";
        this.routeParamsSubscription.unsubscribe();
    };
    Component.prototype.tabPermissionCheck = function () {
        "use strict";
        switch (this.tab) {
            case "details":
                return this.editProject;
            case "devices":
                return this.addIntoProject;
            case "schemes":
                return this.addIntoProject;
            case "applications":
                return this.addIntoProject;
            case "collaborators":
                return this.addCollaborator;
        }
    };
    Component.prototype.onTabClick = function (tab) {
        "use strict";
        this.tab = tab;
    };
    Component.prototype.refresh = function () {
        "use strict";
        var _this = this;
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        this.backEnd.getProject(this.id)
            .then(function (project) {
            return Promise.all([
                project,
                Promise.all(project.owners_id.map(function (id) { return _this.backEnd.getUser(id); })),
                Promise.all(project.c_programs_id.map(function (id) { return _this.backEnd.getCProgram(id); })),
                Promise.all(project.b_programs_id.map(function (id) { return _this.backEnd.getBProgram(id); })),
                Promise.all(project.m_projects_id.map(function (id) { return _this.backEnd.getMProject(id); }))
            ]);
        })
            .then(function (result) {
            var project;
            var collaborators;
            var Devices;
            var Schemes;
            var Applications;
            project = result[0], collaborators = result[1], Devices = result[2], Schemes = result[3], Applications = result[4];
            _this.name = project.project_name;
            _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(project.project_name, ["/user/projects", _this.id]));
            _this.nameField = project.project_name;
            _this.descriptionField = project.project_description;
            _this.description = project.project_description;
            _this.editProject = project.edit_permission;
            _this.addIntoProject = project.update_permission;
            _this.addCollaborator = project.share_permission;
            _this.collaborators = collaborators.map(function (collaborator) { return new libPatternFlyListView.Item(collaborator.id, libBackEnd.composeUserString(collaborator, true), null, undefined, project.unshare_permission); });
            _this.devices = Devices.map(function (device) { return new libPatternFlyListView.Item(device.id, device.program_name, device.program_description, ["/user/device/programs", device.id], device.delete_permission); });
            _this.schemes = Schemes.map(function (scheme) { return new libPatternFlyListView.Item(scheme.id, scheme.name, scheme.program_description, ["/user/interactions/schemes", scheme.id], scheme.delete_permission); });
            _this.applications = Applications.map(function (application) { return new libPatternFlyListView.Item(application.id, application.program_name, application.program_description, ["/user/applications", application.id], application.delete_permission); });
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The project " + _this.id + " cannot be loaded.", reason));
        });
    };
    Component.prototype.onRemoveDevicesClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteCProgram(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The c_program has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The c_program cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveSchemesClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteBProgram(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The b_program has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The b_program cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveApplicationsClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteMProject(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The M_project has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The M_project cannot be removed.", reason));
        });
    };
    Component.prototype.onAddClick = function () {
        switch (this.tab) {
            case "details":
                this.router.navigate(["/user/projects", this.id, "edit"]);
                break;
            case "devices":
                this.router.navigate(["/user/device/program/new"]);
                break;
            case "schemes":
                this.router.navigate(["/user/interactions/scheme/new"]);
                break;
            case "applications":
                this.router.navigate(["/user/application/group/new"]);
                break;
            case "collaborators":
                this.router.navigate(["/user/projects", this.id, "collaborator/new"]);
                break;
        }
    };
    Component.prototype.onCollaboratorAddClick = function () {
        "use strict";
        this.router.navigate(["/user/projects", this.id, "collaborator/new"]);
    };
    Component.prototype.onCollaboratorRemoveClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.removeCollaboratorsFromProject([id], this.id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The collaborator has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The collaborator cannot be removed.", reason));
        });
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-project.html",
            directives: [
                libBeckiCustomValidator.Directive,
                libBeckiLayout.Component,
                libPatternFlyListView.Component,
                ngCommon.CORE_DIRECTIVES,
                ngRouter.ROUTER_DIRECTIVES
            ]
        }), 
        __metadata('design:paramtypes', [ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service, router_1.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-project.js.map