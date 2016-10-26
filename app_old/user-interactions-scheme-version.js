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
var libBeckiFieldInteractionsScheme = require("./lib-becki/field-interactions-scheme");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var Component = (function () {
    function Component(home, activatedRoute, backEnd, notifications, router) {
        "use strict";
        this.name = "Loading...";
        this.schemeName = "Loading...";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Schemes of Interactions", ["/user/interactions/schemes"])
        ];
        this.description = "Loading...";
        this.showGroups = false;
        this.scheme = "{\"blocks\":{}}";
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
            var id = params["version"];
            var schemeId = params["scheme"];
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            _this.backEnd.getBProgram(schemeId)
                .then(function (scheme) {
                return Promise.all([
                    scheme,
                    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                    _this.backEnd.getProject(scheme.project_id)
                ]);
            })
                .then(function (result) {
                var scheme;
                var project;
                scheme = result[0], project = result[1];
                return Promise.all([
                    scheme,
                    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                    Promise.all(project.m_projects_id.map(function (id) { return _this.backEnd.getMProject(id); }))
                ]);
            })
                .then(function (result) {
                var scheme;
                var groups;
                scheme = result[0], groups = result[1];
                var version = scheme.program_versions.find(function (version) { return version.version_Object.id == id; });
                if (!version) {
                    throw new Error("version " + id + " not found in scheme " + scheme.name);
                }
                _this.name = version.version_Object.version_name;
                _this.schemeName = scheme.name;
                _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(scheme.name, ["/user/interactions/schemes", schemeId]));
                _this.breadcrumbs.push(new libBeckiLayout.LabeledLink("Versions", ["/user/interactions/schemes", schemeId, "versions"]));
                _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(version.version_Object.version_name, ["/user/interactions/schemes", schemeId, "versions", id]));
                _this.description = version.version_Object.version_description;
                _this.showGroups = groups.length > 1 || (groups.length == 1 && !groups[0].m_programs.length);
                _this.groups = groups.filter(function (group) { return group.b_progam_connected_version_id && group.b_progam_connected_version_id == id; });
                _this.scheme = version.program;
            })
                .catch(function (reason) {
                _this.notifications.current.push(new libBeckiNotifications.Danger("The scheme " + schemeId + " cannot be loaded.", reason));
            });
        });
    };
    Component.prototype.ngOnDestroy = function () {
        "use strict";
        this.routeParamsSubscription.unsubscribe();
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-interactions-scheme-version.html",
            directives: [libBeckiFieldInteractionsScheme.Component, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-interactions-scheme-version.js.map