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

@ng.Component({
  templateUrl: "app/homer-program.html",
  directives: [customValidator.Directive, fieldHomerProgram.Component, layout.Component, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  projectId:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  codeField:string;

  versionNameField:string;

  versionDescriptionField:string;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("program");
    this.projectId = routeParams.get("project");
    this.heading = `Program ${this.id} (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", ["Projects"]),
      new layout.LabeledLink("Projects", ["Projects"]),
      new layout.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new layout.LabeledLink("Homer Programs", ["Project", {project: this.projectId}]),
      new layout.LabeledLink(`Program ${this.id}`, ["HomerProgram", {
        project: this.projectId,
        program: this.id
      }])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getHomerProgram(this.id)
        .then(program => {
          if (!program.versionObjects) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the program has no version"));
          } else if (program.versionObjects.length > 1) {
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-164
            this.notifications.current.push(new libPatternFlyNotifications.Warning("issue/TYRION-164"));
          }
          return Promise.all<any>([
              program,
              this.backEnd.request("GET", program.versionObjects[0].allFiles)
          ]);
        })
        .then(result => {
          let program:libBackEnd.HomerProgram;
          let files:libBackEnd.File[];
          [program, files] = result;
          if (files.length != 1) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the program version does not have only one file"));
          }
          return Promise.all<any>([
              program,
              this.backEnd.request("GET", files[0].fileContent)
          ]);
        })
        .then(result => {
          let program:libBackEnd.HomerProgram;
          let file:libBackEnd.FileContent;
          [program, file] = result;
          this.nameField = program.name;
          this.descriptionField = program.program_description;
          this.codeField = file.content;
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program ${this.id} cannot be loaded: ${reason}`));
        });
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjectHomerPrograms(this.projectId).then(programs => !programs.find(program => program.b_program_id != this.id && program.name == this.nameField));
  }

  validateVersionNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getHomerProgram(this.id).then(program => !program.versionObjects.find(version => version.version_name == this.versionNameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateHomerProgram(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The program has been updated."));
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be updated: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Project", {project: this.projectId}]);
  }

  onCodeSubmit():void {
    "use strict";

    this.backEnd.addVersionToHomerProgram(this.versionNameField, this.versionDescriptionField, this.codeField, this.id)
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The version has been created."));
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The version cannot be created: ${reason}`));
        });
  }
}
