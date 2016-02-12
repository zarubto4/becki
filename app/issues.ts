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
import * as events from "./events";
import * as libBackEnd from "./lib-back-end/index";
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

  events:events.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Issues", ["Issues"])
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getIssueTypes()
        .then(types => {
          this.events.send(types);
          this.types = types.map(type => new libBootstrapPanelList.Item(type.type, type.type, null));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getIssueConfirmations()
        .then(confirmations => {
          this.events.send(confirmations);
          this.confirmations = confirmations.map(confirmation => new libBootstrapPanelList.Item(confirmation.id, confirmation.type, null));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-27
    this.backEnd.getIssues()
        .then(issues => {
          this.events.send(issues);
          this.issues = issues.map(issue => new libBootstrapPanelList.Item(issue.postId, issue.name, issue.type));
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onTypeAddClick():void {
    "use strict";

    this.router.navigate(["NewIssueType"]);
  }

  getConfirmationLink(confirmation:libBootstrapPanelList.Item):any[] {
    "use strict";

    return ["IssueConfirmationType", {confirmation: confirmation.id}];
  }

  onConfirmationAddClick():void {
    "use strict";

    this.router.navigate(["NewIssueConfirmationType"]);
  }

  getLink(issue:libBootstrapPanelList.Item):any[] {
    "use strict";

    return ["Issue", {issue: issue.id}];
  }

  onIssueAddClick():void {
    "use strict";

    this.router.navigate(["NewIssue"]);
  }
}
