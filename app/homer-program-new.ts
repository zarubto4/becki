/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
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
import * as fieldHomerProgram from "./field-homer-program";
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

class SelectableApplicationGroup {

  model:libBackEnd.ApplicationGroup;

  selected:boolean;

  constructor(model:libBackEnd.ApplicationGroup, selected = false) {
    "use strict";

    this.model = model;
    this.selected = selected;
  }
}

@ng.Component({
  templateUrl: "app/homer-program-new.html",
  directives: [
    customValidator.Directive,
    fieldHomerProgram.Component,
    layout.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  projectId:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  groups:SelectableApplicationGroup[];

  codeField:string;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.projectId = routeParams.get("project");
    this.heading = `New Program (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", ["Projects"]),
      new layout.LabeledLink("Projects", ["Projects"]),
      new layout.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new layout.LabeledLink("Homer Programs", ["Project", {project: this.projectId}]),
      new layout.LabeledLink("New Program", ["NewHomerProgram", {project: this.projectId}])
    ];
    this.nameField = "";
    this.descriptionField = "";
    this.codeField = `{"blocks":{}}`;
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getProjectApplicationGroups(this.projectId)
        .then(groups => this.groups = groups.map(group => new SelectableApplicationGroup(group)))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Application groups cannot be loaded: ${reason}`)));
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjectHomerPrograms(this.projectId).then(programs => !programs.find(program => program.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createHomerProgram(this.nameField, this.descriptionField, this.projectId)
        .then(program => {
          return Promise.all([
            program.b_program_id,
            this.backEnd.addVersionToHomerProgram("Initial version", "", this.codeField, program.b_program_id)
          ]);
        })
        .then(result => {
          let id = result[0];
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-163
          return this.backEnd.getHomerProgram(id);
        })
        .then(program => {
          if (program.versionObjects.length != 1) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the new program does not have only one version"));
          }
          return Promise.all(this.groups.filter(group => group.selected).map(group => this.backEnd.addApplicationGroupToHomerProgram(group.model.id, program.versionObjects[0].id, true)));
        })
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The program have been created."));
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch((reason) => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be created: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
