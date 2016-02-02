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
import * as form from "./form";
import * as libBootstrapFieldSelect from "./lib-bootstrap/field-select";
import * as libBootstrapFields from "./lib-bootstrap/fields";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/wrapper-form.html",
  directives: [form.Component, wrapper.Component]
})
export class Component implements ng.OnInit {

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  fields:libBootstrapFields.Field[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.heading = "New Board Type";
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Boards", ["Devices"]),
      new wrapper.LabeledLink("Types", ["Devices"]),
      new wrapper.LabeledLink("New Type", ["NewBoardType"])
    ];
    this.fields = [
      new libBootstrapFields.Field("Name", ""),
      new libBootstrapFields.Field("Producer name", "", "select", "glyphicon-list"),
      new libBootstrapFields.Field("Processor name", "", "select", "glyphicon-dashboard"),
      new libBootstrapFields.Field("Description", "")
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getProducers()
        .then((producers) => {
          this.events.send(producers);
          this.fields[1].options = producers.map(producer => new libBootstrapFieldSelect.Option(producer.name, producer.id));
        })
        .catch((reason) => {
          this.events.send(reason);
        });
    this.backEnd.getProcessors()
        .then((processors) => {
          this.events.send(processors);
          this.fields[2].options = processors.map(processor => new libBootstrapFieldSelect.Option(processor.processorName, processor.id));
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onFieldChange():void {
    "use strict";
  }

  onSubmit():void {
    "use strict";

    this.backEnd.createBoardType(this.fields[0].model, this.fields[1].model, this.fields[2].model, this.fields[3].model)
        .then((message) => {
          this.events.send(message);
          this.router.navigate(["Devices"]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCancel():void {
    "use strict";

    this.router.navigate(["Devices"]);
  }
}
