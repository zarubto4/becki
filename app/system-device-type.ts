/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ng from "angular2/angular2";
import * as ngRouter from "angular2/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/system-device-type.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  type:libBackEnd.DeviceType;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  producers:libBackEnd.Producer[];

  processors:libBackEnd.Processor[];

  nameField:string;

  producerField:string;

  processorField:string;

  descriptionField:string;

  description:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.id = routeParams.get("type");
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["System"]),
      new libBeckiLayout.LabeledLink("Device Types", ["System"]),
      new libBeckiLayout.LabeledLink("Loading...", ["SystemDeviceType", {type: this.id}])
    ];
    this.editing = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    this.backEnd.getDeviceType(this.id)
        .then(type => {
          this.type = type;
          this.breadcrumbs[3].label = type.name;
          this.nameField = type.name;
          this.producerField = type.producer_id;
          this.processorField = type.processor_id;
          this.descriptionField = type.description;
          this.description = type.description;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The type ${this.id} cannot be loaded.`, reason));
        });
    this.backEnd.getProducers()
        .then(producers => this.producers = producers)
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Producers cannot be loaded.", reason)));
    this.backEnd.getProcessors()
        .then(processors => this.processors = processors)
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Processors cannot be loaded.", reason)));
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getDeviceTypes().then(types => !types.find(type => type.id != this.id && type.name == this.nameField));
  }

  getProducer():libBackEnd.Producer {
    "use strict";

    return this.type && this.producers && this.producers.length ? this.producers.find(producer => producer.id == this.type.producer_id) : null;
  }

  getProcessor():libBackEnd.Processor {
    "use strict";

    return this.type && this.processors && this.processors.length ? this.processors.find(processor => processor.id == this.type.processor_id) : null;
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateDeviceType(this.id, this.nameField, this.producerField, this.processorField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The type has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The type cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }
}
