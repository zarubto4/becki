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
var blocko = require("blocko");
var ngCommon = require("@angular/common");
var ngCore = require("@angular/core");
var ngRouter = require("@angular/router");
var theGrid = require("the-grid");
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiFieldCode = require("./lib-becki/field-code");
var libBeckiModal = require("./lib-becki/modal");
var libBeckiNotifications = require("./lib-becki/notifications");
var libBootstrapModal = require("./modals/modal");
var projects_new_1 = require("./modals/projects-new");
var Component = (function () {
    function Component(router, backEnd) {
        "use strict";
        var _this = this;
        this.modal = null;
        this.modalClosed = new ngCore.EventEmitter();
        //this.spinnerVisible = false;
        this.notifications = [];
        this.notificationTimeout = null;
        /*router.events.subscribe(event => {
          if (event instanceof ngRouter.NavigationStart) {
            this.spinnerVisible = false;
          } else if (event instanceof ngRouter.NavigationEnd || event instanceof ngRouter.NavigationCancel || event instanceof ngRouter.NavigationError) {
            this.spinnerVisible = false;
          }
        });*/
        backEnd.notificationReceived.subscribe(function (notification) {
            var notificationView;
            switch (notification.level) {
                case "info":
                    notificationView = new libBeckiNotifications.Info(notification.text);
                    break;
                case "success":
                    notificationView = new libBeckiNotifications.Success(notification.text);
                    break;
                case "warning":
                    notificationView = new libBeckiNotifications.Warning(notification.text);
                    break;
                case "error":
                    notificationView = new libBeckiNotifications.Danger(notification.text);
                    break;
                default:
                    return;
            }
            _this.notifications.push(notificationView);
        });
    }
    Component.prototype.showModal = function (model) {
        "use strict";
        var _this = this;
        if (this.modal) {
            throw "only one modal supported yet";
        }
        this.modal = model;
        return new Promise(function (resolve) { return _this.modalClosed.subscribe(resolve); });
    };
    Component.prototype.closeModal = function (result) {
        "use strict";
        this.modal = null;
        this.modalClosed.emit(result);
    };
    Component.prototype.getModalType = function () {
        "use strict";
        if (this.modal instanceof libBootstrapModal.SelectionModel) {
            return "selection";
        }
        if (this.modal instanceof libBootstrapModal.RemovalModel) {
            return "removal";
        }
        if (this.modal instanceof libBootstrapModal.FilenameModel) {
            return "filename";
        }
        if (this.modal instanceof libBeckiModal.WidgetModel) {
            return "widget";
        }
        if (this.modal instanceof libBeckiModal.BlockModel) {
            return "block";
        }
        if (this.modal instanceof projects_new_1.ModalsProjectsNewModel) {
            return "modals-projects-new";
        }
        return null;
    };
    Component.prototype.getWidgetPropertyType = function (property) {
        "use strict";
        switch (property.type) {
            case theGrid.Core.ConfigPropertyType.Integer:
                return "int";
            case theGrid.Core.ConfigPropertyType.Float:
                return "float";
            case theGrid.Core.ConfigPropertyType.String:
                return "text";
            case theGrid.Core.ConfigPropertyType.Boolean:
                return "bool";
            default:
                return null;
        }
    };
    Component.prototype.getBlockPropertyType = function (property) {
        "use strict";
        switch (property.type) {
            case blocko.BlockoCore.ConfigPropertyType.Integer:
                return "int";
            case blocko.BlockoCore.ConfigPropertyType.Float:
                return "float";
            case blocko.BlockoCore.ConfigPropertyType.String:
                return "text";
            case blocko.BlockoCore.ConfigPropertyType.Boolean:
                return "bool";
            case blocko.BlockoCore.ConfigPropertyType.JSString:
                return "javascript";
            default:
                return null;
        }
    };
    Component.prototype.onModalCloseClick = function (result) {
        "use strict";
        this.closeModal(result);
    };
    Component.prototype.getNotification = function () {
        "use strict";
        if (!this.notifications.length) {
            return null;
        }
        if (this.notificationTimeout == null) {
            this.notificationTimeout = setTimeout(this.onNotificationCloseClick.bind(this), 1000 * 8);
        }
        return this.notifications[0];
    };
    Component.prototype.onNotificationCloseClick = function () {
        "use strict";
        clearTimeout(this.notificationTimeout);
        this.notifications.shift();
        this.notificationTimeout = null;
    };
    Component = __decorate([
        ngCore.Component({
            selector: "[body]",
            templateUrl: "app/body.html",
            providers: [
                libBeckiBackEnd.Service,
                { provide: libBootstrapModal.Component, useExisting: ngCore.forwardRef(function () { return Component; }) },
                libBeckiNotifications.Service,
                { provide: "home", useValue: "No Name" }
            ].device_board_pairs,
            inputs: ["body"],
            host: { "[class.modal-open]": "modal" }
        }), 
        __metadata('design:paramtypes', [ngRouter.Router, libBeckiBackEnd.Service])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=body.js.map