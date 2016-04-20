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

  editProject:boolean;

  addCollaborator:boolean;

  collaborators:libPatternFlyListView.Item[];

  addDeviceProgram:boolean;

  devicePrograms:libPatternFlyListView.Item[];

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
    this.editProject = false;
    this.addCollaborator = false;
    this.addDeviceProgram = false;
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

    this.backEnd.getProject(this.id)
        .then(project => {
          return Promise.all<any>([
            project,
            Promise.all(project.owners_id.map(id => this.backEnd.getUser(id))),
            Promise.all(project.c_programs_id.map(id => this.backEnd.getDeviceProgram(id))),
            Promise.all(project.type_of_blocks_id.map(id => this.backEnd.getStandaloneProgramCategory(id))),
            Promise.all(project.boards_id.map(id => this.backEnd.getDevice(id)))
          ]);
        })
        .then(result => {
          let project:libBackEnd.Project;
          let collaborators:libBackEnd.User[];
          let devicePrograms:libBackEnd.DeviceProgram[];
          let categories:libBackEnd.StandaloneProgramCategory[];
          let devices:libBackEnd.Device[];
          [project, collaborators, devicePrograms, categories, devices] = result;
          this.nameField = project.project_name;
          this.descriptionField = project.project_description;
          this.editProject = project.edit_permission;
          this.addCollaborator = project.share_permission;
          this.collaborators = collaborators.map(collaborator => new libPatternFlyListView.Item(collaborator.id, libBackEnd.composeUserString(collaborator), null, undefined, project.unshare_permission));
          this.addDeviceProgram = project.update_permission;
          this.devicePrograms = devicePrograms.map(program => new libPatternFlyListView.Item(program.id, program.program_name, program.program_description, ["DeviceProgram", {project: this.id, program: program.id}], program.delete_permission));
          this.standalonePrograms = [].concat(...categories.map(category => category.blockoBlocks.map(program => new libPatternFlyListView.Item(program.id, program.name, program.general_description, ["StandaloneProgram", {project: this.id, program: program.id}], program.delete_permission))));
          this.devices = devices.map(device => new SelectableItem(device.id, device.id, device.type_of_board.name));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The project ${this.id} cannot be loaded.`, reason));
        });
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjects().then(projects => !projects.find(project => project.id != this.id && project.project_name == this.nameField));
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
