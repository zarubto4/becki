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
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ng.Component({
  templateUrl: "app/device-program.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiLayout.Component,
    libPatternFlyListView.Component,
    ng.FORM_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  projectId:string;

  heading:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  editProgram:boolean;

  versions:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("program");
    this.projectId = routeParams.get("project");
    this.heading = `Program ${this.id}`;
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", ["Projects"]),
      new libBeckiLayout.LabeledLink("Projects", ["Projects"]),
      new libBeckiLayout.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new libBeckiLayout.LabeledLink("Device Programs", ["Project", {project: this.projectId}]),
      new libBeckiLayout.LabeledLink(`Program ${this.id}`, ["DeviceProgram", {project: this.projectId, program: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.editProgram = false;
    this.backEnd = backEnd;
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

    Promise.all<any>([
          this.backEnd.getDeviceProgram(this.id),
          this.backEnd.getUserRolesAndPermissionsCurrent()
        ])
        .then(result => {
          let program: libBackEnd.DeviceProgram;
          let permissions: libBackEnd.RolesAndPermissions;
          [program, permissions] = result;
          this.nameField = program.program_name;
          this.descriptionField = program.program_description;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-192
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-192"));
          let hasPermission = libBackEnd.containsPermissions(permissions, ["project.owner", "Project_Editor"]);
          this.editProgram = hasPermission;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-126
          this.versions = program.version_objects.map(version => new libPatternFlyListView.Item(version.id, `${version.version_name} (issue/TYRION-126)`, version.version_description, undefined, hasPermission));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The program ${this.id} cannot be loaded.`, reason));
        });
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(permissions => {
          if (!libBackEnd.containsPermissions(permissions, ["project.owner", "Project_Editor"])) {
            return Promise.reject("You are not allowed to list other programs.");
          }
        })
        .then(() => this.backEnd.getDevicePrograms(this.projectId))
        .then(programs => !programs.find(program => program.id != this.id && program.program_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateDeviceProgram(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The program has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The program cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Project", {project: this.projectId}]);
  }

  onVersionAddClick():void {
    "use strict";

    this.router.navigate(["NewDeviceProgramVersion", {project: this.projectId, program: this.id}]);
  }

  onVersionRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.removeVersionFromDeviceProgram(id, this.id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The version has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be removed.", reason));
        });
  }
}
