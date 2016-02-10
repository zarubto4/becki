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
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/board-program.html",
  directives: [libBootstrapPanelList.Component, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  nameField:string;

  descriptionField:string;

  versions:libBootstrapPanelList.Item[];

  newVersionLink:any[];

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
      new wrapper.LabeledLink("Board Programs", ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink(`Program ${this.id}`, ["BoardProgram", {project: this.projectId, program: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.newVersionLink = ["NewBoardProgramVersion", {project: this.projectId, program: this.id}];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.refresh();
  }

  refresh():void {
    "use strict";

    this.backEnd.getBoardProgram(this.id)
        .then(program => {
          this.events.send(program);
          this.nameField = program.programName;
          this.descriptionField = program.programDescription;
          this.versions = program.versions.map(version => new libBootstrapPanelList.Item(version.id, version.version.toString(), version.versionName));
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onSubmit():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-73
    this.backEnd.updateBoardProgram(this.id, this.nameField, this.descriptionField)
        .then(program => {
          this.events.send(program);
          this.refresh();
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onCancelClick():void {
    "use strict";

    this.router.navigate(["Project", {project: this.projectId}]);
  }

  getVersionLink():(version:libBootstrapPanelList.Item)=>any[] {
    "use strict";

    return version => ["BoardProgramVersion", {project: this.projectId, program: this.id, version: version.id}];
  }
}
