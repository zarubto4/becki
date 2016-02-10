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
import * as fieldCode from "./field-code";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/standalone-program-new.html",
  directives: [fieldCode.Component, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component {

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  nameField:string;

  descriptionField:string;

  codeField:string;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.projectId = routeParams.get("project");
    this.heading = `New Program (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("User", ["Projects"]),
      new wrapper.LabeledLink("Projects", ["Projects"]),
      new wrapper.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("Standalone Programs", ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("New Program", ["NewStandaloneProgram", {project: this.projectId}])
    ];
    this.nameField = "";
    this.descriptionField = "";
    this.codeField = "";
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onSubmit():void {
    "use strict";

    this.backEnd.createIndependentProgram(this.nameField, this.descriptionField, this.codeField)
        .then((message) => {
          this.events.send(message);
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCancelClick():void {
    "use strict";

    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
