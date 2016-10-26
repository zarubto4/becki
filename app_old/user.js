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
var libBackEnd = require("./lib-back-end/index");
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiCustomValidator = require("./lib-becki/custom-validator");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var Selectable = (function () {
    function Selectable(model, selected, selectable) {
        "use strict";
        if (selectable === void 0) { selectable = true; }
        this.model = model;
        this.selected = selected;
        this.select = selected;
        this.selectable = selectable;
    }
    return Selectable;
}());
var Component = (function () {
    function Component(home, activatedRoute, backEnd, notifications, router) {
        "use strict";
        this.userString = "Loading...";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("Users", ["/"])
        ];
        this.editing = false;
        this.tab = 'account';
        this.editAccount = false;
        this.nameField = "Loading...";
        this.usernameField = "Loading...";
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
            _this.id = params["user"];
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
        this.backEnd.getUser(this.id)
            .then(function (user) {
            _this.userString = libBackEnd.composeUserString(user, true);
            _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(libBackEnd.composeUserString(user, true), ["/users", _this.id]));
            _this.editAccount = user.edit_permission;
            _this.nameField = user.full_name;
            _this.usernameField = user.nick_name;
            _this.user = user;
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The user " + _this.id + " cannot be loaded.", reason));
        });
        Promise.all([
            this.backEnd.getRoles(),
            this.backEnd.getPermissions(),
            this.backEnd.getUserRolesAndPermissions(this.id)
        ])
            .then(function (result) {
            var roles;
            var permissions;
            var userPermissions;
            roles = result[0], permissions = result[1], userPermissions = result[2];
            _this.roles = roles.map(function (role) { return new Selectable(role, userPermissions.roles.find(function (userRole) { return userRole.id == role.id; }) != undefined, role.update_permission); });
            _this.permissions = permissions.map(function (permission) { return new Selectable(permission, userPermissions.permissions.find(function (userPermission) { return userPermission.value == permission.value; }) != undefined, permission.edit_person_permission); });
        });
    };
    Component.prototype.onEditClick = function () {
        "use strict";
        this.editing = !this.editing;
    };
    Component.prototype.onTabClick = function (tab) {
        "use strict";
        this.tab = tab;
    };
    Component.prototype.validateAccountUsernameField = function () {
        "use strict";
        var _this = this;
        return function () {
            if (_this.usernameField) {
                return _this.backEnd.getUsernameUsed(_this.usernameField);
            }
            else {
                return Promise.resolve(true);
            }
        };
    };
    Component.prototype.onAccountSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.updateUser(this.id, this.nameField, this.usernameField, "", this.user.last_title)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The user has been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The user cannot be updated.", reason));
        });
    };
    Component.prototype.onRolesSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        Promise.all(this.roles.filter(function (role) { return role.selected != role.select; }).map(function (role) {
            if (role.select) {
                return _this.backEnd.addRoleToUser(role.model.id, _this.id);
            }
            else {
                return _this.backEnd.removeRoleFromUser(role.model.id, _this.id);
            }
        }))
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The roles have been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The roles cannot be updated.", reason));
        });
    };
    Component.prototype.onPermissionsSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        Promise.all(this.permissions.filter(function (permission) { return permission.selected != permission.select; }).map(function (permission) {
            if (permission.select) {
                return _this.backEnd.addPermissionToUser(permission.model.value, _this.id);
            }
            else {
                return _this.backEnd.removePermissionFromUser(permission.model.value, _this.id);
            }
        }))
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The permissions have been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The permissions cannot be updated.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.editing = false;
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user.html",
            directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user.js.map