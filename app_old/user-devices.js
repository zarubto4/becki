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
var DeviceProgramItem = (function (_super) {
    __extends(DeviceProgramItem, _super);
    function DeviceProgramItem(program) {
        "use strict";
        _super.call(this, program.id, program.program_name, "" + program.program_description, ["/user/device/programs", program.id], program.delete_permission);
        this.versions = program.program_versions.map(function (version) { return version.version_object; });
    }
    return DeviceProgramItem;
}(libPatternFlyListView.Item));
var SelectableDevice = (function () {
    function SelectableDevice(model) {
        "use strict";
        this.model = model;
        this.selected = false;
    }
    return SelectableDevice;
}());
var Component = (function () {
    function Component(home, backEnd, notifications, router) {
        "use strict";
        this.breadcrumbs = [
            new libBeckiLayout.LabeledLink(home, ["/"]),
            new libBeckiLayout.LabeledLink("User", ["/user"]),
            new libBeckiLayout.LabeledLink("Devices", ["/user/devices"])
        ];
        this.tab = 'programs';
        this.uploadProgramField = "";
        this.uploadProgramVersionField = "";
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
                Promise.all((_a = []).concat.apply(_a, projects.map(function (project) { return project.c_programs_id; })).map(function (id) { return _this.backEnd.getCProgram(id); })),
                // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
                Promise.all((_b = []).concat.apply(_b, projects.map(function (project) { return project.boards_id.map(function (id) { return [id, project]; }); })).map(function (pair) { return Promise.all([_this.backEnd.getBoard(pair[0]), pair[1]]); }))
            ]);
            var _a, _b;
        })
            .then(function (result) {
            var programs;
            var devices;
            programs = result[0], devices = result[1];
            _this.programs = programs.map(function (program) { return new DeviceProgramItem(program); });
            _this.devices = devices.map(function (pair) { return new libPatternFlyListView.Item(pair[0].id, pair[0].id, pair[0].isActive ? "active" : "inactive", undefined, pair[1].update_permission); });
            _this.uploadProgramDevices = devices.filter(function (pair) { return pair[0].update_permission; }).map(function (pair) { return new SelectableDevice(pair[0]); });
            _this.uploadBinaryDevices = devices.filter(function (pair) { return pair[0].update_permission; }).map(function (pair) { return new SelectableDevice(pair[0]); });
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("Devices cannot be loaded.", reason));
        });
    };
    Component.prototype.onAddClick = function () {
        "use strict";
        switch (this.tab) {
            case "programs":
                this.onAddProgramClick();
                break;
            case "devices":
                this.onAddDeviceClick();
                break;
        }
    };
    Component.prototype.onAddProgramClick = function () {
        "use strict";
        this.router.navigate(["/user/device/program/new"]);
    };
    Component.prototype.onAddDeviceClick = function () {
        "use strict";
        this.router.navigate(["/user/device/new"]);
    };
    Component.prototype.onTabClick = function (tab) {
        "use strict";
        this.tab = tab;
    };
    Component.prototype.onRemoveProgramClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.deleteCProgram(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The program has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The program cannot be removed.", reason));
        });
    };
    Component.prototype.getUploadProgramVersions = function () {
        "use strict";
        var _this = this;
        var program = this.programs.find(function (program) { return program.id == _this.uploadProgramField; });
        return program ? program.versions : [];
    };
    Component.prototype.onUploadProgramFieldChange = function () {
        "use strict";
        var versions = this.getUploadProgramVersions();
        this.uploadProgramVersionField = versions.length ? versions[0].id : "";
    };
    Component.prototype.onUploadProgramSubmit = function () {
        "use strict";
        var _this = this;
        var devices = this.uploadProgramDevices.filter(function (selectable) { return selectable.selected; }).map(function (selectable) { return selectable.model.id; });
        if (!devices.length) {
            return;
        }
        this.notifications.shift();
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        this.backEnd.addBoardToProject(this.uploadProgramVersionField, devices)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The program has been uploaded."));
            _this.refresh();
        })
            .catch(function (reason) {
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-258
            _this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-258"));
            _this.notifications.current.push(new libBeckiNotifications.Danger("The program cannot be uploaded.", reason));
        });
    };
    Component.prototype.onUploadBinarySubmit = function () {
        "use strict";
        var devices = this.uploadBinaryDevices.filter(function (selectable) { return selectable.selected; }).map(function (selectable) { return selectable.model.id; });
        if (!devices.length) {
            return;
        }
        this.notifications.shift();
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-301
        this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-301"));
    };
    Component.prototype.onRemoveDeviceClick = function (id) {
        "use strict";
        var _this = this;
        this.notifications.shift();
        this.backEnd.removeDeviceFromProject(id)
            .then(function () {
            _this.notifications.current.push(new libBeckiNotifications.Success("The device has been removed."));
            _this.refresh();
        })
            .catch(function (reason) {
            _this.notifications.current.push(new libBeckiNotifications.Danger("The device cannot be removed.", reason));
        });
    };
    __decorate([
        ngCore.ViewChild("uploadBinaryField"), 
        __metadata('design:type', ngCore.ElementRef)
    ], Component.prototype, "uploadBinaryField", void 0);
    Component = __decorate([
        ngCore.Component({
            templateUrl: "app/user-devices.html",
            directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ngCommon.CORE_DIRECTIVES],
        }),
        __param(0, ngCore.Inject("home")), 
        __metadata('design:paramtypes', [String, libBeckiBackEnd.Service, libBeckiNotifications.Service, ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=user-devices.js.map