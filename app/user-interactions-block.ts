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
  templateUrl: "app/user-interactions-block.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES, ngCommon.FORM_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

  id:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  nameField:string;

  groupField:string;

  descriptionField:string;

  description:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.id = routeParams.get("block");
    this.name = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Interactions Blocks", ["UserInteractions"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserInteractionsBlock", {block: this.id}])
    ];
    this.editing = false;
    this.nameField = "Loading...";
    this.groupField = "";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
    //TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-235
    this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-235"));
  }

  refresh():void {
    "use strict";

    this.editing = false;
    this.backEnd.getInteractionsBlock(this.id)
        .then(block => {
          this.name = block.name;
          this.breadcrumbs[3].label = block.name;
          this.nameField = block.name;
          this.descriptionField = block.general_description;
          this.description = block.general_description;
          this.groupField = block.type_of_block_id;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The block ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getInteractionsBlockGroups().then(groups => ![].concat(...groups.map(group => group.blockoBlocks)).find(block => block.id != this.id && block.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateInteractionsBlock(this.id, this.nameField, this.descriptionField, this.groupField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The block has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The block cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.editing = false;
  }
}
