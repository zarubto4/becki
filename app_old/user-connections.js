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
var ngCore = require("@angular/core");
var ngRouter = require("@angular/router");
var libBecki = require("./lib-becki/index");
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var libPatternFlyListView = require("./lib-patternfly/list-view");
function composeConnectionDescription(connection) {
    "use strict";
    var description = connection.user_agent;
    if (connection.notification_subscriber) {
        description += " (notifications)";
    }
    return description;
}
var Component = (function () {
    function Component(home, backEnd, notifications, router) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Connections", ["/user/connections"])
        ];
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        this.refresh();
    };
    Component.prototype.refresh = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        Promise.all([
            this.backEnd.getConnections(),
            this.backEnd.getSignedUser()
        ])
            .then(function (result) {
            var connections;
            var user;
            connections = result[0], user = result[1];
            _this.items = connections.map(function (connection) { return new libPatternFlyListView.Item(connection.connection_id, libBecki.timestampToString(connection.created), composeConnectionDescription(connection), null, connection.delete_permission); });
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("Connections cannot be loaded.", reason));
        });
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-217
        this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-217"));
    };
    Component.prototype.onRemoveClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.removeConnection(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The connection has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The connection cannot be removed.", reason));
        });
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-connections.html",
            directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ngRouter.ROUTER_DIRECTIVES]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-connections.js.map