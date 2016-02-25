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

import * as backEnd from "./back-end";
import * as becki from "./index";
import * as customValidator from "./custom-validator";
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/library.html",
  directives: [customValidator.Directive, layout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  versions:libBackEnd.Version[];

  nameField:string;

  descriptionField:string;

  versionField:number;

  versionNameField:string;

  versionDescriptionField:string;

  fileVersionField:string;

  @ng.ViewChild("fileField")
  fileField:ng.ElementRef;

  progress:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("library");
    this.heading = `Library ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Libraries", ["Devices"]),
      new layout.LabeledLink(`Library ${this.id}`, ["Library", {library: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.versionField = 0;
    this.versionNameField = "";
    this.versionDescriptionField = "";
    this.fileVersionField = "";
    this.progress = 0;
    this.backEnd = backEndService;
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

    this.progress += 1;
    this.backEnd.getLibrary(this.id)
        .then(library =>
            Promise.all<any>([
              library,
              this.backEnd.request("GET", library.versions)
            ])
        )
        .then(result => {
          let library:libBackEnd.Library;
          [library, this.versions] = result;
          this.nameField = library.libraryName;
          this.descriptionField = library.description;
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The library ${this.id} cannot be loaded: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    return () => {
      this.progress += 1;
      // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
      return Promise.all<any>([
            this.backEnd.getLibraries(),
            this.backEnd.getLibraryGroups(),
          ])
          .then(result => {
            this.progress -= 1;
            let libraries:libBackEnd.Library[];
            let groups:libBackEnd.LibraryGroup[];
            [libraries, groups] = result;
            return !libraries.find(library => library.id != this.id && library.libraryName == this.nameField) &&
                !groups.find(group => group.groupName == this.nameField);
          })
          .catch(reason => {
            this.progress -= 1;
            return Promise.reject(reason);
          });
    };
  }

  onUpdatingSubmit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.updateLibrary(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The library has been updated."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The library cannot be updated: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onVersionSubmit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.addVersionToLibrary(this.versionField, this.versionNameField, this.versionDescriptionField, this.id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The version has been created."));
          this.versionField = 0;
          this.versionNameField = "";
          this.versionDescriptionField = "";
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The version cannot be created: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onFileSubmit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.updateFileOfLibrary(this.fileField.nativeElement.files[0], this.fileVersionField == "new" ? null : this.fileVersionField, this.id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The file has been uploaded."));
          this.fileField.nativeElement.value = "";
          this.fileVersionField = "";
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The file cannot be uploaded: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Devices"]);
  }
}
