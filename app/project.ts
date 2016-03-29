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
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyListView from "./lib-patternfly/list-view";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

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
    customValidator.Directive,
    layout.Component,
    libPatternFlyListView.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  collaborators:libPatternFlyListView.Item[];

  devicePrograms:libPatternFlyListView.Item[];

  standalonePrograms:libPatternFlyListView.Item[];

  devices:SelectableItem[];

  deviceUploadingProgramField:string;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("project");
    this.heading = `Project ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", ["Projects"]),
      new layout.LabeledLink("Projects", ["Projects"]),
      new layout.LabeledLink(`Project ${this.id}`, ["Project", {project: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.deviceUploadingProgramField = "";
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

    Promise.all<any>([
          this.backEnd.getProject(this.id),
          this.backEnd.getProjectOwners(this.id),
          this.backEnd.getProjectDevicePrograms(this.id),
          this.backEnd.getProjectDevices(this.id),
          this.backEnd.getProjectStandaloneProgramCategories(this.id)
        ])
        .then(result => {
          let project:libBackEnd.Project;
          let collaborators:libBackEnd.Person[];
          let devicePrograms:libBackEnd.DeviceProgram[];
          let devices:libBackEnd.Device[];
          let categories:libBackEnd.StandaloneProgramCategory[];
          [project, collaborators, devicePrograms, devices, categories] = result;
          this.nameField = project.project_name;
          this.descriptionField = project.project_description;
          this.collaborators = collaborators.map(collaborator => new libPatternFlyListView.Item(collaborator.id, libBackEnd.composePersonString(collaborator), null));
          this.devicePrograms = devicePrograms.map(program => new libPatternFlyListView.Item(program.id, program.program_name, program.program_description, ["DeviceProgram", {project: this.id, program: program.id}]));
          this.devices = devices.map(device => new SelectableItem(device.id, device.id, device.isActive ? "active" : "inactive"));
          this.standalonePrograms = [].concat(...categories.map(category => category.blockoBlocks.map(program => new libPatternFlyListView.Item(program.id, program.name, program.general_description, ["StandaloneProgram", {project: this.id, program: program.id}]))));
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The project ${this.id} cannot be loaded: ${reason}`));
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
          this.notifications.current.push(new libPatternFlyNotifications.Success("The project has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The project cannot be updated: ${reason}`));
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
          this.notifications.current.push(new libPatternFlyNotifications.Success("The collaborator has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The collaborator cannot be removed: ${reason}`));
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
          this.notifications.current.push(new libPatternFlyNotifications.Success("The program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be removed: ${reason}`));
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
          this.notifications.current.push(new libPatternFlyNotifications.Success("The program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be removed: ${reason}`));
        });
  }

  onDeviceUploadingSubmit():void {
    "use strict";

    this.notifications.shift();
    let devices = this.devices.filter(selectable => selectable.selected).map(selectable => selectable.id);
    Promise.all(devices.map(id => this.backEnd.addProgramToDevice(this.deviceUploadingProgramField, id)))
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The program has been uploaded."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-128
          this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-128"));
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be uploaded: ${reason}`));
        });
  }
}
