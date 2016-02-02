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
import * as libBootstrapFields from "./lib-bootstrap/fields";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/wrapper-form.html",
  directives: [form.Component, wrapper.Component]
})
export class Component {

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  fields:libBootstrapFields.Field[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.heading = "New Producer";
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Producers", ["Devices"]),
      new wrapper.LabeledLink("New Producer", ["NewProducer"])
    ];
    this.fields = [
      new libBootstrapFields.Field("Name", ""),
      new libBootstrapFields.Field("Description", "")
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onFieldChange():void {
    "use strict";
  }

  onSubmit():void {
    "use strict";

    this.backEnd.createProducer(this.fields[0].model, this.fields[1].model)
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
