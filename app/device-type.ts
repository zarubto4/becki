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
  templateUrl: "app/device-type.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  producers:libBackEnd.Producer[];

  processors:libBackEnd.Processor[];

  nameField:string;

  producerField:string;

  processorField:string;

  descriptionField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("type");
    this.heading = `Type ${this.id}`;
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("Devices", ["Devices"]),
      new libBeckiLayout.LabeledLink("Types", ["Devices"]),
      new libBeckiLayout.LabeledLink(`Type ${this.id}`, ["DeviceType", {type: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getDeviceType(this.id)
        .then(type => {
          return Promise.all<any>([
            type,
            this.backEnd.request("GET", type.producer),
            this.backEnd.request("GET", type.processor)
          ]);
        })
        .then(result => {
          let type:libBackEnd.DeviceType;
          let producer:libBackEnd.Producer;
          let processor:libBackEnd.Processor;
          [type, producer, processor] = result;
          this.nameField = type.name;
          this.producerField = producer.id;
          this.processorField = processor.id;
          this.descriptionField = type.description;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The type ${this.id} cannot be loaded.`, reason));
        });
    this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(currentPermissions => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-192
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-192"));
          let viewProducers = libBackEnd.containsPermissions(currentPermissions, ["producer.edit"]);
          if (viewProducers) {
            this.backEnd.getProducers()
                .then(producers => this.producers = producers)
                .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Producers cannot be loaded.", reason)));
          } else {
            this.producers = [];
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view producers."));
          }
          let viewProcessors = libBackEnd.containsPermissions(currentPermissions, ["processor.read"]);
          if (viewProcessors) {
            this.backEnd.getProcessors()
                .then(processors => this.processors = processors)
                .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Processors cannot be loaded.", reason)));
          } else {
            this.processors = [];
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view processors."));
          }
        })
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger(`Permissions cannot be loaded.`, reason)));
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(permissions => {
          if (!libBackEnd.containsPermissions(permissions, ["type_of_board.read"])) {
            return Promise.reject("You are not allowed to list other types.");
          }
        })
        .then(() => this.backEnd.getDeviceTypes())
        .then(types => !types.find(type => type.id != this.id && type.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateDeviceType(this.id, this.nameField, this.producerField, this.processorField, this.descriptionField)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The type has been updated."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The type cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Devices"]);
  }
}
