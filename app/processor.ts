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
import * as customValidator from "./custom-validator";
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
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
  directives: [customValidator.Directive, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
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

  progress:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
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
    this.progress = 0;
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    Promise.all<any>([
          this.backEnd.getProcessor(this.id),
          this.backEnd.getLibraryGroups()
        ])
        .then(result => {
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
          let processor:libBackEnd.Processor;
          let processorGroups:libBackEnd.LibraryGroup[];
          let groups:libBackEnd.LibraryGroup[];
          [processor, this.descriptionField, processorGroups, groups] = result;
          this.nameField = processor.processorName;
          this.codeField = processor.processorCode;
          this.speedField = processor.speed;
          this.groups = groups.map(group => new Selectable(group, processorGroups.find(processorGroup => group.id == processorGroup.id) !== undefined));
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The processor ${this.id} cannot be loaded: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    return () => {
      this.progress += 1;
      // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
      return this.backEnd.getProcessors()
          .then(processors => {
            this.progress -= 1;
            return !processors.find(processor => processor.id != this.id && processor.processorName == this.nameField);
          })
          .catch(reason => {
            this.progress -= 1;
            return Promise.reject(reason);
          });
    };
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    let groups = this.groups.filter(selectable => selectable.selected).map(selectable => selectable.model.id);
    this.backEnd.updateProcessor(this.id, this.nameField, this.codeField, this.descriptionField, this.speedField, groups)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The processor has been updated."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The processor cannot be updated: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Devices"]);
  }
}
