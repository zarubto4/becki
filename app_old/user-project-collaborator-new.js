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
var ngCore = require("@angular/core");
var ngRouter = require("@angular/router");
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiCustomValidator = require("./lib-becki/custom-validator");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var Component = (function () {
    function Component(home, activatedRoute, backEnd, notifications, router) {
        "use strict";
        this.projectName = "Loading...";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Projects", ["/user/projects"])
        ];
        this.idField = "";
        this.addCollaborator = false;
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
            _this.projectId = params["project"];
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            _this.backEnd.getProject(_this.projectId)
                .then(function (project) {
                _this.projectName = project.project_name;
                _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(project.project_name, ["/user/projects", _this.projectId]));
                _this.breadcrumbs.push(new libBeckiLayout.LabeledLink("New Collaborator", ["/user/projects", _this.projectId, "collaborator/new"]));
                _this.addCollaborator = project.share_permission;
            })
                .catch(function (reason) {
                _this.notifications.current.push(new libBeckiNotifications.Danger("The project cannot be loaded.", reason));
            });
        });
    };
    Component.prototype.ngOnDestroy = function () {
        "use strict";
        this.routeParamsSubscription.unsubscribe();
    };
    Component.prototype.validateIdField = function () {
        "use strict";
        var _this = this;
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return function () { return _this.backEnd.getProject(_this.projectId).then(function (project) { return !project.owners_id.indexOf(_this.idField); }); };
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.addCollaboratorToProject(this.idField, this.projectId)
            .then(function () {
            _this.notifications.next.push(new libBeckiNotifications.Success("The collaborator has been added."));
            _this.router.navigate(["/user/projects", _this.projectId]);
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The collaborator cannot be added.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.router.navigate(["/user/projects", this.projectId]);
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-project-collaborator-new.html",
            directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-project-collaborator-new.js.map