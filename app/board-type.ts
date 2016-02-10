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
  templateUrl: "app/board-type.html",
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  processors:libBackEnd.Processor[];

  nameField:string;

  processorField:string;

  descriptionField:string;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("type");
    this.heading = `Type ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Boards", ["Devices"]),
      new wrapper.LabeledLink("Types", ["Devices"]),
      new wrapper.LabeledLink(`Type ${this.id}`, ["BoardType", {type: this.id}])
    ];
    this.nameField = "Loading...";
    this.processorField = "Loading...";
    this.descriptionField = "Loading...";
    this.processorField = "";
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getProcessors()
        .then(processors => {
          this.events.send(processors);
          this.processors = processors;
          return this.backEnd.getBoardType(this.id);
        })
        .then(type => {
          this.events.send(type);
          return Promise.all<any>([
              type,
              this.backEnd.request("GET", type.procesor),
              // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-68
              this.backEnd.request("GET", type.description)
          ]);
        })
        .then(result => {
          this.events.send(result);
          let type:libBackEnd.BoardType;
          let processor:libBackEnd.Processor;
          [type, processor, this.descriptionField] = result;
          this.nameField = type.name;
          this.processorField = processor.id;
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onSubmit():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-69
    alert("issue/TYRION-69");
  }

  onCancelClick():void {
    "use strict";

    this.router.navigate(["Devices"]);
  }
}
