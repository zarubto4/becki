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
  templateUrl: "app/processor.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  nameField:string;

  codeField:string;

  descriptionField:string;

  speedField:number;

  editProcessor:boolean;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("processor");
    this.heading = `Processor ${this.id}`;
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("Processors", ["Devices"]),
      new libBeckiLayout.LabeledLink(`Processor ${this.id}`, ["Processor", {processor: this.id}])
    ];
    this.nameField = "Loading...";
    this.codeField = "Loading...";
    this.descriptionField = "Loading...";
    this.speedField = 0;
    this.editProcessor = false;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getProcessor(this.id)
        .then(processor => {
          this.nameField = processor.processor_name;
          this.codeField = processor.processor_code;
          this.descriptionField = processor.description;
          this.speedField = processor.speed;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The processor ${this.id} cannot be loaded.`, reason));
        });
    this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(permissions => this.editProcessor = libBackEnd.containsPermissions(permissions, ["project.edit"]))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger(`Permissions cannot be loaded.`, reason)));
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-192
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-192"));
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(permissions => {
          if (!libBackEnd.containsPermissions(permissions, ["processor.read"])) {
            return Promise.reject("You are not allowed to list other processors.");
          }
        })
        .then(() => this.backEnd.getProcessors())
        .then(processors => !processors.find(processor => processor.id != this.id && processor.processor_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateProcessor(this.id, this.nameField, this.codeField, this.descriptionField, this.speedField)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The processor has been updated."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The processor cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Devices"]);
  }
}
