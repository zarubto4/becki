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
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/board-program-version.html",
  directives: [ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  programId:string;

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  nameField:string;

  descriptionField:string;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("version");
    this.programId = routeParams.get("program");
    this.projectId = routeParams.get("project");
    this.heading = `Version ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("User", ["Projects"]),
      new wrapper.LabeledLink("Projects", ["Projects"]),
      new wrapper.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("Board Programs", ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink(`Program ${this.programId}`, ["BoardProgram", {project: this.projectId, program: this.programId}]),
      new wrapper.LabeledLink("Versions", ["BoardProgram", {project: this.projectId, program: this.programId}]),
      new wrapper.LabeledLink(`Version ${this.id}`, ["BoardProgramVersion", {project: this.projectId, program: this.programId, version: this.id}])
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
    this.backEnd.getBoardProgram(this.programId)
        .then(program => {
          let version = program.versions.find(version => version.id == this.id);
          if (!version) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject(new Error(`version ${this.id} of program ${this.programId} not found`));
          }
          this.nameField = version.versionName;
          this.descriptionField = version.versionDescription;
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The version ${this.id} of program ${this.programId} cannot be loaded: ${reason}`));
        });
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-76
    this.backEnd.updateBoardProgramVersion(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The version has been updated."));
          this.router.navigate(["BoardProgram", {project: this.projectId, program: this.programId}]);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The version cannot be updated: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["BoardProgram", {project: this.projectId, program: this.programId}]);
  }
}
