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
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyListView from "./lib-patternfly/list-view";
import * as notifications from "./notifications";

@ng.Component({
  templateUrl: "app/issues.html",
  directives: [layout.Component, libPatternFlyListView.Component, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  types:libPatternFlyListView.Item[];

  confirmations:libPatternFlyListView.Item[];

  issues:libPatternFlyListView.Item[];

  backEnd:backEnd.Service;

  notifications:notifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notificationsService:notifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Issues", ["Issues"])
    ];
    this.backEnd = backEndService;
    this.notifications = notificationsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.backEnd.getIssueTypes()
        .then(types => this.types = types.map(type => new libPatternFlyListView.Item(type.id, type.type, null, ["IssueType", {type: type.id}])))
        .catch(reason => this.notifications.current.push(new notifications.Danger("Types cannot be loaded.", reason)));
    this.backEnd.getIssueConfirmations()
        .then(confirmations => this.confirmations = confirmations.map(confirmation => new libPatternFlyListView.Item(confirmation.id, confirmation.type, null, ["IssueConfirmationType", {confirmation: confirmation.id}])))
        .catch(reason => this.notifications.current.push(new notifications.Danger("Confirmations cannot be loaded.", reason)));
    this.backEnd.getIssues()
        .then(issues => this.issues = issues.map(issue => new libPatternFlyListView.Item(issue.postId, issue.name, issue.type.type, ["Issue", {issue: issue.postId}])))
        .catch(reason => this.notifications.current.push(new notifications.Danger("Issues cannot be loaded.", reason)));
  }

  onTypeAddClick():void {
    "use strict";

    this.router.navigate(["NewIssueType"]);
  }

  onTypeRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteIssueType(id)
        .then(() => {
          this.notifications.current.push(new notifications.Success("The type has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("The type cannot be removed.", reason));
        });
  }

  onConfirmationAddClick():void {
    "use strict";

    this.router.navigate(["NewIssueConfirmationType"]);
  }

  onConfirmationRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteIssueConfirmation(id)
        .then(() => {
          this.notifications.next.push(new notifications.Success("The confirmation has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("The confirmation cannot be removed.", reason));
        });
  }

  onIssueAddClick():void {
    "use strict";

    this.router.navigate(["NewIssue"]);
  }

  onIssueRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deletePost(id)
        .then(() => {
          this.notifications.next.push(new notifications.Success("The issue has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("The issue cannot be removed.", reason));
        });
  }
}
