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
var _ = require("underscore");
var ngCommon = require("@angular/common");
var ngCore = require("@angular/core");
var ngRouter = require("@angular/router");
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiCustomValidator = require("./lib-becki/custom-validator");
var libBeckiFieldIDE = require("./lib-becki/field-ide");
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
            new libBeckiLayout.LabeledLink("Board Programs", ["/user/device/programs"])
        ];
        this.showHistory = false;
        this.editing = false;
        this.editProgram = false;
        this.addVersion = false;
        this.nameField = "Loading...";
        this.descriptionField = "Loading...";
        this.description = "Loading...";
        this.deviceType = "";
        this.versionNameField = "Loading...";
        this.versionName = "Loading...";
        this.versionDescriptionField = "Loading...";
        this.versionDescription = "Loading...";
        this.versionCodeField = {};
        this.versionCode = {};
        this.activatedRoute = activatedRoute;
        this.backEnd = backEnd;
        this.notifications = notifications;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(function (params) {
            _this.id = params["program"];
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
        this.backEnd.getCProgram(this.id)
            .then(function (program) {
            if (!program.program_versions.length) {
                throw new Error("the program has no version");
            }
            var lastVersion = _.max(program.program_versions, function (version) { return version.version_object.date_of_create; });
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-309
            var lastVersionFiles = _.object(JSON.parse(lastVersion.version_code).user_files.map(function (file) { return [file.file_name, file.code]; }));
            _this.name = program.program_name;
            _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(program.program_name, ["/user/device/programs", _this.id]));
            _this.editProgram = program.edit_permission;
            _this.addVersion = program.update_permission;
            _this.nameField = program.program_name;
            _this.descriptionField = program.program_description;
            _this.description = program.program_description;
            _this.deviceType = program.type_of_board_id;
            _this.versionNameField = lastVersion.version_object.version_name;
            _this.versionName = lastVersion.version_object.version_name;
            _this.versionDescriptionField = lastVersion.version_object.version_description;
            _this.versionDescription = lastVersion.version_object.version_description;
            _this.versionCodeField = _.clone(lastVersionFiles);
            _this.versionCode = _.clone(lastVersionFiles);
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-126
            _this.versions = program.program_versions.map(function (version) { return new libPatternFlyListView.Item(version.version_object.id, version.version_object.version_name + " (issue/TYRION-126)", version.version_object.version_description, undefined, false); });
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The program " + _this.id + " cannot be loaded.", reason));
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
            .then(function (projects) { return Promise.all((_a = []).concat.apply(_a, projects.map(function (project) { return project.c_programs_id; })).map(function (id) { return _this.backEnd.getCProgram(id); })); var _a; })
            .then(function (programs) { return !programs.find(function (program) { return program.id != _this.id && program.program_name == _this.nameField; }); }); };
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.updateCProgram(this.id, this.nameField, this.descriptionField, this.deviceType)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The program has been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The program cannot be updated.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.editing = false;
    };
    Component.prototype.validateVersionNameField = function () {
        "use strict";
        var _this = this;
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        return function () { return _this.backEnd.getCProgram(_this.id).then(function (program) { return !program.program_versions.find(function (version) { return version.version_object.version_name == _this.versionNameField; }); }); };
    };
    Component.prototype.onVersionSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.addVersionToDeviceProgram(this.versionNameField, this.versionDescriptionField, this.versionCodeField, this.id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The version has been created."));
            _this.refresh();
        })
            .catch(function (reason) {
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-275
            _this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-275"));
            _this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        });
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-device-program.html",
            directives: [
                libBeckiCustomValidator.Directive,
                libBeckiFieldIDE.Component,
                libBeckiLayout.Component,
                libPatternFlyListView.Component,
                ngCommon.CORE_DIRECTIVES,
                ngRouter.ROUTER_DIRECTIVES
            ]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-device-program.js.map