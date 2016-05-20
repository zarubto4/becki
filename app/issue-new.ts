/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiFieldIssueBody from "./lib-becki/field-issue-body";
import * as libBeckiFieldIssueTags from "./lib-becki/field-issue-tags";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/issue-new.html",
  directives: [
    libBeckiFieldIssueBody.Component,
    libBeckiFieldIssueTags.Component,
    libBeckiLayout.Component,
    ngCommon.CORE_DIRECTIVES,
    ngCommon.FORM_DIRECTIVES
  ]
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  types:libBackEnd.IssueType[];

  typeField:string;

  titleField:string;

  bodyField:string;

  tagsField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("New Issue", ["NewIssue"])
    ];
    this.typeField = "";
    this.titleField = "";
    this.bodyField = libBeckiFieldIssueBody.EMPTY;
    this.tagsField = "";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getIssueTypes()
        .then(types => this.types = types)
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Types cannot be loaded.", reason)));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createIssue(this.typeField, this.titleField, this.bodyField, libBeckiFieldIssueTags.parseTags(this.tagsField))
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The issue has been created."));
          this.router.navigate(["Issues"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The issue cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Issues"]);
  }
}
