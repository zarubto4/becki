/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/system-issue-type.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.FORM_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

  id:string;

  type:libBackEnd.IssueType;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  field:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("type");
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["System"]),
      new libBeckiLayout.LabeledLink("Issue Types", ["System"]),
      new libBeckiLayout.LabeledLink("Loading...", ["SystemIssueType", {type: this.id}])
    ];
    this.field = "Loading...";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getIssueType(this.id)
        .then(type => {
          this.type = type;
          this.breadcrumbs[3].label = type.type;
          this.field = type.type;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The type ${this.id} cannot be loaded.`, reason));
        });
  }

  validateField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getIssueTypes().then(types => !types.find(type => type.id != this.id && type.type == this.field));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateIssueType(this.id, this.field)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The type has been updated."));
          this.router.navigate(["System"]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-229
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-229"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The type cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["System"]);
  }
}
