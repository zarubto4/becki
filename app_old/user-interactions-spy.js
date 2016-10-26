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
var libBeckiFieldInteractionsScheme = require("./lib-becki/field-interactions-scheme");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var Component = (function () {
    function Component(home, activatedRoute, backEnd, notifications) {
        "use strict";
        this.versionName = "Loading...";
        this.name = "Loading...";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Spies of Interactions", ["/user/interactions/spies"])
        ];
        this.scheme = "{\"blocks\":{}}";
        this.activatedRoute = activatedRoute;
        this.backEnd = backEnd;
        this.notifications = notifications;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(function (params) {
            var id = params["spy"];
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            _this.backEnd.getBProgram(id)
                .then(function (scheme) {
                if (!scheme.program_state.uploaded) {
                    throw new Error("scheme not deployed");
                }
                var version = scheme.program_versions.find(function (version) { return version.version_Object.id == scheme.program_state.version_id; });
                _this.versionName = version.version_Object.version_name;
                _this.name = scheme.name;
                _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(scheme.name + " " + version.version_Object.version_name, ["/user/interactions/spies", id]));
                _this.scheme = version.program;
                _this.versionId = version.version_Object.id;
            })
                .catch(function (reason) {
                _this.notifications.current.push(new libBeckiNotifications.Danger("The spy cannot be loaded.", reason));
            });
        });
    };
    Component.prototype.ngOnDestroy = function () {
        "use strict";
        this.routeParamsSubscription.unsubscribe();
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-interactions-spy.html",
            directives: [libBeckiFieldInteractionsScheme.Component, libBeckiLayout.Component]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-interactions-spy.js.map