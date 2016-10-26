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
            new libBeckiLayout.LabeledLink("Board Types", ["/system/device/types"])
        ];
        this.editing = false;
        this.editType = false;
        this.nameField = "Loading...";
        this.descriptionField = "Loading...";
        this.description = "Loading...";
        this.activatedRoute = activatedRoute;
        this.backEnd = backEnd;
        this.notifications = notifications;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(function (params) {
            _this.id = params["type"];
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
        this.backEnd.getTypeOfBoard(this.id)
            .then(function (type) {
            _this.type = type;
            _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(type.name, ["/system/device/types", _this.id]));
            _this.editType = type.edit_permission;
            _this.nameField = type.name;
            _this.producerField = type.producer_id;
            _this.processorField = type.processor_id;
            _this.descriptionField = type.description;
            _this.description = type.description;
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The type " + _this.id + " cannot be loaded.", reason));
        });
        this.backEnd.getProducers()
            .then(function (producers) { return _this.producers = producers; })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Producers cannot be loaded.", reason)); });
        this.backEnd.getProcessors()
            .then(function (processors) { return _this.processors = processors; })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Processors cannot be loaded.", reason)); });
    };
    Component.prototype.onEditClick = function () {
        "use strict";
        this.editing = !this.editing;
    };
    Component.prototype.validateNameField = function () {
        "use strict";
        var _this = this;
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        return function () { return _this.backEnd.getAllTypeOfBoard().then(function (types) { return !types.find(function (type) { return type.id != _this.id && type.name == _this.nameField; }); }); };
    };
    Component.prototype.getProducer = function () {
        "use strict";
        var _this = this;
        return this.type && this.producers && this.producers.length ? this.producers.find(function (producer) { return producer.id == _this.type.producer_id; }) : null;
    };
    Component.prototype.getProcessor = function () {
        "use strict";
        var _this = this;
        return this.type && this.processors && this.processors.length ? this.processors.find(function (processor) { return processor.id == _this.type.processor_id; }) : null;
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.updateDeviceType(this.id, this.nameField, this.producerField, this.processorField, this.type.connectible_to_internet, this.descriptionField)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The type has been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The type cannot be updated.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.refresh();
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/system-device-type.html",
            directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=system-device-type.js.map