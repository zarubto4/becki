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
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/issues.html",
  directives: [libBootstrapPanelList.Component, wrapper.Component],
})
export class Component implements ng.OnInit {

  breadcrumbs:wrapper.LabeledLink[];

  types:libBootstrapPanelList.Item[];

  confirmations:libBootstrapPanelList.Item[];

  issues:libBootstrapPanelList.Item[];

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Issues", ["Issues"])
    ];
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.backEnd.getIssueTypes()
        .then(types => this.types = types.map(type => new libBootstrapPanelList.Item(type.id, type.type, null)))
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Types cannot be loaded: ${reason}`)));
    this.backEnd.getIssueConfirmations()
        .then(confirmations => this.confirmations = confirmations.map(confirmation => new libBootstrapPanelList.Item(confirmation.id, confirmation.type, null, ["IssueConfirmationType", {confirmation: confirmation.id}])))
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Confirmations cannot be loaded: ${reason}`)));
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-27
    this.backEnd.getIssues()
        .then(issues => this.issues = issues.map(issue => new libBootstrapPanelList.Item(issue.postId, issue.name, issue.type, ["Issue", {issue: issue.postId}])))
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Issues cannot be loaded: ${reason}`)));
  }

  onTypeAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewIssueType"]);
  }

  onTypesRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-92
    this.alerts.current.push(new libBootstrapAlerts.Danger("issue/TYRION-92"));
  }

  onConfirmationAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewIssueConfirmationType"]);
  }

  onConfirmationsRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-93
    this.alerts.current.push(new libBootstrapAlerts.Danger("issue/TYRION-93"));
  }

  onIssueAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewIssue"]);
  }

  onIssuesRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-79
    this.alerts.current.push(new libBootstrapAlerts.Danger("issue/TYRION-79"));
  }
}
