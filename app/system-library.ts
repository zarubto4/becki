/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/system-library.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES, ngCommon.FORM_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

  id:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  editLibrary:boolean;

  addVersion:boolean;

  nameField:string;

  descriptionField:string;

  description:string;

  versionNameField:string;

  versionDescriptionField:string;

  @ngCore.ViewChild("versionFileField")
  versionFileField:ngCore.ElementRef;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.id = routeParams.get("library");
    this.name = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["System"]),
      new libBeckiLayout.LabeledLink("Libraries", ["System"]),
      new libBeckiLayout.LabeledLink("Loading...", ["SystemLibrary", {library: this.id}])
    ];
    this.editing = false;
    this.editLibrary = false;
    this.addVersion = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.versionNameField = "Loading...";
    this.versionDescriptionField = "Loading...";
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    this.backEnd.getLibrary(this.id)
        .then(library => {
          this.name = library.library_name;
          this.breadcrumbs[3].label = library.library_name;
          this.editLibrary = library.edit_permission;
          this.addVersion = library.update_permission;
          this.nameField = library.library_name;
          this.descriptionField = library.description;
          this.description = library.description;
          this.versionNameField = "";
          this.versionDescriptionField = "";
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The library ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => Promise.all<any>([
          this.backEnd.getLibraries(1),
          this.backEnd.getLibraryGroups(1)
        ])
        .then(result => {
          let libraryCollection:libBackEnd.LibraryCollection;
          let groupCollection:libBackEnd.LibraryGroupCollection;
          [libraryCollection, groupCollection] = result;
          return Promise.all<any>([
            Promise.all(libraryCollection.pages.map(page => this.backEnd.getLibraries(page))),
            Promise.all(groupCollection.pages.map(page => this.backEnd.getLibraryGroups(page)))
          ]);
        })
        .then(result => {
          let libraryCollections:libBackEnd.LibraryCollection[];
          let groupCollections:libBackEnd.LibraryGroupCollection[];
          [libraryCollections, groupCollections] = result;
          return ![].concat(...libraryCollections.map(collection => collection.content)).find(library => library.id != this.id && library.library_name == this.nameField) &&
              ![].concat(...groupCollections.map(collection => collection.content)).find(group => group.group_name == this.nameField);
        });
  }

  onEditSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateLibrary(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The library has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The library cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.editing = false;
  }

  onVersionSubmit():void {
    "use strict";

    this.notifications.shift();
    let reader = new FileReader();
    reader.readAsText(this.versionFileField.nativeElement.files[0]);
    reader.onloadend = event => this.backEnd.addVersionToLibrary(this.versionNameField, this.versionDescriptionField, this.id)
        .then(version => {
          return this.backEnd.updateFileOfLibrary(reader.result, version.id);
        })
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The version has been created."));
          this.versionFileField.nativeElement.value = "";
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-305
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-305"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        });
  }
}
