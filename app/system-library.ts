/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as _ from "underscore";
import * as ng from "angular2/angular2";
import * as ngRouter from "angular2/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/system-library.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  nameField:string;

  descriptionField:string;

  description:string;

  versionNameField:string;

  version:libBackEnd.Version;

  versionDescriptionField:string;

  @ng.ViewChild("versionFileField")
  versionFileField:ng.ElementRef;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
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
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.versionNameField = "Loading...";
    this.versionDescriptionField = "Loading...";
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    Promise.all<any>([
          this.backEnd.getLibrary(this.id),
          this.backEnd.getLibraryVersions(this.id)
        ])
        .then(result => {
          let library:libBackEnd.Library;
          let versions:libBackEnd.Version[];
          [library, versions] = result;
          this.name = library.library_name;
          this.breadcrumbs[3].label = library.library_name;
          this.nameField = library.library_name;
          this.descriptionField = library.description;
          this.description = library.description;
          this.version = versions.length ? _.max(versions, version => version.date_of_create) : null;
          this.versionNameField = this.version ? this.version.version_name : "";
          this.versionDescriptionField = this.version ? this.version.version_description : "";
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
          this.backEnd.getLibraries(),
          this.backEnd.getLibraryGroups(),
        ])
        .then(result => {
          let libraries:libBackEnd.Library[];
          let groups:libBackEnd.LibraryGroup[];
          [libraries, groups] = result;
          return !libraries.find(library => library.id != this.id && library.library_name == this.nameField) && !groups.find(group => group.group_name == this.nameField);
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
    this.backEnd.addVersionToLibrary(this.versionNameField, this.versionDescriptionField, this.id)
        .then(version => {
          return this.backEnd.updateFileOfLibrary(this.versionFileField.nativeElement.files[0], version.id, this.id);
        })
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The version has been created."));
          this.versionFileField.nativeElement.value = "";
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-118
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-118"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        });
  }
}
