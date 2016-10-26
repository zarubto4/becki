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
    function Component(home, activatedRoute, backEnd, notifications, router) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("Devices for Applications", ["/application/devices"]),
        ];
        this.editing = false;
        this.editDevice = false;
        this.showProject = false;
        this.nameField = "Loading...";
        this.widthField = 1;
        this.heightField = 1;
        this.columnsField = 1;
        this.rowsField = 1;
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
            _this.id = params["device"];
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
        Promise.all([
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            this.backEnd.getScreenType(this.id),
            this.backEnd.getProjects()
        ])
            .then(function (result) {
            var projects;
            _this.device = result[0], projects = result[1];
            _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(_this.device.name, ["/application/devices", _this.id]));
            _this.project = projects.find(function (project) { return project.screen_size_types_id.indexOf(_this.id) != -1; }) || null;
            _this.editDevice = _this.device.edit_permission;
            _this.showProject = _this.project && projects.length > 1;
            _this.nameField = _this.device.name;
            _this.widthField = _this.device.portrait_width;
            _this.heightField = _this.device.portrait_height;
            _this.columnsField = _this.device.portrait_square_width;
            _this.rowsField = _this.device.portrait_square_height;
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The device " + _this.id + " cannot be loaded.", reason));
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
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return function () { return _this.backEnd.getScreenTypes().then(function (devices) { return ![].concat(devices.public_types, devices.private_types).find(function (device) { return device.id != _this.id && device.name == _this.nameField; }); }); };
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.updateScreenType(this.id, this.nameField, this.widthField, this.heightField, this.columnsField, this.rowsField, this.device.width_lock, this.device.height_lock, this.device.portrait_min_screens, this.device.portrait_max_screens, this.device.landscape_min_screens, this.device.landscape_max_screens, this.device.touch_screen, this.project ? this.project.id : undefined)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The device has been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The device cannot be updated.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.editing = false;
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/application-device.html"
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=application-device.js.map