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
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiCustomValidator = require("./lib-becki/custom-validator");
var libBeckiNotifications = require("./lib-becki/notifications");
var REDIRECT_URL = window.location.pathname + "#";
var Component = (function () {
    function Component(home, backEnd, notifications, router) {
        "use strict";
        this.home = home;
        this.signIn = true;
        this.inEmailField = "";
        this.inPasswordField = "";
        this.upEmailField = "";
        this.upPassword1Field = "";
        this.upPassword2Field = "";
        this.upUsernameField = "";
        this.redirecting = false;
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        this.notifications.shift();
        // TODO: https://groups.google.com/d/msg/angular/IJf-KyGC3Gs/h33mlUTrAwAJ
        document.documentElement.classList.add("login-pf");
    };
    Component.prototype.ngOnDestroy = function () {
        "use strict";
        // TODO: https://groups.google.com/d/msg/angular/IJf-KyGC3Gs/h33mlUTrAwAJ
        document.documentElement.classList.remove("login-pf");
    };
    Component.prototype.redirect = function (url) {
        "use strict";
        this.redirecting = true;
        location.href = url;
    };
    Component.prototype.onSignInClick = function () {
        "use strict";
        this.signIn = true;
    };
    Component.prototype.onSignInSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.createToken(this.inEmailField, this.inPasswordField)
            .then(function () { return _this.router.navigate(["/"]); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("The user cannot be signed in.", reason)); });
    };
    Component.prototype.onFacebookSignInClick = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.createFacebookToken(REDIRECT_URL)
            .then(function (url) { return _this.redirect(url); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("The user cannot be signed in.", reason)); });
    };
    Component.prototype.onGitHubSignInClick = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.createGitHubToken(REDIRECT_URL)
            .then(function (url) { return _this.redirect(url); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("The user cannot be signed in.", reason)); });
    };
    Component.prototype.onSignUpClick = function () {
        "use strict";
        this.signIn = false;
    };
    Component.prototype.validateUpEmailField = function () {
        "use strict";
        var _this = this;
        return function () {
            if (_this.upEmailField) {
                return _this.backEnd.getUserEmailUsed(_this.upEmailField);
            }
            else {
                return Promise.resolve(true);
            }
        };
    };
    Component.prototype.validateUpPasswordField = function () {
        "use strict";
        var _this = this;
        return function () { return Promise.resolve(_this.upPassword1Field == _this.upPassword2Field); };
    };
    Component.prototype.validateUpUsernameField = function () {
        "use strict";
        var _this = this;
        return function () {
            if (_this.upUsernameField.length >= 8) {
                return _this.backEnd.getUsernameUsed(_this.upUsernameField);
            }
            else {
                return Promise.resolve(true);
            }
        };
    };
    Component.prototype.onSignUpSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.createUser(this.upEmailField, this.upPassword1Field, this.upUsernameField)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The user have been signed up. It is necessary to follow the instructions sent to their email before signing in."));
            _this.signIn = true;
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The user cannot be signed up.", reason));
        });
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/signing.html",
            directives: [libBeckiCustomValidator.Directive, libBeckiNotifications.Component, ngCommon.CORE_DIRECTIVES]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=signing.js.map