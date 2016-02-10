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

class Selectable {

  model:libBackEnd.LibraryGroup;

  selected:boolean;

  constructor(model:libBackEnd.LibraryGroup, selected:boolean) {
    "use strict";

    this.model = model;
    this.selected = selected;
  }
}

@ng.Component({
  templateUrl: "app/processor.html",
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  groups:Selectable[];

  nameField:string;

  codeField:string;

  descriptionField:string;

  speedField:number;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("processor");
    this.heading = `Processor ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Processors", ["Devices"]),
      new wrapper.LabeledLink(`Processor ${this.id}`, ["Processor", {processor: this.id}])
    ];
    this.nameField = "Loading...";
    this.codeField = "Loading...";
    this.descriptionField = "Loading...";
    this.speedField = 0;
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    Promise.all<any>([
          this.backEnd.getProcessor(this.id),
          this.backEnd.getLibraryGroups()
        ])
        .then(result => {
          this.events.send(result);
          let processor:libBackEnd.Processor;
          let groups:libBackEnd.LibraryGroup[];
          [processor, groups] = result;
          return Promise.all<any>([
            processor,
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-67
            this.backEnd.request("GET", processor.description),
            this.backEnd.request("GET", processor.libraryGroups),
            groups
          ]);
        })
        .then(result => {
          this.events.send(result);
          let processor:libBackEnd.Processor;
          let processorGroups:libBackEnd.LibraryGroup[];
          let groups:libBackEnd.LibraryGroup[];
          [processor, this.descriptionField, processorGroups, groups] = result;
          this.nameField = processor.processorName;
          this.codeField = processor.processorCode;
          this.speedField = processor.speed;
          this.groups = groups.map(group => new Selectable(group, processorGroups.find(processorGroup => group.id == processorGroup.id) != null));
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onSubmit():void {
    "use strict";

    let groups = this.groups.filter(selectable => selectable.selected).map(selectable => selectable.model.id);
    this.backEnd.updateProcessor(this.id, this.nameField, this.codeField, this.descriptionField, this.speedField, groups)
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
