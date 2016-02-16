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
  templateUrl: "app/issue-tag-new.html",
  directives: [ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  issueId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  field:string;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.issueId = routeParams.get("issue");
    this.heading = `New Tag (Issue ${this.issueId})`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Issues", ["Issues"]),
      new wrapper.LabeledLink(`Issue ${this.issueId}`, ["Issue", {issue: this.issueId}]),
      new wrapper.LabeledLink("Tags", ["Issue", {issue: this.issueId}]),
      new wrapper.LabeledLink("New Tag", ["NewIssueTag", {issue: this.issueId}])
    ];
    this.field = "";
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
    this.backEnd.addTagToPost(this.field, this.issueId)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The tag has been added."));
          this.router.navigate(["Issue", {issue: this.issueId}]);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The tag cannot be added: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Issue", {issue: this.issueId}]);
  }
}
