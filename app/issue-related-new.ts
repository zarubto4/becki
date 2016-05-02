/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ng from "angular2/angular2";
import * as ngRouter from "angular2/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/issue-related-new.html",
  directives: [libBeckiLayout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  issueId:string;

  issueTitle:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  issues:libBackEnd.Issue[];

  field:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.issueId = routeParams.get("issue");
    this.issueTitle = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("Issues", ["Issues"]),
      new libBeckiLayout.LabeledLink("Loading...", ["Issue", {issue: this.issueId}]),
      new libBeckiLayout.LabeledLink("New Related Issue", ["NewRelatedIssue", {issue: this.issueId}])
    ];
    this.field = "";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getIssues()
        .then(issues => {
          let issue = issues.find(issue => issue.id == this.issueId);
          if (!issue) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error(`issue ${this.issueId} not found`));
          }
          this.issueTitle = issue.name;
          this.breadcrumbs[2].label = issue.name;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
          this.issues = issues.filter(issue2 => issue2.id != this.issueId && issue.linked_answers.find(related => related.answer.id == issue2.id) === undefined);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("Issues cannot be loaded.", reason));
        });
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createIssueLink(this.issueId, this.field)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The issue has been added."));
          this.router.navigate(["Issue", {issue: this.issueId}]);
        })
        .catch((reason) => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The issue cannot be added.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Issue", {issue: this.issueId}]);
  }
}
