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
import * as libBeckiFieldCode from "./lib-becki/field-code";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/user-interactions-block-new.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldCode.Component,
    libBeckiLayout.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  nameField:string;

  groupField:string;

  groups:libBackEnd.InteractionsBlockGroup[];

  descriptionField:string;

  codeField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("New Interactions Block", ["NewUserInteractionsBlock"])
    ];
    this.nameField = "";
    this.groupField = "";
    this.descriptionField = "";
    this.codeField = "";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getInteractionsBlockGroups()
        .then(groups => this.groups = groups)
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Groups cannot be loaded.", reason)));
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getInteractionsBlockGroups().then(groups => ![].concat(...groups.map(group => group.blockoBlocks)).find(block => block.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createInteractionsBlock(this.nameField, this.groupField, this.descriptionField)
        .then(block => {
          return this.backEnd.addVersionToInteractionsBlock("Initial version", "An automatically created version.", this.codeField, block.id);
        })
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The block have been created."));
          this.router.navigate(["UserInteractions"]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-205
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-205"));
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-206
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-206"));
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-207
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-207"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The block cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["UserInteractions"]);
  }
}
