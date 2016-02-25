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
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";

@ng.Component({
  templateUrl: "app/library-group-new.html",
  directives: [customValidator.Directive, layout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  progress:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Libraries", ["Devices"]),
      new layout.LabeledLink("Groups", ["Devices"]),
      new layout.LabeledLink("New Group", ["NewLibraryGroup"])
    ];
    this.nameField = "";
    this.descriptionField = "";
    this.progress = 0;
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
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
            return !groups.find(group => group.groupName == this.nameField) &&
                !libraries.find(library => library.libraryName == this.nameField);
          })
          .catch(reason => {
            this.progress -= 1;
            return Promise.reject(reason);
          });
    };
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.createLibraryGroup(this.nameField, this.descriptionField)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The group has been created."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.alerts.next.push(new libBootstrapAlerts.Danger(`The group cannot be created: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Devices"]);
  }
}
