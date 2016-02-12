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
  templateUrl: "app/standalone-program.html",
  directives: [fieldCode.Component, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  descriptionField:string;

  codeField:string;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("program");
    this.projectId = routeParams.get("project");
    this.heading = `Program ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("User", ["Projects"]),
      new wrapper.LabeledLink("Projects", ["Projects"]),
      new wrapper.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("Standalone Programs", ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink(`Program ${this.id}`, ["StandaloneProgram", {project: this.projectId, program: this.id}])
    ];
    this.descriptionField = "Loading...";
    this.codeField = "Loading...";
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-83
    this.backEnd.getStandaloneProgram(this.id)
        .then(program => {
          this.events.send(program);
          return Promise.all<any>([
              // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-82
              this.backEnd.request("GET", program.generalDescription),
              // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-83
              this.backEnd.request("GET", program.logicJson)
          ]);
        })
        .then(result => {
          this.events.send(result);
          let code:string;
          [this.descriptionField, code] = result;
          this.codeField = JSON.parse(code);
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onSubmit():void {
    "use strict";

    this.backEnd.updateStandaloneProgram(this.id, this.descriptionField, this.codeField)
        .then(message => {
          this.events.send(message);
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onCancelClick():void {
    "use strict";

    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
