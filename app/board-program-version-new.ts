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
import * as fieldCode from "./field-code";
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";

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
  templateUrl: "app/board-program-version-new.html",
  directives: [fieldCode.Component, layout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  programId:string;

  projectId:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  libraries:Selectable<libBackEnd.Library>[];

  groups:Selectable<libBackEnd.LibraryGroup>[];

  numberField:number;

  nameField:string;

  descriptionField:string;

  codeField:string;

  progress:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.programId = routeParams.get("program");
    this.projectId = routeParams.get("project");
    this.heading = `New Version (Program ${this.programId})`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", ["Projects"]),
      new layout.LabeledLink("Projects", ["Projects"]),
      new layout.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new layout.LabeledLink("Board Programs", ["Project", {project: this.projectId}]),
      new layout.LabeledLink(`Program ${this.programId}`, ["BoardProgram", {
        project: this.projectId,
        program: this.programId
      }]),
      new layout.LabeledLink("Versions", ["BoardProgram", {
        project: this.projectId,
        program: this.programId
      }]),
      new layout.LabeledLink("New Version", ["NewBoardProgramVersion", {
        project: this.projectId,
        program: this.programId
      }])
    ];
    this.numberField = 1.01;
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

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    let libraries = this.libraries.filter(selectable => selectable.selected).map(selectable => ({libraryId: selectable.model.id, libraryVersion: selectable.model.lastVersion.toString()}));
    let groups = this.groups.filter(selectable => selectable.selected).map(selectable => ({groupId: selectable.model.id, libraryVersion: selectable.model.lastVersion.toString()}));
    this.backEnd.createBoardProgramVersion(this.programId, this.numberField.toString(), this.nameField, this.descriptionField, libraries, groups, this.codeField)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The version has been created."));
          this.router.navigate(["BoardProgram", {project: this.projectId, program: this.programId}]);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The version cannot be created: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["BoardProgram", {project: this.projectId, program: this.programId}]);
  }
}
