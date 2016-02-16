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
  templateUrl: "app/producer.html",
  directives: [ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  nameField:string;

  descriptionField:string;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("producer");
    this.heading = `Producer ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Producers", ["Devices"]),
      new wrapper.LabeledLink(`Producer ${this.id}`, ["Producer", {producer: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.getProducer(this.id)
        .then(producer => {
          return Promise.all<any>([
            producer,
            this.backEnd.request("GET", producer.description)
          ]);
        })
        .then(result => {
          let producer:libBackEnd.Producer;
          [producer, this.descriptionField] = result;
          this.nameField = producer.name;
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The producer ${this.id} cannot be loaded: ${reason}`));
        });
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    this.backEnd.updateProducer(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The producer cannot be updated."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The producer cannot be updated: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Devices"]);
  }
}
