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

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldCode from "./lib-becki/field-code";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/device-program-version-new.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiFieldCode.Component, libBeckiLayout.Component, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  programId:string;

  projectId:string;

  heading:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  codeField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.programId = routeParams.get("program");
    this.projectId = routeParams.get("project");
    this.heading = `New Version (Program ${this.programId})`;
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", ["Projects"]),
      new libBeckiLayout.LabeledLink("Projects", ["Projects"]),
      new libBeckiLayout.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new libBeckiLayout.LabeledLink("Device Programs", ["Project", {project: this.projectId}]),
      new libBeckiLayout.LabeledLink(`Program ${this.programId}`, ["DeviceProgram", {project: this.projectId, program: this.programId}]),
      new libBeckiLayout.LabeledLink("Versions", ["DeviceProgram", {project: this.projectId, program: this.programId}]),
      new libBeckiLayout.LabeledLink("New Version", ["NewDeviceProgramVersion", {project: this.projectId, program: this.programId}])
    ];
    this.nameField = "";
    this.descriptionField = "";
    this.codeField = "";
    this.backEnd = backEnd;
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
    return () => this.backEnd.getDeviceProgram(this.programId).then(program => !program.version_objects.find(version => version.version_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.addVersionToDeviceProgram(this.nameField, this.descriptionField, this.codeField, this.programId)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The version has been created."));
          this.router.navigate(["DeviceProgram", {project: this.projectId, program: this.programId}]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["DeviceProgram", {project: this.projectId, program: this.programId}]);
  }
}
