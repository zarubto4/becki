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
import * as notifications from "./notifications";

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

  backEnd:backEnd.Service;

  notifications:notifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notificationsService:notifications.Service, router:ngRouter.Router) {
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
    this.backEnd = backEndService;
    this.notifications = notificationsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getIssues()
        .then(issues => {
          let issue = issues.find(issue => issue.postId == this.issueId);
          if (!issue) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error(`issue ${this.issueId} not found`));
          }
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
          this.issues = issues.filter(issue2 => issue.linked_answers.find(related => related.answer.postId == issue2.postId) === undefined);
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("Issues cannot be loaded.", reason));
        });
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createIssueLink(this.issueId, this.field)
        .then(() => {
          this.notifications.next.push(new notifications.Success("The issue has been added."));
          this.router.navigate(["Issue", {issue: this.issueId}]);
        })
        .catch((reason) => {
          this.notifications.current.push(new notifications.Danger("The issue cannot be added.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Issue", {issue: this.issueId}]);
  }
}
