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
var Component = (function () {
    function Component(home, activatedRoute, backEnd, notifications) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("System", ["/system"]),
            new libBeckiLayout.LabeledLink("Library Groups", ["/system/library/groups"])
        ];
        this.editing = false;
        this.nameField = "Loading...";
        this.descriptionField = "Loading...";
        this.activatedRoute = activatedRoute;
        this.backEnd = backEnd;
        this.notifications = notifications;
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
        this.backEnd.getLibraryGroup(this.id)
            .then(function (group) {
            _this.group = group;
            _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(group.group_name, ["/system/library/groups", _this.id]));
            _this.breadcrumbs[3].label = group.group_name;
            _this.nameField = group.group_name;
            _this.descriptionField = group.description;
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
        return function () { return Promise.all([
            _this.backEnd.getLibraries(1),
            _this.backEnd.getLibraryGroups(1)
        ])
            .then(function (result) {
            var librariesPage;
            var groupsPage;
            librariesPage = result[0], groupsPage = result[1];
            return Promise.all([
                Promise.all(librariesPage.pages.map(function (number) { return _this.backEnd.getLibraries(number); })),
                Promise.all(groupsPage.pages.map(function (number) { return _this.backEnd.getLibraryGroups(number); }))
            ]);
        })
            .then(function (result) {
            var librariesPages;
            var groupsPages;
            librariesPages = result[0], groupsPages = result[1];
            return !(_a = []).concat.apply(_a, groupsPages.map(function (page) { return page.content; })).find(function (group) { return group.id != _this.id && group.group_name == _this.nameField; }) &&
                !(_b = []).concat.apply(_b, librariesPages.map(function (page) { return page.content; })).find(function (library) { return library.library_name == _this.nameField; });
            var _a, _b;
        }); };
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.updateLibraryGroup(this.id, this.nameField, this.descriptionField)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The group has been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-283"));
            _this.notifications.current.push(new libBeckiNotifications.Danger("The group cannot be updated.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.editing = false;
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/system-library-group.html",
            directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=system-library-group.js.map