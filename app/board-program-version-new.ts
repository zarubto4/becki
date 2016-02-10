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
import * as libBackEnd from "./lib-back-end";
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
  templateUrl: "app/board-program-version-new.html",
  directives: [fieldCode.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  programId:string;

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  libraries:Selectable<libBackEnd.Library>[];

  groups:Selectable<libBackEnd.LibraryGroup>[];

  numberField:string;

  nameField:string;

  descriptionField:string;

  codeField:string;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.programId = routeParams.get("program");
    this.projectId = routeParams.get("project");
    this.heading = `New Version (Program ${this.programId})`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("User", ["Projects"]),
      new wrapper.LabeledLink("Projects", ["Projects"]),
      new wrapper.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("Board Programs", ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink(`Program ${this.programId}`, ["BoardProgram", {project: this.projectId, program: this.programId}]),
      new wrapper.LabeledLink("Versions", ["BoardProgram", {project: this.projectId, program: this.programId}]),
      new wrapper.LabeledLink("New Version", ["NewBoardProgramVersion", {project: this.projectId, program: this.programId}])
    ];
    this.numberField = "";
    this.nameField = "";
    this.descriptionField = "";
    this.codeField = "";
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getLibraries()
        .then(libraries => {
          this.events.send(libraries);
          this.libraries = libraries.map(library => new Selectable(library));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getLibraryGroups()
        .then(groups => {
          this.events.send(groups);
          this.groups = groups.map(group => new Selectable(group));
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onSubmit():void {
    "use strict";

    let libraries = this.libraries.filter(selectable => selectable.selected).map(selectable => ({libraryId: selectable.model.id, libraryVersion: selectable.model.lastVersion.toString()}));
    let groups = this.groups.filter(selectable => selectable.selected).map(selectable => ({groupId: selectable.model.id, libraryVersion: selectable.model.lastVersion.toString()}));
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-74
    this.backEnd.createBoardProgramVersion(this.programId, this.numberField, this.nameField, this.descriptionField, libraries, groups, this.codeField)
        .then((message) => {
          this.events.send(message);
          this.router.navigate(["BoardProgram", {project: this.projectId, program: this.programId}]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCancelClick():void {
    "use strict";

    this.router.navigate(["BoardProgram", {project: this.projectId, program: this.programId}]);
  }
}
