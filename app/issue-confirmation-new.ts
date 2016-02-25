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
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

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

  progress:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.issueId = routeParams.get("issue");
    this.heading = `New Confirmation (Issue ${this.issueId})`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Issues", ["Issues"]),
      new layout.LabeledLink(`Issue ${this.issueId}`, ["Issue", {issue: this.issueId}]),
      new layout.LabeledLink("Confirmations", ["Issue", {issue: this.issueId}]),
      new layout.LabeledLink("New Confirmation", ["NewIssueConfirmation", {issue: this.issueId}])
    ];
    this.field = "";
    this.progress = 0;
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.getIssueConfirmations()
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-86
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
        .then(confirmations => this.confirmations = confirmations)
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Confirmations cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.addConfirmationToPost(this.issueId, this.field)
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The confirmation has been added."));
          this.router.navigate(["Issue", {issue: this.issueId}]);
        })
        .catch(reason => {
          this.notifications.next.push(new libPatternFlyNotifications.Danger(`The confirmation cannot be added: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Issue", {issue: this.issueId}]);
  }
}
