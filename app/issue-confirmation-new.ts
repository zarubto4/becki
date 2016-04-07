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
  templateUrl: "app/issue-confirmation-new.html",
  directives: [layout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  issueId:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  confirmations:libBackEnd.IssueConfirmation[];

  field:string;

  backEnd:backEnd.Service;

  notifications:notifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notificationsService:notifications.Service, router:ngRouter.Router) {
    "use strict";

    this.issueId = routeParams.get("issue");
    this.heading = `New Confirmation (Issue ${this.issueId})`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Issues", ["Issues"]),
      new layout.LabeledLink(`Issue ${this.issueId}`, ["Issue", {issue: this.issueId}]),
      new layout.LabeledLink("New Confirmation", ["NewIssueConfirmation", {issue: this.issueId}])
    ];
    this.field = "";
    this.backEnd = backEndService;
    this.notifications = notificationsService;
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
          this.confirmations = confirmations.filter(confirmation => !issue.type_of_confirms.find(confirmation2 => confirmation2.id == confirmation.id));
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("Confirmations cannot be loaded.", reason));
        });
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.addConfirmationToPost(this.field, this.issueId)
        .then(() => {
          this.notifications.next.push(new notifications.Success("The confirmation has been added."));
          this.router.navigate(["Issue", {issue: this.issueId}]);
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("The confirmation cannot be added.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Issue", {issue: this.issueId}]);
  }
}
