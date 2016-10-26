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
var _ = require("underscore");
var ngCore = require("@angular/core");
var fieldCode = require("./field-code");
var BackendService_1 = require("../services/BackendService");
var IDEComponent = (function () {
    function IDEComponent(backEnd) {
        "use strict";
        this.files = {};
        this.filesAnnotations = {};
        this.expandedDirectories = new Set();
        this.pathSeparator = "/";
        this.libraries = {};
        this.selection = null;
        this.modal = {};
        this.notifications = {};
        this.backEnd = backEnd;
    }
    IDEComponent.prototype.getPathBasename = function (path) {
        "use strict";
        var separatorIndex = path.lastIndexOf(this.pathSeparator);
        return path.slice(separatorIndex + 1);
    };
    IDEComponent.prototype.getPathDirname = function (path) {
        "use strict";
        var separatorIndex = path.lastIndexOf(this.pathSeparator);
        return path.slice(0, Math.max(separatorIndex, 0));
    };
    IDEComponent.prototype.removeFile = function (path) {
        "use strict";
        delete this.files[path];
        delete this.filesAnnotations[path];
    };
    IDEComponent.prototype.convertPathToPaths = function (path) {
        "use strict";
        var separatorIndex = path.lastIndexOf(this.pathSeparator);
        if (separatorIndex == -1) {
            return [path];
        }
        var parentPaths;
        parentPaths = this.convertPathToPaths(path.slice(0, separatorIndex));
        parentPaths.push(path);
        return parentPaths;
    };
    IDEComponent.prototype.getPaths = function (sorted) {
        "use strict";
        var _this = this;
        if (sorted === void 0) { sorted = false; }
        var filePaths = Object.keys(this.files);
        var allPaths = (_a = []).concat.apply(_a, filePaths.map(function (path) { return _this.convertPathToPaths(path); }));
        var allUniquePaths = _.uniq(allPaths);
        if (sorted) {
            allUniquePaths.sort();
        }
        return allUniquePaths;
        var _a;
    };
    IDEComponent.prototype.isPathExpanded = function (path) {
        "use strict";
        if (this.files.hasOwnProperty(path)) {
            return null;
        }
        return this.expandedDirectories.has(path);
    };
    IDEComponent.prototype.isPathHidden = function (path) {
        "use strict";
        var dirname = this.getPathDirname(path);
        if (!dirname) {
            return false;
        }
        return !this.isPathExpanded(dirname) || this.isPathHidden(dirname);
    };
    IDEComponent.prototype.getLibraries = function (sorted) {
        "use strict";
        var _this = this;
        if (sorted === void 0) { sorted = false; }
        var names = Object.keys(this.libraries);
        var added = names.filter(function (name) { return _this.libraries[name]; });
        if (sorted) {
            added.sort();
        }
        return added;
    };
    IDEComponent.prototype.canAddLibraries = function () {
        "use strict";
        var _this = this;
        var names = Object.keys(this.libraries);
        return names.some(function (name) { return !_this.libraries[name]; });
    };
    IDEComponent.prototype.onAddPathClick = function () {
        "use strict";
        if (this.readonly) {
            throw new Error("read only");
        }
        this.notifications.shift();
        var parts = [];
        if (this.selection && this.selection.type == "path") {
            if (this.files.hasOwnProperty(this.selection.value)) {
                var dirname = this.getPathDirname(this.selection.value);
                if (dirname) {
                    parts.push(dirname);
                }
            }
            else {
                parts.push(this.selection.value);
            }
        }
        parts.push("new_file.cpp");
        /*let modalModel = new libBootstrapModal.FilenameModel(parts.join(this.pathSeparator), this.pathSeparator);
    
        this.modal.showModal(modalModel).then(add => {
          if (add) {
            if (this.getPaths().indexOf(modalModel.name) != -1) {
              this.notifications.current.push(new libBeckiNotifications.Danger("Path already exists"));
              return;
            }
            this.files[modalModel.name] = "";
            this.selection = {type: "path", value: modalModel.name};
          }
        });*/
    };
    IDEComponent.prototype.onAddLibraryClick = function () {
        "use strict";
        if (this.readonly) {
            throw new Error("read only");
        }
        this.notifications.shift();
        /*let modalModel = new libBootstrapModal.SelectionModel(Object.keys(this.libraries).filter(name => !this.libraries[name]).sort());
    
        this.modal.showModal(modalModel).then(add => {
          if (add) {
            this.libraries[modalModel.selection] = true;
            this.selection = {type: "library", value: modalModel.selection};
          }
        });*/
    };
    IDEComponent.prototype.onMoveClick = function () {
        "use strict";
        if (this.readonly) {
            throw new Error("read only");
        }
        this.notifications.shift();
        /*let modalModel = new libBootstrapModal.FilenameModel(this.selection.value, this.pathSeparator);
        this.modal.showModal(modalModel).then(move => {
          if (move) {
            if (this.getPaths().indexOf(modalModel.name) != -1) {
              this.notifications.current.push(new libBeckiNotifications.Danger("Path already exists"));
              return;
            }
            if (this.files.hasOwnProperty(this.selection.value)) {
              this.files[modalModel.name] = this.files[this.selection.value];
              this.removeFile(this.selection.value);
            } else {
              for (let name in this.files) {
                if (this.files.hasOwnProperty(name)) {
                  if (name.startsWith(`${this.selection.value}${this.pathSeparator}`)) {
                    this.files[`${modalModel.name}${name.slice(this.selection.value.length)}`] = this.files[name];
                    this.removeFile(name);
                  }
                }
              }
            }
            this.selection.value = modalModel.name;
          }
        });*/
    };
    IDEComponent.prototype.onRemoveClick = function () {
        "use strict";
        if (this.readonly) {
            throw new Error("read only");
        }
        this.notifications.shift();
        /* this.modal.showModal(new libBootstrapModal.RemovalModel(this.selection.value)).then(remove => {
           if (remove) {
             switch (this.selection.type) {
               case "path":
                 if (this.files.hasOwnProperty(this.selection.value)) {
                   this.removeFile(this.selection.value);
                 } else {
                   for (let name in this.files) {
                     if (this.files.hasOwnProperty(name)) {
                       if (name.startsWith(`${this.selection.value}${this.pathSeparator}`)) {
                         this.removeFile(name);
                       }
                     }
                   }
                 }
                 break;
               case "library":
                 this.libraries[this.selection.value] = false;
                 break;
             }
             this.selection = null;
           }
         });*/
    };
    IDEComponent.prototype.onBuildClick = function () {
        "use strict";
        this.notifications.shift();
        var files = {};
        for (var name_1 in this.files) {
            if (this.files.hasOwnProperty(name_1)) {
                files[name_1.replace(this.pathSeparator, "/")] = this.files[name_1];
            }
        }
        this.filesAnnotations = {};
        /*this.backEnd.buildCProgram(files, this.buildTarget)
            .then(() => this.notifications.current.push(new libBeckiNotifications.Success("The project has been built successfully.")))
            .catch(reason => {
              // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-327
              this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-327"));
              this.notifications.current.push(new libBeckiNotifications.Danger("The project cannot be built.", reason));
            });*/
    };
    IDEComponent.prototype.onPathClick = function (path) {
        "use strict";
        // If the item is selected already, deselect it. Otherwise, select the new item.
        this.selection = this.selection && this.selection.value == path ? null : { type: "path", value: path };
        // Flip the expanded state if the item is a directory.
        if (!this.files.hasOwnProperty(path)) {
            if (this.expandedDirectories.has(path)) {
                this.expandedDirectories.delete(path);
            }
            else {
                this.expandedDirectories.add(path);
            }
        }
    };
    IDEComponent.prototype.onLibraryClick = function (library) {
        "use strict";
        // If the library is selected already, deselect it. Otherwise, select the new library.
        this.selection = this.selection && this.selection.value == library ? null : { type: "library", value: library };
    };
    __decorate([
        ngCore.Input("fieldIDE"), 
        __metadata('design:type', Object)
    ], IDEComponent.prototype, "files", void 0);
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', String)
    ], IDEComponent.prototype, "pathSeparator", void 0);
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', Object)
    ], IDEComponent.prototype, "libraries", void 0);
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', String)
    ], IDEComponent.prototype, "buildTarget", void 0);
    __decorate([
        ngCore.Input(), 
        __metadata('design:type', Boolean)
    ], IDEComponent.prototype, "readonly", void 0);
    IDEComponent = __decorate([
        ngCore.Component({
            selector: "fieldIDE",
            templateUrl: "app/lib-becki/field-ide.html",
            directives: [fieldCode.Component]
        }), 
        __metadata('design:paramtypes', [BackendService_1.BackendService])
    ], IDEComponent);
    return IDEComponent;
}());
exports.IDEComponent = IDEComponent;
//# sourceMappingURL=field-ide.js.map