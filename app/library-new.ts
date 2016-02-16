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
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/library-new.html",
  directives: [ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  breadcrumbs:wrapper.LabeledLink[];

  nameField:string;

  descriptionField:string;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Libraries", ["Devices"]),
      new wrapper.LabeledLink("New Library", ["NewLibrary"])
    ];
    this.nameField = "";
    this.descriptionField = "";
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.createLibrary(this.nameField, this.descriptionField)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The library has been created."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The library cannot be created: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Devices"]);
  }
}
