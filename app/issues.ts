/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ngCore.Component({
  templateUrl: "app/issues.html",
  directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  items:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("Issues", ["Issues"])
    ];
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getIssues()
        .then(issues => this.items = issues.map(issue => new libPatternFlyListView.Item(issue.id, issue.name, `${issue.type.type}`, ["Issue", {issue: issue.id}], false)))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Issues cannot be loaded.", reason)));
  }

  onAddClick():void {
    "use strict";

    this.router.navigate(["NewIssue"]);
  }
}
