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
    this.heading = `New Device Program (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new libAdminlteWrapper.LabeledLink("User", ["Projects"]),
      new libAdminlteWrapper.LabeledLink("Projects", ["Projects"]),
      new libAdminlteWrapper.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new libAdminlteWrapper.LabeledLink("Device Programs", ["Project", {project: this.projectId}]),
      new libAdminlteWrapper.LabeledLink("New Device Program", ["NewDeviceProgram", {project: this.projectId}])
    ];
    this.title = "Device Program Creation";
    this.fields = [
      new libAdminlteFields.Field("Name:", ""),
      new libAdminlteFields.Field("Description:", ""),
      new libAdminlteFields.Field("Libraries:", ""),
      new libAdminlteFields.Field("Code:", "", "c")
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onSubmit():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-13
  }

  onCancel():void {
    "use strict";

    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
