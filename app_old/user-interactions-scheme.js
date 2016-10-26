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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _ = require("underscore");
var ngCommmon = require("@angular/common");
var ngCore = require("@angular/core");
var ngRouter = require("@angular/router");
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiCustomValidator = require("./lib-becki/custom-validator");
var libBeckiFieldInteractionsScheme = require("./lib-becki/field-interactions-scheme");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var libPatternFlyListView = require("./lib-patternfly/list-view");
var Component = (function () {
    function Component(home, activatedRoute, backEnd, notifications) {
        "use strict";
        this.name = "Loading...";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Schemes of Interactions", ["/user/interactions/schemes"])
        ];
        this.showHistory = false;
        this.editing = false;
        this.editScheme = false;
        this.addVersion = false;
        this.nameField = "Loading...";
        this.descriptionField = "Loading...";
        this.description = "Loading...";
        this.versionNameField = "";
        this.versionName = "Loading...";
        this.versionDescriptionField = "";
        this.versionDescription = "Loading...";
        this.versionDeviceField = "";
        this.versionDeviceProgramField = "";
        this.showApplicationGroups = false;
        this.versionApplicationGroupField = "";
        this.versionSchemeField = "{\"blocks\":{}}";
        this.versionScheme = "{\"blocks\":{}}";
        this.activatedRoute = activatedRoute;
        this.backEnd = backEnd;
        this.notifications = notifications;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(function (params) {
            _this.id = params["scheme"];
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
            this.backEnd.getBProgram(this.id),
            this.backEnd.getProjects()
        ])
            .then(function (result) {
            var scheme;
            var projects;
            scheme = result[0], projects = result[1];
            var project = projects.find(function (project) { return project.id == scheme.project_id; });
            return Promise.all([
                scheme,
                projects,
                // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                Promise.all(project.boards_id.map(function (id) { return _this.backEnd.getBoard(id); })),
                _this.backEnd.getAllTypeOfBoard(),
                Promise.all(project.c_programs_id.map(function (id) { return _this.backEnd.getCProgram(id); })),
                // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                Promise.all(project.m_projects_id.map(function (id) { return _this.backEnd.getMProject(id); }))
            ]);
        })
            .then(function (result) {
            var scheme;
            var projects;
            var applicationGroups;
            scheme = result[0], projects = result[1], _this.devices = result[2], _this.deviceTypes = result[3], _this.devicePrograms = result[4], applicationGroups = result[5];
            if (!scheme.program_versions.length) {
                throw new Error("the scheme has no version");
            }
            var lastVersion = _.max(scheme.program_versions, function (version) { return version.version_Object.date_of_create; });
            _this.name = scheme.name;
            _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(scheme.name, ["/user/interactions/schemes", _this.id]));
            _this.editScheme = scheme.edit_permission;
            _this.addVersion = scheme.update_permission;
            _this.project = projects.length > 1 ? projects.find(function (project) { return project.id == scheme.project_id; }).project_name : null;
            _this.nameField = scheme.name;
            _this.descriptionField = scheme.program_description;
            _this.description = scheme.program_description;
            _this.versionNameField = lastVersion.version_Object.version_name;
            _this.versionName = lastVersion.version_Object.version_name;
            _this.versionDescriptionField = lastVersion.version_Object.version_description;
            _this.versionDescription = lastVersion.version_Object.version_description;
            _this.showApplicationGroups = applicationGroups.length > 1 || (applicationGroups.length == 1 && !applicationGroups[0].m_programs.length);
            _this.versionApplicationGroups = applicationGroups.filter(function (group) { return group.b_progam_connected_version_id && group.b_progam_connected_version_id == lastVersion.version_Object.id; });
            if (_this.versionApplicationGroups.length) {
                _this.versionApplicationGroupField = _this.versionApplicationGroups[0].id;
            }
            _this.applicationGroups = applicationGroups.filter(function (group) { return group.update_permission; });
            _this.versionSchemeField = lastVersion.program;
            _this.versionScheme = lastVersion.program;
            _this.versions = scheme.program_versions.map(function (version) { return new libPatternFlyListView.Item(version.version_Object.id, version.version_Object.version_name, version.version_Object.version_description, ["/user/interactions/schemes", _this.id, "versions", version.version_Object.id], false); });
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The scheme " + _this.id + " cannot be loaded.", reason));
        });
    };
    Component.prototype.onEditClick = function () {
        "use strict";
        this.editing = !this.editing;
    };
    Component.prototype.onDetailsClick = function () {
        "use strict";
        this.showHistory = false;
    };
    Component.prototype.onHistoryClick = function () {
        "use strict";
        this.showHistory = true;
    };
    Component.prototype.validateNameField = function () {
        "use strict";
        var _this = this;
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        return function () { return _this.backEnd.getProjects()
            .then(function (projects) { return Promise.all((_a = []).concat.apply(_a, projects.map(function (project) { return project.b_programs_id; })).map(function (id) { return _this.backEnd.getBProgram(id); })); var _a; })
            .then(function (schemes) { return !schemes.find(function (scheme) { return scheme.id != _this.id && scheme.name == _this.nameField; }); }); };
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.updateBProgram(this.id, this.nameField, this.descriptionField)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The scheme has been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be updated.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.editing = false;
    };
    Component.prototype.validateVersionNameField = function () {
        "use strict";
        var _this = this;
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return function () { return _this.backEnd.getBProgram(_this.id).then(function (scheme) { return !scheme.program_versions.find(function (version) { return version.version_Object.version_name == _this.versionNameField; }); }); };
    };
    Component.prototype.getProgramsForVersionDevice = function () {
        "use strict";
        var _this = this;
        if (!this.versionDeviceField) {
            return [];
        }
        var device = this.devices.find(function (device) { return device.id == _this.versionDeviceField; });
        var type = this.deviceTypes.find(function (type) { return type.id == device.type_of_board_id; });
        return this.devicePrograms.filter(function (program) { return program.type_of_board_id == type.id; });
    };
    Component.prototype.onVersionSubmit = function () {
        "use strict";
        var _this = this;
        this.backEnd.addVersionToBProgram(this.versionNameField, this.versionDescriptionField, this.versionSchemeField, [], { board_id: this.versionDeviceField, c_program_version_id: this.versionDeviceProgramField }, this.id)
            .then(function (version) {
            return _this.versionApplicationGroupField ? _this.backEnd.addMProjectConnection(_this.versionApplicationGroupField, version.version_Object.id, false) : null;
        })
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The version has been created."));
            _this.refresh();
        })
            .catch(function (reason) {
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-284
            _this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-284"));
            _this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        });
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-interactions-scheme.html",
            directives: [
                libBeckiCustomValidator.Directive,
                libBeckiFieldInteractionsScheme.Component,
                libBeckiLayout.Component,
                libPatternFlyListView.Component,
                ngCommmon.CORE_DIRECTIVES
            ]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-interactions-scheme.js.map