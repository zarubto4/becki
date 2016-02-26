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
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapListGroup from "./lib-bootstrap/list-group";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/board-program.html",
  directives: [
    customValidator.Directive,
    layout.Component,
    libBootstrapListGroup.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  projectId:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  newVersionLink:any[];

  versions:libBootstrapListGroup.Item[];

  progress:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("program");
    this.projectId = routeParams.get("project");
    this.heading = `Program ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", ["Projects"]),
      new layout.LabeledLink("Projects", ["Projects"]),
      new layout.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new layout.LabeledLink("Board Programs", ["Project", {project: this.projectId}]),
      new layout.LabeledLink(`Program ${this.id}`, ["BoardProgram", {project: this.projectId, program: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.newVersionLink = ["NewBoardProgramVersion", {project: this.projectId, program: this.id}];
    this.progress = 0;
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.progress += 1;
    this.backEnd.getBoardProgram(this.id)
        .then(program => {
          this.nameField = program.programName;
          this.descriptionField = program.programDescription;
          this.versions = program.versions.map(version => new libBootstrapListGroup.Item(version.id, version.version.toString(), version.versionName, ["BoardProgramVersion", {project: this.projectId, program: this.id, version: version.id}]));
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program ${this.id} cannot be loaded: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
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
            return !programs.find(program => program.id != this.id && program.programName == this.nameField);
          })
          .catch(reason => {
            this.progress -= 1;
            return Promise.reject(reason);
          });
    };
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-73
    this.backEnd.updateBoardProgram(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The program has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The cannot be updated: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Project", {project: this.projectId}]);
  }

  onVersionRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.deleteBoardProgramVersion(id, this.id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The version has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The version cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }
}
