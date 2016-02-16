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
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/board-program.html",
  directives: [libBootstrapPanelList.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  nameField:string;

  descriptionField:string;

  versions:libBootstrapPanelList.Item[];

  progress:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
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
    this.progress = 0;
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.progress += 1;
    this.backEnd.getBoardProgram(this.id)
        .then(program => {
          this.nameField = program.programName;
          this.descriptionField = program.programDescription;
          this.versions = program.versions.map(version => new libBootstrapPanelList.Item(version.id, version.version.toString(), version.versionName, ["BoardProgramVersion", {project: this.projectId, program: this.id, version: version.id}]));
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The program ${this.id} cannot be loaded: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-73
    this.backEnd.updateBoardProgram(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The program has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The cannot be updated: ${reason}`));
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

  onVersionAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewBoardProgramVersion", {project: this.projectId, program: this.id}]);
  }

  onVersionsRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    Promise.all(ids.map(id => this.backEnd.deleteBoardProgramVersion(id, this.id)))
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The versions have been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The versions cannot be updated: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }
}
