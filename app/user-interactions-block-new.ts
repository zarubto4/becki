/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldCode from "./lib-becki/field-code";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/user-interactions-block-new.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldCode.Component,
    libBeckiLayout.Component,
    ngCommon.CORE_DIRECTIVES
  ]
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  nameField:string;

  groupField:string;

  groups:libBackEnd.InteractionsBlockGroup[];

  descriptionField:string;

  codeField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:string, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("New Interactions Block", ["/user/interactions/block/new"])
    ];
    this.nameField = "";
    this.groupField = "";
    this.descriptionField = "";
    this.codeField = "";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getInteractionsBlockGroups()
        .then(groups => this.groups = groups.filter(group => group.update_permission))
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
          this.router.navigate(["/user/interactions/blocks"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The block cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["/user/interactions/blocks"]);
  }
}
