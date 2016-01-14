/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
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
import * as libAdminlteFields from "./lib-adminlte/fields";
import * as libAdminlteWrapper from "./lib-adminlte/wrapper";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/lib-adminlte/wrapper-form.html",
  directives: [form.Component, wrapper.Component]
})
export class Component {

  heading:string;

  breadcrumbs:libAdminlteWrapper.LabeledLink[];

  title:string;

  fields:libAdminlteFields.Field[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.heading = "New Device";
    this.breadcrumbs = [
      becki.HOME,
      new libAdminlteWrapper.LabeledLink("Devices", ["Devices"]),
      new libAdminlteWrapper.LabeledLink("New Device", ["NewDevice"])
    ];
    this.title = "Device Registration";
    this.fields = [
      new libAdminlteFields.Field("ID:", ""),
      new libAdminlteFields.Field("Type:", "")
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onSubmit():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-33
    this.backEnd.createDevice(this.fields[0].model, this.fields[1].model)
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
