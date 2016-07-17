/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as _ from "underscore";
import * as ngCore from "@angular/core";

import * as fieldCode from "./field-code";
import * as libBeckiNotifications from "../lib-becki/notifications";
import * as libBootstrapDropdown from "../lib-bootstrap/dropdown";
import * as libBootstrapModal from "../lib-bootstrap/modal";

@ngCore.Component({
  selector: "[fieldIDE]",
  templateUrl: "app/lib-becki/field-ide.html",
  directives: [fieldCode.Component, libBootstrapDropdown.DIRECTIVES]
})
export class Component {

  @ngCore.Input("fieldIDE")
  files:{[name:string]: string};

  expandedDirectories:Set<string>;

  @ngCore.Input()
  pathSeparator:string;

  @ngCore.Input()
  libraries:{[name:string]: boolean};

  selection:{type: string, value: string};

  @ngCore.Input()
  readonly:boolean;

  modal:libBootstrapModal.Component;

  notifications:libBeckiNotifications.Service;

  constructor(modalComponent:libBootstrapModal.Component, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.files = {};
    this.expandedDirectories = new Set<string>();
    this.pathSeparator = "/";
    this.libraries = {};
    this.selection = null;
    this.modal = modalComponent;
    this.notifications = notifications;
  }

  getPathBasename(path:string):string {
    "use strict";

    let separatorIndex = path.lastIndexOf(this.pathSeparator);
    return path.slice(separatorIndex + 1);
  }

  getPathDirname(path:string):string {
    "use strict";

    let separatorIndex = path.lastIndexOf(this.pathSeparator);
    return path.slice(0, Math.max(separatorIndex, 0));
  }

  convertPathToPaths(path:string):string[] {
    "use strict";

    let separatorIndex = path.lastIndexOf(this.pathSeparator);
    if (separatorIndex == -1) {
      return [path];
    }

    let parentPaths:string[];
    parentPaths = this.convertPathToPaths(path.slice(0, separatorIndex));
    parentPaths.push(path);
    return parentPaths;
  }

  getPaths(sorted=false):string[] {
    "use strict";

    let filePaths = Object.keys(this.files);
    let allPaths = [].concat(...filePaths.map(path => this.convertPathToPaths(path)));
    let allUniquePaths = _.uniq(allPaths);
    if (sorted) {
      allUniquePaths.sort();
    }
    return allUniquePaths;
  }

  isPathExpanded(path:string):boolean {
    "use strict";

    if (this.files.hasOwnProperty(path)) {
      return null;
    }

    return this.expandedDirectories.has(path);
  }

  isPathHidden(path:string):boolean {
    "use strict";

    let dirname = this.getPathDirname(path);
    if (!dirname) {
      return false;
    }

    return !this.isPathExpanded(dirname) || this.isPathHidden(dirname);
  }

  getLibraries(sorted=false):string[] {
    "use strict";

    let names = Object.keys(this.libraries);
    let added = names.filter(name => this.libraries[name]);
    if (sorted) {
      added.sort();
    }
    return added;
  }

  canAddLibraries():boolean {
    "use strict";

    let names = Object.keys(this.libraries);
    return names.some(name => !this.libraries[name]);
  }

  onAddPathClick():void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }

    this.notifications.shift();
    let parts:string[] = [];
    if (this.selection && this.selection.type == "path") {
      if (this.files.hasOwnProperty(this.selection.value)) {
        let dirname = this.getPathDirname(this.selection.value);
        if (dirname) {
          parts.push(dirname);
        }
      } else {
        parts.push(this.selection.value);
      }
    }
    parts.push("new_file.cpp");
    let modalModel = new libBootstrapModal.FilenameModel(parts.join(this.pathSeparator), this.pathSeparator);

    this.modal.showModal(modalModel).then(add => {
      if (add) {
        if (this.getPaths().indexOf(modalModel.name) != -1) {
          this.notifications.current.push(new libBeckiNotifications.Danger("Path already exists"));
          return;
        }
        this.files[modalModel.name] = "";
        this.selection = {type: "path", value: modalModel.name};
      }
    });
  }

  onAddLibraryClick():void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }

    this.notifications.shift();
    let modalModel = new libBootstrapModal.SelectionModel(Object.keys(this.libraries).filter(name => !this.libraries[name]).sort());

    this.modal.showModal(modalModel).then(add => {
      if (add) {
        this.libraries[modalModel.selection] = true;
        this.selection = {type: "library", value: modalModel.selection};
      }
    });
  }

  onMoveClick():void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }

    this.notifications.shift();
    let modalModel = new libBootstrapModal.FilenameModel(this.selection.value, this.pathSeparator);
    this.modal.showModal(modalModel).then(move => {
      if (move) {
        if (this.getPaths().indexOf(modalModel.name) != -1) {
          this.notifications.current.push(new libBeckiNotifications.Danger("Path already exists"));
          return;
        }
        if (this.files.hasOwnProperty(this.selection.value)) {
          this.files[modalModel.name] = this.files[this.selection.value];
          delete this.files[this.selection.value];
        } else {
          for (let name in this.files) {
            if (this.files.hasOwnProperty(name)) {
              if (name.startsWith(`${this.selection.value}${this.pathSeparator}`)) {
                this.files[`${modalModel.name}${name.slice(this.selection.value.length)}`] = this.files[name];
                delete this.files[name];
              }
            }
          }
        }
        this.selection.value = modalModel.name;
      }
    });
  }

  onRemoveClick():void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }

    this.notifications.shift();
    this.modal.showModal(new libBootstrapModal.RemovalModel(this.selection.value)).then(remove => {
      if (remove) {
        switch (this.selection.type) {
          case "path":
            if (this.files.hasOwnProperty(this.selection.value)) {
              delete this.files[this.selection.value];
            } else {
              for (let name in this.files) {
                if (this.files.hasOwnProperty(name)) {
                  if (name.startsWith(`${this.selection.value}${this.pathSeparator}`)) {
                    delete this.files[name];
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
    });
  }

  onPathClick(path:string):void {
    "use strict";

    // If the item is selected already, deselect it. Otherwise, select the new item.
    this.selection = this.selection && this.selection.value == path ? null : {type: "path", value: path};
    // Flip the expanded state if the item is a directory.
    if (!this.files.hasOwnProperty(path)) {
      if (this.expandedDirectories.has(path)) {
        this.expandedDirectories.delete(path);
      } else {
        this.expandedDirectories.add(path);
      }
    }
  }

  onLibraryClick(library:string):void {
    "use strict";

    // If the library is selected already, deselect it. Otherwise, select the new library.
    this.selection = this.selection && this.selection.value == library ? null : {type: "library", value: library};
  }
}
