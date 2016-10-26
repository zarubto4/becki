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
var libBackEnd = require("./lib-back-end/index");
var libBeckiBackEnd = require("./lib-becki/back-end");
var libBeckiLayout = require("./lib-becki/layout");
var libBeckiNotifications = require("./lib-becki/notifications");
var libPatternFlyListView = require("./lib-patternfly/list-view");
var Component = (function () {
    function Component(home, backEnd, notifications, router) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("System", ["/system"])
        ];
        this.tab = ['interactions', 'moderators'];
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
        // see https://youtrack.byzance.cz/youtrack/issue/TYRION-71
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-300
        this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-300"));
        this.moderators = [];
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        this.backEnd.getCloudHomerServers()
            .then(function (servers) { return _this.interactionsServers = servers.map(function (server) {
            return new libPatternFlyListView.Item(server.id, server.server_name, server.destination_address, server.edit_permission ? ["/system/interactions/servers", server.id] : null, server.delete_permission);
        }); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Interactions servers cannot be loaded.", reason)); });
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        this.backEnd.getBoards(1)
            .then(function (page) { return Promise.all(page.pages.map(function (number) { return _this.backEnd.getBoards(number); })); })
            .then(function (pages) { return _this.devices = (_a = []).concat.apply(_a, pages.map(function (page) { return page.content; })).map(function (device) { return new libPatternFlyListView.Item(device.id, device.id + " (issue/TYRION-70)", device.isActive ? "active" : "inactive"); }); var _a; })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Devices cannot be loaded.", reason)); });
        this.backEnd.getAllTypeOfBoard()
            .then(function (deviceTypes) { return _this.deviceTypes = deviceTypes.map(function (type) { return new libPatternFlyListView.Item(type.id, type.name, type.description, ["/system/device/types", type.id], type.delete_permission); }); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Board types cannot be loaded.", reason)); });
        this.backEnd.getProcessors()
            .then(function (processors) { return _this.processors = processors.map(function (processor) { return new libPatternFlyListView.Item(processor.id, processor.processor_name, processor.processor_code, ["/system/processors", processor.id]); }); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Processors cannot be loaded.", reason)); });
        this.backEnd.getLibraryGroups(1)
            .then(function (groupPage) { return Promise.all(groupPage.pages.map(function (page) { return _this.backEnd.getLibraryGroups(page); })); })
            .then(function (groupPages) { return _this.libraryGroups = (_a = []).concat.apply(_a, groupPages.map(function (page) { return page.content; })).map(function (group) { return new libPatternFlyListView.Item(group.id, group.group_name, group.description, ["/system/library/groups", group.id]); }); var _a; })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Library groups cannot be loaded.", reason)); });
        this.backEnd.getLibraries(1)
            .then(function (librariesPage) { return Promise.all(librariesPage.pages.map(function (number) { return _this.backEnd.getLibraries(number); })); })
            .then(function (librariesPages) { return _this.libraries = (_a = []).concat.apply(_a, librariesPages.map(function (page) { return page.content; })).map(function (library) { return new libPatternFlyListView.Item(library.id, library.library_name, library.description, ["/system/libraries", library.id], library.delete_permission); }); var _a; })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Libraries cannot be loaded.", reason)); });
        this.backEnd.getProducers()
            .then(function (producers) { return _this.producers = producers.map(function (producer) { return new libPatternFlyListView.Item(producer.id, producer.name, producer.description, ["/system/producers", producer.id], producer.delete_permission); }); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Producers cannot be loaded.", reason)); });
        this.backEnd.getCompilationServers()
            .then(function (servers) { return _this.compilationServers = servers.map(function (server) {
            return new libPatternFlyListView.Item(server.id, server.server_name, server.destination_address, ["/system/compilation/servers", server.id]);
        }); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Compilation servers cannot be loaded.", reason)); });
        this.backEnd.getUsers()
            .then(function (users) { return _this.users = users.map(function (user) { return new libPatternFlyListView.Item(user.id, libBackEnd.composeUserString(user), "", ["/users", user.id], user.delete_permission); }); })
            .catch(function (reason) { return _this.notifications.current.push(new libBeckiNotifications.Danger("Board types cannot be loaded.", reason)); });
    };
    Component.prototype.onAddClick = function () {
        "use strict";
        switch (this.tab[0]) {
            case "interactions":
                switch (this.tab[1]) {
                    case "servers":
                        this.onAddInteractionsServerClick();
                        break;
                }
                break;
            case "devices":
                switch (this.tab[1]) {
                    case "devices":
                        this.onAddDeviceClick();
                        break;
                    case "types":
                        this.onAddDeviceTypeClick();
                        break;
                    case "processors":
                        this.onAddProcessorClick();
                        break;
                    case "groups":
                        this.onAddLibraryGroupClick();
                        break;
                    case "libraries":
                        this.onAddLibraryClick();
                        break;
                    case "producers":
                        this.onAddProducerClick();
                        break;
                    case "servers":
                        this.onAddCompilationServerClick();
                        break;
                }
                break;
        }
    };
    Component.prototype.onAddInteractionsServerClick = function () {
        "use strict";
        this.router.navigate(["/system/interactions/server/new"]);
    };
    Component.prototype.onAddDeviceClick = function () {
        "use strict";
        this.router.navigate(["/system/device/new"]);
    };
    Component.prototype.onAddDeviceTypeClick = function () {
        "use strict";
        this.router.navigate(["/system/device/type/new"]);
    };
    Component.prototype.onAddProcessorClick = function () {
        "use strict";
        this.router.navigate(["/system/processor/new"]);
    };
    Component.prototype.onAddLibraryGroupClick = function () {
        "use strict";
        this.router.navigate(["/system/library/group/new"]);
    };
    Component.prototype.onAddLibraryClick = function () {
        "use strict";
        this.router.navigate(["/system/library/new"]);
    };
    Component.prototype.onAddProducerClick = function () {
        "use strict";
        this.router.navigate(["/system/producer/new"]);
    };
    Component.prototype.onAddCompilationServerClick = function () {
        "use strict";
        this.router.navigate(["/system/compilation/server/new"]);
    };
    Component.prototype.onTabClick = function (tab) {
        "use strict";
        this.tab = tab;
    };
    Component.prototype.subNotifications = function () {
        "use strict";
        this.backEnd.requestNotificationsSubscribe();
    };
    Component.prototype.onRemoveModeratorClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteHomer(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The moderator of interactions has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The moderator of interactions cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveInteractionsServerClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteCloudHomerServer(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The interactions server has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The interactions server cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveDeviceClick = function (id) {
        "use strict";
        this.notifications.shift();
        // see https://youtrack.byzance.cz/youtrack/issue/TYRION-89
        this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-89"));
    };
    Component.prototype.onRemoveDeviceTypeClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteDeviceType(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The device type has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The device type cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveProcessorClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteProcessor(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The processor has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The processor cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveLibraryGroupClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteLibraryGroup(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The library group has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The library group cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveLibraryClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteLibrary(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The library has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The library cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveProducerClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteProducer(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The producer has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The producer cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveCompilationServerClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteCompilationServer(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The compilation server has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The compilation server cannot be removed.", reason));
        });
    };
    Component.prototype.onRemoveUserClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteUser(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The user has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The user cannot be removed.", reason));
        });
    };
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/system.html",
            directives: [libPatternFlyListView.Component, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES],
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=system.js.map