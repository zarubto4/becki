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

    this.projectId = routeParams.get("project");
    this.heading = `New Homer Program (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new libAdminlteWrapper.LabeledLink("User", ["Projects"]),
      new libAdminlteWrapper.LabeledLink("Projects", ["Projects"]),
      new libAdminlteWrapper.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new libAdminlteWrapper.LabeledLink("Homer Programs", ["Project", {project: this.projectId}]),
      new libAdminlteWrapper.LabeledLink("New Homer Program", ["NewHomerProgram", {project: this.projectId}])
    ];
    this.title = "Homer Program Creation";
    this.fields = [
      new libAdminlteFields.Field("Name:", ""),
      new libAdminlteFields.Field("Description:", ""),
      new libAdminlteFields.Field("Code:", `{"blocks":{}}`, true, [], false, true)
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onSubmit():void {
    "use strict";

    this.backEnd.createHomerProgram(this.fields[0].model, this.fields[1].model, this.fields[2].model, this.projectId)
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
