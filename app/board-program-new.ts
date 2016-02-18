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
import * as fieldCode from "./field-code";
import * as libBackEnd from "./lib-back-end";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
import * as wrapper from "./wrapper";

class Selectable<T> {

  model:T;

  selected:boolean;

  constructor(model:T) {
    "use strict";

    this.model = model;
    this.selected = false;
  }
}

@ng.Component({
  templateUrl: "app/board-program-new.html",
  directives: [
    customValidator.Directive,
    fieldCode.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES,
    wrapper.Component
  ]
})
export class Component implements ng.OnInit {

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  libraries:Selectable<libBackEnd.Library>[];

  groups:Selectable<libBackEnd.LibraryGroup>[];

  nameField:string;

  descriptionField:string;

  codeField:string;

  progress:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.projectId = routeParams.get("project");
    this.heading = `New Program (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("User", ["Projects"]),
      new wrapper.LabeledLink("Projects", ["Projects"]),
      new wrapper.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("Board Programs", ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("New Program", ["NewBoardProgram", {project: this.projectId}])
    ];
    this.nameField = "";
    this.descriptionField = "";
    this.codeField = "";
    this.progress = 0;
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 2;
    this.backEnd.getLibraries()
        .then(libraries => this.libraries = libraries.map(library => new Selectable(library)))
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Libraries cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getLibraryGroups()
        .then(groups => this.groups = groups.map(group => new Selectable(group)))
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Library groups cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    return () => {
      this.progress += 1;
      // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
      return this.backEnd.getProject(this.projectId)
          .then(project => {
            return this.backEnd.request<libBackEnd.BoardProgram[]>("GET", project.c_programs);
          })
          .then(programs => {
            this.progress -= 1;
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-77
            return !programs.find(program => program.programName == this.nameField);
          })
          .catch(reason => {
            this.progress -= 1;
            return Promise.reject(reason);
          });
    };
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    let libraries = this.libraries.filter(selectable => selectable.selected).map(selectable => ({libraryId: selectable.model.id, libraryVersion: selectable.model.lastVersion.toString()}));
    let groups = this.groups.filter(selectable => selectable.selected).map(selectable => ({groupId: selectable.model.id, libraryVersion: selectable.model.lastVersion.toString()}));
    this.backEnd.createBoardProgram(this.nameField, this.descriptionField, libraries, groups, this.codeField, this.projectId)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The program has been created."));
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The program cannot be created: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
