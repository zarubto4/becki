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
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";

@ng.Component({
  templateUrl: "app/issue-related-new.html",
  directives: [layout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  issueId:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  issues:libBackEnd.Issue[];

  field:string;

  progress:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.issueId = routeParams.get("issue");
    this.heading = `New Issue Related to Issue ${this.issueId}`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Issues", ["Issues"]),
      new layout.LabeledLink(`Issue ${this.issueId}`, ["Issue", {issue: this.issueId}]),
      new layout.LabeledLink("Related Issues", ["Issue", {issue: this.issueId}]),
      new layout.LabeledLink("New Related Issue", ["NewRelatedIssue", {issue: this.issueId}])
    ];
    this.field = "";
    this.progress = 0;
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.getIssues()
        .then(issues => {
          let issue = issues.find(issue => issue.postId == this.issueId);
          if (!issue) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error(`issue ${this.issueId} not found`));
          }
          return Promise.all([
            issues,
            issue.linkedAnswers ? this.backEnd.request<libBackEnd.IssueLink[]>("GET", issue.linkedAnswers).then(related => Promise.all(related.map(related2 => this.backEnd.request("GET", related2.post)))) : []
          ]);
        })
        .then(result => {
          let issues:libBackEnd.Issue[];
          let ignore:libBackEnd.Issue[];
          [issues, ignore] = result;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
          this.issues = issues.filter(issue => ignore.find(issue2 => issue2.postId == issue.postId) === undefined);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`Issues cannot be loaded: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.createIssueLink(this.issueId, this.field)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The issue has been added."));
          this.router.navigate(["Issue", {issue: this.issueId}]);
        })
        .catch((reason) => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The issue cannot be added: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Issue", {issue: this.issueId}]);
  }
}
