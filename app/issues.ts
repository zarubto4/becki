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
import * as libBootstrapListGroup from "./lib-bootstrap/list-group";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/issues.html",
  directives: [layout.Component, libBootstrapListGroup.Component, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  newTypeLink:any[];

  types:libBootstrapListGroup.Item[];

  newConfirmationLink:any[];

  confirmations:libBootstrapListGroup.Item[];

  newIssueLink:any[];

  issues:libBootstrapListGroup.Item[];

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
    this.newTypeLink = ["NewIssueType"];
    this.newConfirmationLink = ["NewIssueConfirmationType"];
    this.newIssueLink = ["NewIssue"];
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
        .then(types => this.types = types.map(type => new libBootstrapListGroup.Item(type.id, type.type, null)))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Types cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getIssueConfirmations()
        .then(confirmations => this.confirmations = confirmations.map(confirmation => new libBootstrapListGroup.Item(confirmation.id, confirmation.type, null, ["IssueConfirmationType", {confirmation: confirmation.id}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Confirmations cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-27
    this.backEnd.getIssues()
        .then(issues => this.issues = issues.map(issue => new libBootstrapListGroup.Item(issue.postId, issue.name, issue.type, ["Issue", {issue: issue.postId}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Issues cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onTypeRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-92
    this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-92"));
  }

  onConfirmationRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-93
    this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-93"));
  }

  onIssueRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-79
    this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-79"));
  }
}
