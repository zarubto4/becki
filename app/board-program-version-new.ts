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
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/board-program-version-new.html",
  directives: [customValidator.Directive, fieldCode.Component, layout.Component, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  programId:string;

  projectId:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  codeField:string;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
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
    this.nameField = "";
    this.descriptionField = "";
    this.codeField = "";
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getBoardProgram(this.programId).then(program => !program.version_objects.find(version => version.version_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.addVersionToBoardProgram(this.nameField, this.descriptionField, this.codeField, this.programId)
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The version has been created."));
          this.router.navigate(["BoardProgram", {project: this.projectId, program: this.programId}]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-143
          this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-143"));
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The version cannot be created: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["BoardProgram", {project: this.projectId, program: this.programId}]);
  }
}
