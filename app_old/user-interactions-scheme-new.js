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
var ngCommon = require("@angular/common");
var ngCore = require("@angular/core");
var ngRouter = require("@angular/router");
var libBecki = require("./lib-becki/index");
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiCustomValidator = require("./lib-becki/custom-validator");
var libBeckiFieldInteractionsScheme = require("./lib-becki/field-interactions-scheme");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var Component = (function () {
    function Component(home, backEnd, notifications, router) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("New Scheme of Interactions", ["/user/interactions/scheme/new"])
        ];
        this.projectField = "";
        this.nameField = "";
        this.descriptionField = "";
        this.deviceField = "";
        this.deviceProgramField = "";
        this.showGroups = false;
        this.groupField = "";
        this.schemeField = "{\"blocks\":{}}";
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        Promise.all([
            this.backEnd.getProjects(),
            this.backEnd.getAllTypeOfBoard()
        ])
            .then(function (result) {
            var projects;
            projects = result[0], _this.deviceTypes = result[1];
            _this.projects = projects.filter(function (project) { return project.update_permission; });
            _this.loadFromProject();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("Projects cannot be loaded.", reason));
        });
    };
    Component.prototype.getProject = function () {
        "use strict";
        return libBecki.getAdvancedField(this.projectField, this.projects.map(function (project) { return project.id; }));
    };
    Component.prototype.loadFromProject = function () {
        "use strict";
        var _this = this;
        this.devices = [];
        this.devicePrograms = [];
        this.showGroups = false;
        this.groups = [];
        if (this.getProject()) {
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            this.backEnd.getProject(this.getProject())
                .then(function (project) {
                return Promise.all([
                    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                    Promise.all(project.boards_id.map(function (id) { return _this.backEnd.getBoard(id); })),
                    Promise.all(project.c_programs_id.map(function (id) { return _this.backEnd.getCProgram(id); })),
                    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                    Promise.all(project.m_projects_id.map(function (id) { return _this.backEnd.getMProject(id); }))
                ]);
            })
                .then(function (result) {
                var groups;
                _this.devices = result[0], _this.devicePrograms = result[1], groups = result[2];
                _this.showGroups = groups.length > 1 || (groups.length == 1 && !groups[0].m_programs.length);
                _this.groups = groups.filter(function (group) { return group.update_permission; });
            })
                .catch(function (reason) {
                _this.notifications.current.push(new libBeckiNotifications.Danger("MProgram groups cannot be loaded.", reason));
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
        return function () { return _this.backEnd.getProjects()
            .then(function (projects) { return Promise.all((_a = []).concat.apply(_a, projects.map(function (project) { return project.b_programs_id; })).map(function (id) { return _this.backEnd.getBProgram(id); })); var _a; })
            .then(function (schemes) { return !schemes.find(function (scheme) { return scheme.name == _this.nameField; }); }); };
    };
    Component.prototype.getProgramsForDevice = function () {
        "use strict";
        var _this = this;
        if (!this.deviceField) {
            return [];
        }
        var device = this.devices.find(function (device) { return device.id == _this.deviceField; });
        var type = this.deviceTypes.find(function (type) { return type.id == device.type_of_board_id; });
        return this.devicePrograms.filter(function (program) { return program.type_of_board_id == type.id; });
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        Promise.resolve(this.getProject() || this.backEnd.createDefaultProject().then(function (project) {
            _this.projects = [project];
            _this.projectField = project.id;
            return project.id;
        }))
            .then(function (project) {
            return _this.backEnd.createBProgram(_this.nameField, _this.descriptionField, project);
        })
            .then(function (scheme) {
            return _this.backEnd.addVersionToBProgram("Initial version", "", _this.schemeField, [], { board_id: _this.deviceField, c_program_version_id: _this.deviceProgramField }, scheme.id);
        })
            .then(function (version) {
            return _this.groupField ? _this.backEnd.addMProjectConnection(_this.groupField, version.version_Object.id, false) : null;
        })
            .then(function () {
            _this.notifications.next.push(new libBeckiNotifications.Success("The scheme have been created."));
            _this.router.navigate(["/user/interactions/schemes"]);
        })
            .catch(function (reason) {
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-284
            _this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-284"));
            _this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be created.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.router.navigate(["/user/interactions/schemes"]);
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-interactions-scheme-new.html",
            directives: [
                libBeckiCustomValidator.Directive,
                libBeckiFieldInteractionsScheme.Component,
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
//# sourceMappingURL=user-interactions-scheme-new.js.map