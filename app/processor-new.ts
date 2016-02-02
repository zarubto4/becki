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

    this.heading = "New Processor";
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Processors", ["Devices"]),
      new wrapper.LabeledLink("New Processor", ["NewProcessor"])
    ];
    this.fields = [
      new libBootstrapFields.Field("Model name", ""),
      new libBootstrapFields.Field("Model code", ""),
      new libBootstrapFields.Field("Description", ""),
      libBootstrapFields.Field.fromNumber("Speed", 0, "number", "glyphicon-dashboard"),
      new libBootstrapFields.Field("Groups of libraries", "", "select", "glyphicon-book", [], true)
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getLibraryGroups()
        .then((groups) => {
          this.events.send(groups);
          this.fields[4].options = groups.map(group => new libBootstrapFieldSelect.Option(group.groupName, group.id));
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

    // TODO: https://github.com/angular/angular/issues/4427
    let groups = this.fields[4].options.filter(option => option.selected).map(option => option.value);
    this.backEnd.createProcessor(this.fields[0].model, this.fields[1].model, this.fields[2].model, this.fields[3].getNumber(), groups)
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
