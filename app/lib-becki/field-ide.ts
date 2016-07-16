/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as _ from "underscore";
import * as ngCore from "@angular/core";

import * as fieldCode from "./field-code";
import * as libBeckiNotifications from "../lib-becki/notifications";
import * as libBootstrapModal from "../lib-bootstrap/modal";

@ngCore.Component({
  selector: "[fieldIDE]",
  templateUrl: "app/lib-becki/field-ide.html",
  directives: [fieldCode.Component]
})
export class Component {

  @ngCore.Input("fieldIDE")
  files:{[name:string]: string};

  expandedDirectories:Set<string>;

  @ngCore.Input()
  pathSeparator:string;

  selection:string;

  @ngCore.Input()
  readonly:boolean;

  modal:libBootstrapModal.Component;

  notifications:libBeckiNotifications.Service;

  constructor(modalComponent:libBootstrapModal.Component, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.files = {};
    this.expandedDirectories = new Set<string>();
    this.pathSeparator = "/";
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

  onAddClick():void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }

    this.notifications.shift();
    let parts:string[] = [];
    if (this.selection) {
      if (this.files.hasOwnProperty(this.selection)) {
        let dirname = this.getPathDirname(this.selection);
        if (dirname) {
          parts.push(dirname);
        }
      } else {
        parts.push(this.selection);
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
        this.selection = modalModel.name;
      }
    });
  }

  onMoveClick():void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }

    this.notifications.shift();
    let modalModel = new libBootstrapModal.FilenameModel(this.selection, this.pathSeparator);
    this.modal.showModal(modalModel).then(move => {
      if (move) {
        if (this.getPaths().indexOf(modalModel.name) != -1) {
          this.notifications.current.push(new libBeckiNotifications.Danger("Path already exists"));
          return;
        }
        if (this.files.hasOwnProperty(this.selection)) {
          this.files[modalModel.name] = this.files[this.selection];
          delete this.files[this.selection];
        } else {
          for (let name in this.files) {
            if (this.files.hasOwnProperty(name)) {
              if (name.startsWith(`${this.selection}${this.pathSeparator}`)) {
                this.files[`${modalModel.name}${name.slice(this.selection.length)}`] = this.files[name];
                delete this.files[name];
              }
            }
          }
        }
        this.selection = modalModel.name;
      }
    });
  }

  onRemoveClick():void {
    "use strict";

    if (this.readonly) {
      throw new Error("read only");
    }

    this.notifications.shift();
    this.modal.showModal(new libBootstrapModal.RemovalModel(this.selection)).then(remove => {
      if (remove) {
        if (this.files.hasOwnProperty(this.selection)) {
          delete this.files[this.selection];
        } else {
          for (let name in this.files) {
            if (this.files.hasOwnProperty(name)) {
              if (name.startsWith(`${this.selection}${this.pathSeparator}`)) {
                delete this.files[name];
              }
            }
          }
        }
        this.selection = null;
      }
    });
  }

  onPathClick(path:string):void {
    "use strict";

    // If the item is selected already, deselect it. Otherwise, select the new item.
    this.selection = this.selection == path ? null : path;
    // Flip the expanded state if the item is a directory.
    if (!this.files.hasOwnProperty(path)) {
      if (this.expandedDirectories.has(path)) {
        this.expandedDirectories.delete(path);
      } else {
        this.expandedDirectories.add(path);
      }
    }
  }
}
