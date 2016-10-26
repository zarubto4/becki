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
            new libBeckiLayout.LabeledLink("System", ["/system"]),
            new libBeckiLayout.LabeledLink("Libraries", ["/system/libraries"])
        ];
        this.editing = false;
        this.editLibrary = false;
        this.addVersion = false;
        this.nameField = "Loading...";
        this.descriptionField = "Loading...";
        this.description = "Loading...";
        this.versionNameField = "Loading...";
        this.versionDescriptionField = "Loading...";
        this.activatedRoute = activatedRoute;
        this.backEnd = backEnd;
        this.notifications = notifications;
    }
    Component.prototype.ngOnInit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(function (params) {
            _this.id = params["library"];
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
        this.backEnd.getLibrary(this.id)
            .then(function (library) {
            _this.name = library.library_name;
            _this.breadcrumbs.push(new libBeckiLayout.LabeledLink(library.library_name, ["/system/libraries", _this.id]));
            _this.breadcrumbs[3].label = library.library_name;
            _this.editLibrary = library.edit_permission;
            _this.addVersion = library.update_permission;
            _this.nameField = library.library_name;
            _this.descriptionField = library.description;
            _this.description = library.description;
            _this.versionNameField = "";
            _this.versionDescriptionField = "";
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The library " + _this.id + " cannot be loaded.", reason));
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
        return function () { return Promise.all([
            _this.backEnd.getLibraries(1),
            _this.backEnd.getLibraryGroups(1)
        ])
            .then(function (result) {
            var librariesPage;
            var groupsPage;
            librariesPage = result[0], groupsPage = result[1];
            return Promise.all([
                Promise.all(librariesPage.pages.map(function (number) { return _this.backEnd.getLibraries(number); })),
                Promise.all(groupsPage.pages.map(function (number) { return _this.backEnd.getLibraryGroups(number); }))
            ]);
        })
            .then(function (result) {
            var librariesPages;
            var groupsPages;
            librariesPages = result[0], groupsPages = result[1];
            return !(_a = []).concat.apply(_a, librariesPages.map(function (page) { return page.content; })).find(function (library) { return library.id != _this.id && library.library_name == _this.nameField; }) &&
                !(_b = []).concat.apply(_b, groupsPages.map(function (page) { return page.content; })).find(function (group) { return group.group_name == _this.nameField; });
            var _a, _b;
        }); };
    };
    Component.prototype.onEditSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.updateLibrary(this.id, this.nameField, this.descriptionField)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The library has been updated."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The library cannot be updated.", reason));
        });
    };
    Component.prototype.onCancelClick = function () {
        "use strict";
        this.notifications.shift();
        this.editing = false;
    };
    Component.prototype.onVersionSubmit = function () {
        "use strict";
        var _this = this;
        this.notifications.shift();
        var reader = new FileReader();
        reader.readAsText(this.versionFileField.nativeElement.files[0]);
        reader.onloadend = function (event) { return _this.backEnd.addVersionToLibrary(_this.versionNameField, _this.versionDescriptionField, _this.id)
            .then(function (version) {
            return _this.backEnd.updateFileOfLibrary(reader.result, version.id);
        })
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The version has been created."));
            _this.versionFileField.nativeElement.value = "";
            _this.refresh();
        })
            .catch(function (reason) {
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-305
            _this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-305"));
            _this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        }); };
    };
    __decorate([
        ngCore.ViewChild("versionFileField"), 
        __metadata('design:type', ngCore.ElementRef)
    ], Component.prototype, "versionFileField", void 0);
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/system-library.html",
            directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES]
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, ngRouter.ActivatedRoute, libBeckiBackEnd.Service, libBeckiNotifications.Service])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=system-library.js.map