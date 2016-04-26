/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * Documentation in this file might be outdated and the code might be dirty and
 * flawed since management prefers speed over quality.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

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

  versions:libBackEnd.Version[];

  nameField:string;

  descriptionField:string;

  versionNameField:string;

  versionDescriptionField:string;

  fileVersionField:string;

  @ng.ViewChild("fileField")
  fileField:ng.ElementRef;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("library");
    this.name = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["Devices"]),
      new libBeckiLayout.LabeledLink("Libraries", ["Devices"]),
      new libBeckiLayout.LabeledLink("Loading...", ["SystemLibrary", {library: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.versionNameField = "";
    this.versionDescriptionField = "";
    this.fileVersionField = "";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    Promise.all<any>([
          this.backEnd.getLibrary(this.id),
          this.backEnd.getLibraryVersions(this.id)
        ])
        .then(result => {
          let library:libBackEnd.Library;
          [library, this.versions] = result;
          this.name = library.library_name;
          this.breadcrumbs[3].label = library.library_name;
          this.nameField = library.library_name;
          this.descriptionField = library.description;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The library ${this.id} cannot be loaded.`, reason));
        });
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
          this.notifications.next.push(new libBeckiNotifications.Success("The library has been updated."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The library cannot be updated.", reason));
        });
  }

  onVersionSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.addVersionToLibrary(this.versionNameField, this.versionDescriptionField, this.id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The version has been created."));
          this.versionNameField = "";
          this.versionDescriptionField = "";
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        });
  }

  onFileSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateFileOfLibrary(this.fileField.nativeElement.files[0], this.fileVersionField == "new" ? null : this.fileVersionField, this.id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The file has been uploaded."));
          this.fileField.nativeElement.value = "";
          this.fileVersionField = "";
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-118
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-118"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The file cannot be uploaded.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Devices"]);
  }
}
