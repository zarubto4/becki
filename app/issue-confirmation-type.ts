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
  templateUrl: "app/issue-confirmation-type.html",
  directives: [ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  nameField:string;

  colorField:string;

  sizeField:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("confirmation");
    this.heading = `Confirmation ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Issues", ["Issues"]),
      new wrapper.LabeledLink("Confirmations", ["Issues"]),
      new wrapper.LabeledLink(`Confirmation ${this.id}`, ["IssueConfirmationType", {confirmation: this.id}]),
    ];
    this.nameField = "Loading...";
    this.colorField = "#ffffff";
    this.sizeField = 12;
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.getIssueConfirmations()
        .then(confirmations => {
          let confirmation = confirmations.find(confirmation => confirmation.id == this.id);
          this.nameField = confirmation.type;
          this.colorField = confirmation.color;
          this.sizeField = confirmation.size;
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`Confirmations cannot be loaded: ${reason}`));
        });
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-85
    this.alerts.current.push(new libBootstrapAlerts.Danger("issue/TYRION-85"));
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Issues"]);
  }
}
