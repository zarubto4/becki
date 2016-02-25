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
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/issues.html",
  directives: [layout.Component, libBootstrapPanelList.Component]
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  types:libBootstrapPanelList.Item[];

  confirmations:libBootstrapPanelList.Item[];

  issues:libBootstrapPanelList.Item[];

  progress:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Issues", ["Issues"])
    ];
    this.progress = 0;
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.progress += 3;
    this.backEnd.getIssueTypes()
        .then(types => this.types = types.map(type => new libBootstrapPanelList.Item(type.id, type.type, null)))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Types cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getIssueConfirmations()
        .then(confirmations => this.confirmations = confirmations.map(confirmation => new libBootstrapPanelList.Item(confirmation.id, confirmation.type, null, ["IssueConfirmationType", {confirmation: confirmation.id}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Confirmations cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-27
    this.backEnd.getIssues()
        .then(issues => this.issues = issues.map(issue => new libBootstrapPanelList.Item(issue.postId, issue.name, issue.type, ["Issue", {issue: issue.postId}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Issues cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onTypeAddClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["NewIssueType"]);
  }

  onTypesRemoveClick(ids:string[]):void {
    "use strict";

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-92
    this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-92"));
  }

  onConfirmationAddClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["NewIssueConfirmationType"]);
  }

  onConfirmationsRemoveClick(ids:string[]):void {
    "use strict";

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-93
    this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-93"));
  }

  onIssueAddClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["NewIssue"]);
  }

  onIssuesRemoveClick(ids:string[]):void {
    "use strict";

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-79
    this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-79"));
  }
}
