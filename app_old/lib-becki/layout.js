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
var backEnd = require("./back-end");
var notifications = require("./notifications");
var libBootstrapDropdown = require("../lib-bootstrap/dropdown");
var HTML_CLASSES = ["layout-pf", "layout-pf-fixed"];
var LabeledLink = (function () {
    function LabeledLink(label, link, icon) {
        "use strict";
        if (icon === void 0) { icon = "file"; }
        this.label = label;
        this.link = link;
        this.icon = icon;
    }
    return LabeledLink;
}());
exports.LabeledLink = LabeledLink;
var Component = (function () {
    function Component(navigation, backendService, router) {
        "use strict";
        this.home = "h";
        this.navbarNotificationsPage = 0;
        this.navbarState = "expanded";
        this.connections = [];
        this.signing = "s";
        this.navigation = navigation;
        this.actionClick = new ngCore.EventEmitter();
        this.lastWindowWidth = null;
        this.backEnd = backendService;
        this.notifications = null;
        this.router = router;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        this.onWindowResize();
        // TODO: https://groups.google.com/d/msg/angular/IJf-KyGC3Gs/h33mlUTrAwAJ
        (_a = document.documentElement.classList).add.apply(_a, HTML_CLASSES);
        var _a;
    };
    Component.prototype.ngOnDestroy = function () {
        "use strict";
        // TODO: https://groups.google.com/d/msg/angular/IJf-KyGC3Gs/h33mlUTrAwAJ
        (_a = document.documentElement.classList).remove.apply(_a, HTML_CLASSES);
        var _a;
    };
    Component.prototype.showNotifications = function (page) {
        "use strict";
        var _this = this;
        this.backEnd.getNotifications(page)
            .then(function (notifications) {
            _this.navbarNotificationsPage = page;
            _this.navbarNotifications = notifications;
        })
            .catch(function (reason) {
            _this.notifications.current.push(new notifications.Danger("Notifications cannot be loaded.", reason));
        });
    };
    Component.prototype.onNotificationsClick = function () {
        "use strict";
        this.notifications.shift();
        this.showNotifications(1);
    };
    Component.prototype.getNotificationIcon = function (notification) {
        "use strict";
        switch (notification.level) {
            case "success":
                return "ok";
            case "warning":
                return "warning-triangle-o";
            case "error":
                return "error-circle-o";
            default:
                return "info";
        }
    };
    Component.prototype.onShowNotificationsClick = function (page, event) {
        "use strict";
        this.notifications.shift();
        this.showNotifications(page);
        event.stopPropagation();
    };
    Component.prototype.onSignOutClick = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteToken()
            .then(function () {
            _this.notifications.next.push(new notifications.Success("Current user have been signed out."));
            _this.router.navigate(_this.signing);
        })
            .catch(function (reason) {
            _this.notifications.current.push(new notifications.Danger("Current user cannot be signed out.", reason));
        });
    };
    Component.prototype.onActionClick = function () {
        "use strict";
        this.actionClick.emit(null);
    };
    Component.prototype.onNavbarToggleClick = function () {
        "use strict";
        var DICTIONARY = {
            expanded: "collapsed",
            collapsed: "expanded",
            visible: "hidden",
            hidden: "visible"
        };
        this.navbarState = DICTIONARY[this.navbarState];
    };
    Component.prototype.onWindowResize = function () {
        "use strict";
        var width = window.innerWidth;
        var widthString = "desktop";
        if (width < 768) {
            widthString = "phone";
        }
        else if (width < 992) {
            widthString = "tablet";
        }
        if (widthString != this.lastWindowWidth) {
            var DICTIONARY = {
                phone: "hidden",
                tablet: "collapsed",
                desktop: "expanded"
            };
            this.navbarState = DICTIONARY[widthString];
        }
        this.lastWindowWidth = widthString;
    };
    __decorate([
        ngCore.Output(), 
        __metadata('design:type', ngCore.EventEmitter)
    ], Component.prototype, "actionClick", void 0);
    __decorate([
        ngCore.HostListener("window:resize"), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', []), 
        __metadata('design:returntype', void 0)
    ], Component.prototype, "onWindowResize", null);
    Component = __decorate([
        ngCore.Component({
            selector: "[layout]",
            templateUrl: "app/lib-becki/layout.html",
            directives: [libBootstrapDropdown.DIRECTIVES, notifications.Component, ngCommon.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
            inputs: ["heading: layout", "breadcrumbs", "actionLabel"]
        }),
        __param(0, ngCore.Inject("navigation")), 
        __metadata('design:paramtypes', [Array, backEnd.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=layout.js.map