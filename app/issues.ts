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
import * as libPatternFlyListView from "./lib-patternfly/list-view";
import * as notifications from "./notifications";

@ng.Component({
  templateUrl: "app/issues.html",
  directives: [layout.Component, libPatternFlyListView.Component, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  items:libPatternFlyListView.Item[];

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
    this.backEnd.getIssues()
        .then(issues => this.items = issues.map(issue => new libPatternFlyListView.Item(issue.postId, issue.name, issue.type.type, ["Issue", {issue: issue.postId}])))
        .catch(reason => this.notifications.current.push(new notifications.Danger("Issues cannot be loaded.", reason)));
  }

  onAddClick():void {
    "use strict";

    this.router.navigate(["NewIssue"]);
  }
}
