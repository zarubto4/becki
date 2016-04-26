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
  templateUrl: "app/system-device-type-new.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

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

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["Devices"]),
      new libBeckiLayout.LabeledLink("New Device Type", ["NewSystemDeviceType"])
    ];
    this.nameField = "";
    this.producerField = "";
    this.processorField = "";
    this.descriptionField = "";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getProducers()
        .then(producers => this.producers = producers)
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Producers cannot be loaded.", reason)));
    this.backEnd.getProcessors()
        .then(processors => this.processors = processors)
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Processors cannot be loaded.", reason)));
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getDeviceTypes().then(types => !types.find(type => type.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createDeviceType(this.nameField, this.producerField, this.processorField, this.descriptionField)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The type has been created."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-199
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-199"));
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-200
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-200"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The type cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Devices"]);
  }
}
