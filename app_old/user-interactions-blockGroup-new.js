/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
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
            new libBeckiLayout.LabeledLink("New block groups", ["/user/interactions/block/group/new"])
        ];
        this.projectField = "";
        this.nameField = "";
        this.descriptionField = "";
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.getProjects()
            .then(function (projects) {
            _this.projects = projects.filter(function (project) { return project.update_permission; });
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("Projects cannot be loaded.", reason));
        });
    };
    Component.prototype.getProject = function () {
        "use strict";
        return libBecki.getAdvancedField(this.projectField, this.projects.map(function (project) { return project.id; }));
    };
    Component.prototype.validateNameField = function () {
        "use strict";
        var _this = this;
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        return function () { return _this.backEnd.getAllTypeOfBlock()
            .then(function (groups) { return !groups.find(function (groups) { return groups.name == _this.nameField; }); }); };
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
            return _this.backEnd.createTypeOfBlock(_this.nameField, _this.descriptionField, project);
        })
            .then(function () {
            _this.notifications.next.push(new libBeckiNotifications.Success("The scheme have been created."));
            _this.router.navigate(["/user/interactions/block/groups"]);
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be created.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.router.navigate(["/user/interactions/block/groups"]);
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-interactions-blockGroups-new.html",
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
//# sourceMappingURL=user-interactions-blockGroup-new.js.map