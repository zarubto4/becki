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
  templateUrl: "app/system-issue-confirmation.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  confirmation:libBackEnd.IssueConfirmation;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  nameField:string;

  colorField:string;

  sizeField:number;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("confirmation");
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["System"]),
      new libBeckiLayout.LabeledLink("Issue Confirmations", ["System"]),
      new libBeckiLayout.LabeledLink("Loading...", ["SystemIssueConfirmation", {confirmation: this.id}]),
    ];
    this.editing = false;
    this.nameField = "Loading...";
    this.colorField = "#ffffff";
    this.sizeField = 12;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    this.backEnd.getIssueConfirmation(this.id)
        .then(confirmation => {
          this.confirmation = confirmation;
          this.breadcrumbs[3].label = confirmation.type;
          this.nameField = confirmation.type;
          this.colorField = confirmation.color;
          this.sizeField = confirmation.size;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("Confirmations cannot be loaded.", reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getIssueConfirmations().then(confirmations => !confirmations.find(confirmation => confirmation.id != this.id && confirmation.type == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateIssueConfirmation(this.id, this.nameField, this.colorField, this.sizeField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The confirmation has been updated."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-228
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-228"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The confirmation cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.editing = false;
  }
}
