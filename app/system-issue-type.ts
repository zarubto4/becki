/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
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

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/system-issue-type.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  type:libBackEnd.IssueType;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  field:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
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

  onInit():void {
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
