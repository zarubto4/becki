/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
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
import * as fieldIssueBody from "./field-issue-body";
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/issue-new.html",
  directives: [fieldIssueBody.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  breadcrumbs:wrapper.LabeledLink[];

  types:libBackEnd.IssueType[];

  typeField:string;

  titleField:string;

  bodyField:string;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Issues", ["Issues"]),
      new wrapper.LabeledLink("New Issue", ["NewIssue"])
    ];
    this.typeField = "";
    this.titleField = "";
    this.bodyField = fieldIssueBody.EMPTY;
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.getIssueTypes()
        .then(types => this.types = types)
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Types cannot be loaded: ${reason}`)));
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.createIssue(this.typeField, this.titleField, this.bodyField, [])
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Danger("The issue has been created."));
          this.router.navigate(["Issues"]);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The issue cannot be created: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Issues"]);
  }
}
