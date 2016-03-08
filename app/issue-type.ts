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

import * as backEnd from "./back-end";
import * as becki from "./index";
import * as customValidator from "./custom-validator";
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/issue-type.html",
  directives: [customValidator.Directive, layout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  field:string;

  progress:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("type");
    this.heading = `Type ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Issues", ["Issues"]),
      new layout.LabeledLink("Types", ["Issues"]),
      new layout.LabeledLink(`Type ${this.id}`, ["IssueType", {type: this.id}])
    ];
    this.field = "Loading...";
    this.progress = 0;
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.getIssueType(this.id)
        .then(type => this.field = type.type)
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`The type ${this.id} cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  validateField():()=>Promise<boolean> {
    "use strict";

    return () => {
      this.progress += 1;
      // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
      return this.backEnd.getIssueTypes()
          .then(types => {
            this.progress -= 1;
            return !types.find(type => type.id != this.id && type.type == this.field);
          })
          .catch(reason => {
            this.progress -= 1;
            return Promise.reject(reason);
          });
    };
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.updateIssueType(this.id, this.field)
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The type has been updated."));
          this.router.navigate(["Issues"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The type cannot be updated: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Issues"]);
  }
}
