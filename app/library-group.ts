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
  templateUrl: "app/library-group.html",
  directives: [ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  nameField:string;

  descriptionField:string;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("group");
    this.heading = `Library Group ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Libraries", ["Devices"]),
      new wrapper.LabeledLink("Groups", ["Devices"]),
      new wrapper.LabeledLink(`Group ${this.id}`, ["LibraryGroup", {group: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getLibraryGroup(this.id)
        .then(group => {
          this.events.send(group);
          this.nameField = group.groupName;
          this.descriptionField = group.description;
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onSubmit():void {
    "use strict";

    this.backEnd.updateLibraryGroup(this.id, this.nameField, this.descriptionField)
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
