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
import * as events from "./events";
import * as libBackEnd from "./lib-back-end/index";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/library.html",
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  versions:number[];

  nameField:string;

  descriptionField:string;

  versionField:number;

  versionNameField:string;

  versionDescriptionField:string;

  fileVersionField:string;

  @ng.ViewChild("fileField")
  fileField:ng.ElementRef;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
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
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.refresh();
  }

  refresh():void {
    "use strict";

    this.backEnd.getLibrary(this.id)
        .then(library =>
            Promise.all<any>([
              library,
              // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-55
              this.backEnd.request("GET", library.description)
            ])
        )
        .then(result => {
          let library:libBackEnd.Library;
          [library, this.descriptionField] = result;
          this.events.send(result);
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-63
          this.versions = [library.lastVersion];
          this.nameField = library.libraryName;
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onUpdatingSubmit():void {
    "use strict";

    this.backEnd.updateLibrary(this.id, this.nameField, this.descriptionField)
        .then(message => {
          this.events.send(message);
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onVersionSubmit():void {
    "use strict";

    this.backEnd.addVersionToLibrary(this.versionField, this.versionNameField, this.versionDescriptionField, this.id)
        .then(message => {
          this.events.send(message);
          this.versionField = 0;
          this.versionNameField = "";
          this.versionDescriptionField = "";
          this.refresh();
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onFileSubmit():void {
    "use strict";

    this.backEnd.updateFileOfLibrary(this.fileField.nativeElement.files[0], this.fileVersionField == "new" ? null : this.fileVersionField, this.id)
        .then(message => {
          this.events.send(message);
          this.fileField.nativeElement.value = "";
          this.fileVersionField = "";
          this.refresh();
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onCancelClick():void {
    "use strict";

    this.router.navigate(["Devices"]);
  }
}
