/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var libPatternFlyListView = require("./lib-patternfly/list-view");
var SelectableInteractionsModeratorItem = (function (_super) {
    __extends(SelectableInteractionsModeratorItem, _super);
    function SelectableInteractionsModeratorItem(moderator, project) {
        "use strict";
        _super.call(this, moderator.id, moderator.id, moderator.type_of_device, null, moderator.update_permission && project.update_permission);
        this.project = project.id;
        this.online = moderator.online;
        this.selected = false;
    }
    return SelectableInteractionsModeratorItem;
}(libPatternFlyListView.Item));
var Component = (function () {
    function Component(home, backEnd, notifications, router) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Interactions", ["/user/interactions"])
        ];
        this.tab = 'schemes';
        this.uploadSchemeField = "";
        this.uploadVersionField = "";
        this.backEnd = backEnd;
        this.notifications = notifications;
        this.router = router;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        this.notifications.shift();
        this.refresh();
    };
    Component.prototype.refresh = function () {
        "use strict";
        var _this = this;
        this.backEnd.getProjects()
            .then(function (projects) {
            return Promise.all([
                // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                Promise.all((_a = []).concat.apply(_a, projects.map(function (project) { return project.b_programs_id; })).map(function (id) { return _this.backEnd.getBProgram(id); })),
                Promise.all((_b = []).concat.apply(_b, projects.map(function (project) { return project.type_of_blocks_id; })).map(function (id) { return _this.backEnd.getTypeOfBlock(id); })),
                // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                Promise.all((_c = []).concat.apply(_c, projects.map(function (project) { return project.homers_id.map(function (id) { return [id, project]; }); })).map(function (pair) { return Promise.all([_this.backEnd.getHomer(pair[0]), pair[1]]); }))
            ]);
            var _a, _b, _c;
        })
            .then(function (result) {
            var schemes;
            var groups;
            var moderators;
            schemes = result[0], groups = result[1], moderators = result[2];
            _this.schemes = schemes.map(function (scheme) { return new libPatternFlyListView.Item(scheme.id, scheme.name, scheme.program_description, ["/user/interactions/schemes", scheme.id], scheme.delete_permission); });
            _this.blocks = (_a = []).concat.apply(_a, groups.map(function (group) { return group.blockoBlocks; })).map(function (block) { return new libPatternFlyListView.Item(block.id, block.name, block.general_description, ["/user/interactions/blocks", block.id], block.delete_permission); });
            _this.uploadSchemes = schemes.filter(function (scheme) { return scheme.update_permission; });
            _this.moderators = moderators.map(function (pair) { return new SelectableInteractionsModeratorItem(pair[0], pair[1]); });
            _this.BlockGroups = groups.map(function (group) { return new libPatternFlyListView.Item(group.id, group.name, group.general_description, ["/user/interactions/block/groups", group.id], group.delete_permission); });
            _this.spies = schemes.filter(function (scheme) { return scheme.program_state.uploaded; }).map(function (scheme) { return new libPatternFlyListView.Item(scheme.id, scheme.name, scheme.program_versions.find(function (version) { return version.version_Object.id == scheme.program_state.version_id; }).version_Object.version_name, ["/user/interactions/spies", scheme.id], false); });
            var _a;
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("Interactions cannot be loaded.", reason));
        });
    };
    Component.prototype.onAddClick = function () {
        "use strict";
        switch (this.tab) {
            case "schemes":
                this.onAddSchemeClick();
                break;
            case "blocks":
                this.onAddBlockClick();
                break;
            case "moderators":
                this.onAddModeratorClick();
                break;
            case "BlockGroups":
                this.onAddBlockGroupsClick();
                break;
        }
    };
    Component.prototype.onAddBlockGroupsClick = function () {
        "use strict";
        this.router.navigate(["/user/interactions/block/group/new"]);
    };
    Component.prototype.onAddSchemeClick = function () {
        "use strict";
        this.router.navigate(["/user/interactions/scheme/new"]);
    };
    Component.prototype.onAddBlockClick = function () {
        "use strict";
        this.router.navigate(["/user/interactions/block/new"]);
    };
    Component.prototype.onAddModeratorClick = function () {
        "use strict";
        this.router.navigate(["/user/interactions/moderator/new"]);
    };
    Component.prototype.onTabClick = function (tab) {
        "use strict";
        this.tab = tab;
    };
    Component.prototype.onRemoveSchemeClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteBProgram(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The scheme has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-185
            _this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-185"));
            _this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveBlockClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteBlockoBlock(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The block has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The block cannot be removed.", reason));
        });
    };
    Component.prototype.getUploadVersions = function () {
        "use strict";
        var _this = this;
        var scheme = this.uploadSchemes.find(function (scheme) { return scheme.id == _this.uploadSchemeField; });
        return scheme ? scheme.program_versions.map(function (version) { return version.version_Object; }) : [];
    };
    Component.prototype.onUploadSchemeFieldChange = function () {
        "use strict";
        var versions = this.getUploadVersions();
        this.uploadVersionField = versions.length ? versions[0].id : "";
    };
    Component.prototype.onUploadSubmit = function () {
        "use strict";
        var _this = this;
        var moderators = this.moderators.filter(function (moderator) { return moderator.selected; }).map(function (moderator) { return moderator.id; });
        if (!moderators.length) {
            return;
        }
        this.notifications.shift();
        Promise.all(moderators.map(function (id) { return _this.backEnd.uploadBProgramToHomer(_this.uploadVersionField, id, _this.uploadSchemeField); }))
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The scheme has been uploaded."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be uploaded.", reason));
        });
    };
    Component.prototype.onRemoveBlockGroupsClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        var moderator = this.BlockGroups.find(function (moderator) { return moderator.id == id; });
        this.backEnd.deleteTypeOfBlock(moderator.id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The Block Group has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The Block Group cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveModeratorClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        var moderator = this.moderators.find(function (moderator) { return moderator.id == id; });
        this.backEnd.removeInteractionsModeratorFromProject(moderator.id, moderator.project)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The moderator has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The moderator cannot be removed.", reason));
        });
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-interactions.html",
            directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ngCommon.CORE_DIRECTIVES],
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-interactions.js.map