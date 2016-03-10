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
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/producer.html",
  directives: [customValidator.Directive, layout.Component, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("producer");
    this.heading = `Producer ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Producers", ["Devices"]),
      new layout.LabeledLink(`Producer ${this.id}`, ["Producer", {producer: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    Promise.all<any>([
          this.backEnd.getProducer(this.id),
          this.backEnd.getProducerDescription(this.id)
        ])
        .then(result => {
          let producer:libBackEnd.Producer;
          [producer, this.descriptionField] = result;
          this.nameField = producer.name;
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The producer ${this.id} cannot be loaded: ${reason}`));
        });
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProducers().then(producers => !producers.find(producer => producer.id != this.id && producer.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateProducer(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The producer has been updated."));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The producer cannot be updated: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Devices"]);
  }
}
