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
var libBecki = require("./lib-becki/index");
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiCustomValidator = require("./lib-becki/custom-validator");
var libBeckiFieldInteractionsScheme = require("./lib-becki/field-interactions-scheme");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var libPatternFlyListView = require("./lib-patternfly/list-view");
var Component = (function () {
    function Component(router, home, activatedRoute, backEnd, notifications) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("Interactions Block Groups", ["/user/interactions/block/groups"])
        ];
        this.editing = false;
        this.nameField = "Loading...";
        this.projectField = "";
        this.descriptionField = "Loading...";
        this.project_idField = "Loading...";
        this.edit_permission = false;
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
            _this.id = params["group"];
            _this.refresh();
        });
    };
    Component.prototype.ngOnDestroy = function () {
        "use strict";
        this.routeParamsSubscription.unsubscribe();
    };
    Component.prototype.onAddBlocko = function () {
        this.router.navigate(["/user/interactions/block/new"]);
    };
    Component.prototype.refresh = function () {
        "use strict";
        var _this = this;
        this.editing = false;
        this.backEnd.getTypeOfBlock(this.id)
            .then(function (group) {
            return Promise.all([
                group,
                _this.backEnd.getProjects()]);
        })
            .then(function (result) {
            var group;
            var projects;
            group = result[0], projects = result[1];
            _this.group = group;
            _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(group.name, ["/user/interactions/block/groups", _this.id]));
            _this.breadcrumbs[2].label = group.name;
            _this.nameField = group.name;
            _this.project_idField = group.project_id;
            _this.descriptionField = group.general_description;
            _this.blocks = group.blockoBlocks.map(function (block) { return new libPatternFlyListView.Item(block.id, block.name, block.general_description, ["/user/interactions/blocks", block.id], block.delete_permission); });
            _this.projects = projects;
            _this.edit_permission = group.edit_permission;
            _this.project = _this.projects.find(function (project) { return group.project_id == project.id; });
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
        return function () { return _this.backEnd.getAllTypeOfBlock().then(function (producers) { return !producers.find(function (producer) { return producer.id != _this.id && producer.name == _this.nameField; }); }); };
    };
    Component.prototype.getProject = function () {
        "use strict";
        return libBecki.getAdvancedField(this.projectField, this.projects.map(function (project) { return project.id; }));
    };
    Component.prototype.onProjectChange = function () {
    };
    Component.prototype.onProjectClick = function () {
        this.router.navigate(["/user/projects", this.project_idField]);
    };
    Component.prototype.onSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        Promise.resolve()
            .then(function () {
            return _this.backEnd.updateInteractionsBlockGroups(_this.id, _this.nameField, _this.descriptionField, _this.project_idField);
        })
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The blocko group has been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The blocko group cannot be updated.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.refresh();
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-interactions-block-group.html",
            directives: [
                libBeckiCustomValidator.Directive,
                libBeckiFieldInteractionsScheme.Component,
                libBeckiLayout.Component,
                ngCommon.CORE_DIRECTIVES,
                libPatternFlyListView.Component]
        }),
        __param(1, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [ngRouter.Router, String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-interactions-block-group.js.map