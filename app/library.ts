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
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/library.html",
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  versions:libBackEnd.Version[];

  nameField:string;

  descriptionField:string;

  versionField:number;

  versionNameField:string;

  versionDescriptionField:string;

  fileVersionField:string;

  @ng.ViewChild("fileField")
  fileField:ng.ElementRef;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("library");
    this.heading = `Library ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Libraries", ["Devices"]),
      new wrapper.LabeledLink(`Library ${this.id}`, ["Library", {library: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.versionField = 0;
    this.versionNameField = "";
    this.versionDescriptionField = "";
    this.fileVersionField = "";
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

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
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The library ${this.id} cannot be loaded: ${reason}`));
        });
  }

  onUpdatingSubmit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.updateLibrary(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The library has been updated."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The library cannot be updated: ${reason}`));
        });
  }

  onVersionSubmit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.addVersionToLibrary(this.versionField, this.versionNameField, this.versionDescriptionField, this.id)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The version has been created."));
          this.versionField = 0;
          this.versionNameField = "";
          this.versionDescriptionField = "";
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The version cannot be created: ${reason}`));
        });
  }

  onFileSubmit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.updateFileOfLibrary(this.fileField.nativeElement.files[0], this.fileVersionField == "new" ? null : this.fileVersionField, this.id)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The file has been uploaded."));
          this.fileField.nativeElement.value = "";
          this.fileVersionField = "";
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The file cannot be uploaded: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Devices"]);
  }
}
