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
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var libPatternFlyListView = require("./lib-patternfly/list-view");
var Component = (function () {
    function Component(home, activatedRoute, backEnd, notifications, router) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Applications Groups", ["/user/application/groups"])
        ];
        this.editing = false;
        this.editGroup = false;
        this.nameField = "Loading...";
        this.descriptionField = "Loading...";
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
            _this.id = params["group"];
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
        Promise.all([
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            this.backEnd.getMProject(this.id),
            this.backEnd.getProjects()
        ])
            .then(function (result) {
            var projects;
            _this.group = result[0], projects = result[1];
            _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(_this.group.program_name, ["/user/application/groups", _this.id]));
            _this.editGroup = _this.group.edit_permission;
            _this.project = projects.length > 1 ? projects.find(function (project) { return project.id == _this.group.project_id; }).project_name : null;
            _this.nameField = _this.group.program_name;
            _this.descriptionField = _this.group.program_description;
            _this.applications = _this.group.m_programs.map(function (application) { return new libPatternFlyListView.Item(application.id, application.program_name, application.program_description, ["/user/applications", application.id], application.delete_permission); });
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The group " + _this.id + " cannot be loaded.", reason));
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
        return function () { return _this.backEnd.getProjects()
            .then(function (projects) { return Promise.all((_a = []).concat.apply(_a, projects.map(function (project) { return project.m_projects_id; })).map(function (id) { return _this.backEnd.getMProject(id); })); var _a; })
            .then(function (groups) { return !groups.find(function (group) { return group.id != _this.id && group.program_name == _this.nameField; }); }); };
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.updateMProject(this.id, this.nameField, this.descriptionField)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The group has been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The group cannot be updated.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.editing = false;
    };
    Component.prototype.onAddApplicationClick = function () {
        "use strict";
        this.router.navigate(["/user/application/new"]);
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
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-application-group.html",
            directives: [
                libBeckiCustomValidator.Directive,
                libBeckiLayout.Component,
                libPatternFlyListView.Component,
                ngCommon.CORE_DIRECTIVES
            ]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-application-group.js.map