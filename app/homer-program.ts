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
export class Component implements ng.OnInit {

  id:string;

  projectId:string;

  heading:string;

  breadcrumbs:libAdminlteWrapper.LabeledLink[];

  title:string;

  fields:libAdminlteFields.Field[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("program");
    this.projectId = routeParams.get("project");
    this.heading = `Homer Program ${this.id} (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new libAdminlteWrapper.LabeledLink("User", ["Projects"]),
      new libAdminlteWrapper.LabeledLink("Projects", ["Projects"]),
      new libAdminlteWrapper.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new libAdminlteWrapper.LabeledLink("Homer Programs", ["Project", {project: this.projectId}]),
      new libAdminlteWrapper.LabeledLink(`Homer Program ${this.id}`, ["HomerProgram", {project: this.projectId, program: this.id}])
    ];
    this.title = "Homer Program Updating";
    this.fields = [
      new libAdminlteFields.Field("Name:", "Loading..."),
      new libAdminlteFields.Field("Description:", "Loading..."),
      new libAdminlteFields.Field("Code:", `{"blocks":{}}`, true, [], false, true)
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getHomerProgram(this.id)
        .then((program) => {
          this.events.send(program);
          this.fields[0].model = program.programName;
          this.fields[1].model = program.programDescription;
          this.fields[2].model = program.program;
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onSubmit():void {
    "use strict";

    this.backEnd.updateHomerProgram(this.id, this.fields[0].model, this.fields[1].model, this.fields[2].model, this.projectId)
        .then((message) => {
          this.events.send(message);
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCancel():void {
    "use strict";

    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
