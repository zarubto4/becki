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

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

class SelectableItem extends libPatternFlyListView.Item {

  selected:boolean;

  constructor(id:string, name:string, description:string, link:any[] = null) {
    "use strict";

    super(id, name, description, link);
    this.selected = false;
  }
}

@ng.Component({
  templateUrl: "app/project.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiLayout.Component,
    libPatternFlyListView.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  collaborators:libPatternFlyListView.Item[];

  addDeviceProgram:boolean;

  devicePrograms:libPatternFlyListView.Item[];

  addStandaloneProgram:boolean;

  standalonePrograms:libPatternFlyListView.Item[];

  devices:SelectableItem[];

  deviceUploadingProgramField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("project");
    this.heading = `Project ${this.id}`;
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", ["Projects"]),
      new libBeckiLayout.LabeledLink("Projects", ["Projects"]),
      new libBeckiLayout.LabeledLink(`Project ${this.id}`, ["Project", {project: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.addDeviceProgram = false;
    this.addStandaloneProgram = false;
    this.deviceUploadingProgramField = "";
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

    this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(permissions => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-192
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-192"));
          let hasPermission = libBackEnd.containsPermissions(permissions, ["project.owner", "Project_Editor"]);
          if (!hasPermission) {
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view collaborators."));
          }
          return Promise.all<any>([
            this.backEnd.getProject(this.id),
            hasPermission ? this.backEnd.getProjectOwners(this.id) : [],
            hasPermission,
            this.backEnd.getProjectDevicePrograms(this.id),
            this.backEnd.getProjectDevices(this.id),
            this.backEnd.getProjectStandaloneProgramCategories(this.id)
          ]);
        })
        .then(result => {
          let project:libBackEnd.Project;
          let collaborators:libBackEnd.User[];
          let hasPermission:boolean;
          let devicePrograms:libBackEnd.DeviceProgram[];
          let devices:libBackEnd.Device[];
          let categories:libBackEnd.StandaloneProgramCategory[];
          [project, collaborators, hasPermission, devicePrograms, devices, categories] = result;
          this.nameField = project.project_name;
          this.descriptionField = project.project_description;
          this.collaborators = collaborators.map(collaborator => new libPatternFlyListView.Item(collaborator.id, libBackEnd.composeUserString(collaborator), null));
          this.addDeviceProgram = hasPermission;
          if (hasPermission) {
            this.devicePrograms = devicePrograms.map(program => new libPatternFlyListView.Item(program.id, program.program_name, program.program_description, hasPermission ? ["DeviceProgram", {project: this.id, program: program.id}] : undefined, hasPermission));
          } else {
            this.devicePrograms = [];
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view device programs."));
          }
          if (hasPermission) {
            this.devices = devices.map(device => new SelectableItem(device.id, device.id, device.isActive ? "active" : "inactive"));
          } else {
            this.devices = [];
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view devices."));
          }
          this.addStandaloneProgram = hasPermission;
          if (hasPermission) {
            this.standalonePrograms = [].concat(...categories.map(category => category.blockoBlocks.map(program => new libPatternFlyListView.Item(program.id, program.name, program.general_description, hasPermission ? ["StandaloneProgram", {project: this.id, program: program.id}] : undefined, hasPermission))));
          } else {
            this.standalonePrograms = [];
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view standalone programs."));
          }
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The project ${this.id} cannot be loaded.`, reason));
        });
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(permissions => {
          if (!libBackEnd.containsPermissions(permissions, ["project.owner", "Project_Editor"])) {
            return Promise.reject('You are not allowed to list other schemes.');
          }
        })
        .then(() => this.backEnd.getProjects())
        .then(projects => !projects.find(project => project.id != this.id && project.project_name == this.nameField));
  }

  onUpdatingSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateProject(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The project has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The project cannot be updated.", reason));
        });
  }

  onCollaboratorAddClick():void {
    "use strict";

    this.router.navigate(["NewProjectCollaborator", {project: this.id}]);
  }

  onCollaboratorRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.removeCollaboratorsFromProject([id], this.id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The collaborator has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The collaborator cannot be removed.", reason));
        });
  }

  onDeviceProgramAddClick():void {
    "use strict";

    this.router.navigate(["NewDeviceProgram", {project: this.id}]);
  }

  onDeviceProgramRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteDeviceProgram(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The program cannot be removed.", reason));
        });
  }

  onStandaloneProgramAddClick():void {
    "use strict";

    this.router.navigate(["NewStandaloneProgram", {project: this.id}]);
  }

  onStandaloneProgramRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteStandaloneProgram(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The program cannot be removed.", reason));
        });
  }

  onDeviceUploadingSubmit():void {
    "use strict";

    this.notifications.shift();
    let devices = this.devices.filter(selectable => selectable.selected).map(selectable => selectable.id);
    Promise.all(devices.map(id => this.backEnd.addProgramToDevice(this.deviceUploadingProgramField, id)))
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The program has been uploaded."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-128
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-128"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The program cannot be uploaded.", reason));
        });
  }
}
