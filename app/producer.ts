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
  templateUrl: "app/producer.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  editProducer:boolean;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("producer");
    this.heading = `Producer ${this.id}`;
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("Producers", ["Devices"]),
      new libBeckiLayout.LabeledLink(`Producer ${this.id}`, ["Producer", {producer: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.editProducer = false;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    Promise.all<any>([
          this.backEnd.getProducer(this.id),
          this.backEnd.getProducerDescription(this.id)
        ])
        .then(result => {
          let producer:libBackEnd.Producer;
          [producer, this.descriptionField] = result;
          this.nameField = producer.name;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The producer ${this.id} cannot be loaded.`, reason));
        });
    this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(permissions => this.editProducer = libBackEnd.containsPermissions(permissions, ["producer.edit"]))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger(`Permissions cannot be loaded.`, reason)));
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-192
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-192"));
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(permissions => {
          if (!libBackEnd.containsPermissions(permissions, ["producer.edit"])) {
            return Promise.reject('You are not allowed to list other producers.');
          }
        })
        .then(() => this.backEnd.getProducers())
        .then(producers => !producers.find(producer => producer.id != this.id && producer.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateProducer(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The producer has been updated."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The producer cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Devices"]);
  }
}
