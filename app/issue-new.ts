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
import * as fieldIssueBody from "./field-issue-body";
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as notifications from "./notifications";

@ng.Component({
  templateUrl: "app/issue-new.html",
  directives: [fieldIssueBody.Component, layout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  types:libBackEnd.IssueType[];

  typeField:string;

  titleField:string;

  bodyField:string;

  backEnd:backEnd.Service;

  notifications:notifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notificationsService:notifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("New Issue", ["NewIssue"])
    ];
    this.typeField = "";
    this.titleField = "";
    this.bodyField = fieldIssueBody.EMPTY;
    this.backEnd = backEndService;
    this.notifications = notificationsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getIssueTypes()
        .then(types => this.types = types)
        .catch(reason => this.notifications.current.push(new notifications.Danger("Types cannot be loaded.", reason)));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createIssue(this.typeField, this.titleField, this.bodyField, [])
        .then(() => {
          this.notifications.next.push(new notifications.Success("The issue has been created."));
          this.router.navigate(["Issues"]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-183
          this.notifications.current.push(new notifications.Warning("issue/TYRION-183"));
          this.notifications.current.push(new notifications.Danger("The issue cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Issues"]);
  }
}
