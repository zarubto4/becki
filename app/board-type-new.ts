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
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
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

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
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
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.getProducers()
        .then(producers => this.producers = producers)
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Producers cannot be loaded: ${reason}`)));
    this.backEnd.getProcessors()
        .then(processors => this.processors = processors)
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Processors cannot be loaded: ${reason}`)));
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.createBoardType(this.nameField, this.producerField, this.processorField, this.descriptionField)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The type has been created."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The type cannot be created: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Devices"]);
  }
}
