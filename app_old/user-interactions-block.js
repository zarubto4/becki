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
        this.name = "Loading...";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Interactions Blocks", ["/user/interactions/blocks"])
        ];
        this.editing = false;
        this.editBlock = false;
        this.nameField = "Loading...";
        this.groupField = "";
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
            _this.id = params["block"];
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
        // TODO: http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        this.backEnd.getBlockoBlock(this.id)
            .then(function (block) {
            _this.name = block.name;
            _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(block.name, ["/user/interactions/blocks", _this.id]));
            _this.editBlock = block.edit_permission;
            _this.nameField = block.name;
            _this.descriptionField = block.general_description;
            _this.description = block.general_description;
            _this.groupField = block.type_of_block_id;
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The block " + _this.id + " cannot be loaded.", reason));
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
        return function () { return _this.backEnd.getAllTypeOfBlock().then(function (groups) { return !(_a = []).concat.apply(_a, groups.map(function (group) { return group.blockoBlocks; })).find(function (block) { return block.id != _this.id && block.name == _this.nameField; }); var _a; }); };
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.updateBlockoBlock(this.id, this.nameField, this.descriptionField, this.groupField)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The block has been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The block cannot be updated.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.editing = false;
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-interactions-block.html",
            directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-interactions-block.js.map