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
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/issue-confirmation-type.html",
  directives: [customValidator.Directive, layout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  nameField:string;

  colorField:string;

  sizeField:number;

  progress:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("confirmation");
    this.heading = `Confirmation ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Issues", ["Issues"]),
      new layout.LabeledLink("Confirmations", ["Issues"]),
      new layout.LabeledLink(`Confirmation ${this.id}`, ["IssueConfirmationType", {confirmation: this.id}]),
    ];
    this.nameField = "Loading...";
    this.colorField = "#ffffff";
    this.sizeField = 12;
    this.progress = 0;
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.getIssueConfirmation(this.id)
        .then(confirmation => {
          this.nameField = confirmation.type;
          this.colorField = confirmation.color;
          this.sizeField = confirmation.size;
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`Confirmations cannot be loaded: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    return () => {
      this.progress += 1;
      // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
      return this.backEnd.getIssueConfirmations()
          .then(confirmations => {
            this.progress -= 1;
            return !confirmations.find(confirmation => confirmation.id != this.id && confirmation.type == this.nameField);
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
    this.backEnd.updateIssueConfirmation(this.id, this.nameField, this.colorField, this.sizeField)
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The confirmation has been updated."));
          this.router.navigate(["Issues"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The confirmation cannot be updated: ${reason}`));
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
