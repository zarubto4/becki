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
  templateUrl: "app/issue-related-new.html",
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  issueId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  issues:libBackEnd.Issue[];

  field:string;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.issueId = routeParams.get("issue");
    this.heading = `New Issue Related to Issue ${this.issueId}`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Issues", ["Issues"]),
      new wrapper.LabeledLink(`Issue ${this.issueId}`, ["Issue", {issue: this.issueId}]),
      new wrapper.LabeledLink("Related Issues", ["Issue", {issue: this.issueId}]),
      new wrapper.LabeledLink("New Related Issue", ["NewRelatedIssue", {issue: this.issueId}])
    ];
    this.field = "";
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.getIssues()
        .then(issues => this.issues = issues)
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Issues cannot be loaded: ${reason}`)));
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.createIssueLink(this.issueId, this.field)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The issue has been added."));
          this.router.navigate(["Issue", {issue: this.issueId}]);
        })
        .catch((reason) => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The issue cannot be added: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Issue", {issue: this.issueId}]);
  }
}
