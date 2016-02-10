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
import * as events from "./events";
import * as libBackEnd from "./lib-back-end/index";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/board-type-new.html",
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  breadcrumbs:wrapper.LabeledLink[];

  producers:libBackEnd.Producer[];

  processors:libBackEnd.Processor[];

  nameField:string;

  producerField:string;

  processorField:string;

  descriptionField:string;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Boards", ["Devices"]),
      new wrapper.LabeledLink("Types", ["Devices"]),
      new wrapper.LabeledLink("New Type", ["NewBoardType"])
    ];
    this.nameField = "";
    this.producerField = "";
    this.processorField = "";
    this.descriptionField = "";
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getProducers()
        .then((producers) => {
          this.events.send(producers);
          this.producers = producers;
        })
        .catch((reason) => {
          this.events.send(reason);
        });
    this.backEnd.getProcessors()
        .then((processors) => {
          this.events.send(processors);
          this.processors = processors;
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onSubmit():void {
    "use strict";

    this.backEnd.createBoardType(this.nameField, this.producerField, this.processorField, this.descriptionField)
        .then(message => {
          this.events.send(message);
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onCancelClick():void {
    "use strict";

    this.router.navigate(["Devices"]);
  }
}
