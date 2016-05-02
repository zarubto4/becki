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
  templateUrl: "app/issue-confirmation-new.html",
  directives: [libBeckiLayout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  issueId:string;

  issueTitle:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  confirmations:libBackEnd.IssueConfirmation[];

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
      new libBeckiLayout.LabeledLink("New Confirmation", ["NewIssueConfirmation", {issue: this.issueId}])
    ];
    this.field = "";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    Promise.all<any>([
          this.backEnd.getIssueConfirmations(),
          this.backEnd.getIssue(this.issueId)
        ])
        .then(result => {
          let confirmations:libBackEnd.IssueConfirmation[];
          let issue:libBackEnd.Issue;
          [confirmations, issue] = result;
          this.issueTitle = issue.name;
          this.breadcrumbs[2].label = issue.name;
          this.confirmations = confirmations.filter(confirmation => !issue.type_of_confirms.find(confirmation2 => confirmation2.id == confirmation.id));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("Confirmations cannot be loaded.", reason));
        });
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.addConfirmationToPost(this.field, this.issueId)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The confirmation has been added."));
          this.router.navigate(["Issue", {issue: this.issueId}]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-226
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-226"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The confirmation cannot be added.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Issue", {issue: this.issueId}]);
  }
}
