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
var ngCommon = require("@angular/common");
var ngCore = require("@angular/core");
var ngRouter = require("@angular/router");
var libBootstrapDropdown = require("../lib-bootstrap/dropdown");
var libBootstrapModal = require("../modals/modal");
var Item = (function () {
    function Item(id, name, description, link, removable) {
        "use strict";
        if (link === void 0) { link = null; }
        if (removable === void 0) { removable = true; }
        this.id = id;
        this.name = name;
        this.description = description;
        this.link = link;
        this.removable = removable;
    }
    return Item;
}());
exports.Item = Item;
var Component = (function () {
    function Component(router) {
        "use strict";
        this.emptyTitle = "No item yet";
        this.addable = true;
        this.addClick = new ngCore.EventEmitter();
        this.removeClick = new ngCore.EventEmitter();
        this.router = router;
        this.modal = modal;
    }
    Component.prototype.onAddClick = function () {
        "use strict";
        this.addClick.emit(null);
    };
    Component.prototype.onViewClick = function (item) {
        "use strict";
        this.router.navigate(item.link);
    };
    Component.prototype.onRemoveClick = function (item) {
        "use strict";
        var _this = this;
        this.modal.showModal(new libBootstrapModal.RemovalModel(item.name)).then(function (remove) {
            if (remove) {
                _this.removeClick.emit(item.id);
            }
        });
    };
    __decorate([
        ngCore.Input("listView"), 
        __metadata('design:type', Array)
    ], Component.prototype, "items", void 0);
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', String)
    ], Component.prototype, "emptyTitle", void 0);
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', Boolean)
    ], Component.prototype, "addable", void 0);
    __decorate([
        ngCore.Output(), 
        __metadata('design:type', ngCore.EventEmitter)
    ], Component.prototype, "addClick", void 0);
    __decorate([
        ngCore.Output(), 
        __metadata('design:type', ngCore.EventEmitter)
    ], Component.prototype, "removeClick", void 0);
    Component = __decorate([
        ngCore.Component({
            selector: "[listView]",
            templateUrl: "app/lib-patternfly/list-view.html",
            directives: [libBootstrapDropdown.DIRECTIVES, ngCommon.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [ngRouter.Router])
    ], Component);
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=list-view.js.map