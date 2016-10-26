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
var libBeckiFieldCode = require("./lib-becki/field-code");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var Component = (function () {
    function Component(home, backEnd, notifications, router) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("New Interactions Block", ["/user/interactions/block/new"])
        ];
        this.nameField = "";
        this.groupField = "";
        this.descriptionField = "";
        this.codeField = "";
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.getAllTypeOfBlock()
            .then(function (groups) { return _this.groups = groups.filter(function (group) { return group.update_permission; }); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Groups cannot be loaded.", reason)); });
    };
    Component.prototype.validateNameField = function () {
        "use strict";
        var _this = this;
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        return function () { return _this.backEnd.getAllTypeOfBlock().then(function (groups) { return !(_a = []).concat.apply(_a, groups.map(function (group) { return group.blockoBlocks; })).find(function (block) { return block.name == _this.nameField; }); var _a; }); };
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.createBlockoBlock(this.nameField, this.groupField, this.descriptionField)
            .then(function (block) {
            return _this.backEnd.addVersionToBlockoBlock("Initial version", "An automatically created version.", _this.codeField, block.id);
        })
            .then(function () {
            _this.notifications.next.push(new libBeckiNotifications.Success("The block have been created."));
            _this.router.navigate(["/user/interactions/blocks"]);
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The block cannot be created.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.router.navigate(["/user/interactions/blocks"]);
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-interactions-block-new.html",
            directives: [
                libBeckiCustomValidator.Directive,
                libBeckiFieldCode.Component,
                libBeckiLayout.Component,
                ngCommon.CORE_DIRECTIVES
            ]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-interactions-block-new.js.map