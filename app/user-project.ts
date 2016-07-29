/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ngCore.Component({
  templateUrl: "app/user-project.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiLayout.Component,
    libPatternFlyListView.Component,
    ngCommon.CORE_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ngCore.OnInit {

  id:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  description:string;

  editProject:boolean;

  addIntoProject:boolean;

  addCollaborator:boolean;

  tab:string;


  collaborators:libPatternFlyListView.Item[];
  devices:libPatternFlyListView.Item[];
  schemes:libPatternFlyListView.Item[];
  applications:libPatternFlyListView.Item[];


  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("project");
    this.name = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Projects", ["UserProjects"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserProject", {project: this.id}])
    ];
    this.tab="details";
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.editProject = false;
    this.addCollaborator = false;
    this.addIntoProject = false;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  tabPermissionCheck():boolean{
    "use strict";

    switch(this.tab) {
      case "details":
        return this.editProject;
        


      case "devices":
        return this.addIntoProject;
        


      case "schemes":
        return this.addIntoProject;
        


      case "applications":
        return this.addIntoProject;
        


      case "collaborators":
        return this.addCollaborator;
        
    }
  }
  
  onTabClick(tab:string):void {
    "use strict";
    this.tab = tab;
  }

  refresh():void {
    "use strict";
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    this.backEnd.getProject(this.id)
        .then(project => {
          return Promise.all<any>([
            project,
            Promise.all(project.owners_id.map(id => this.backEnd.getUser(id))),
            Promise.all(project.c_programs_id.map(id => this.backEnd.getDeviceProgram(id))),
            Promise.all(project.b_programs_id.map(id => this.backEnd.getInteractionsScheme(id))),
            Promise.all(project.m_projects_id.map(id => this.backEnd.getApplicationGroup(id)))
          ]);
        })
        .then(result => {
          let project:libBackEnd.Project;
          let collaborators:libBackEnd.User[];
          let Devices:libBackEnd.DeviceProgram[];
          let Schemes:libBackEnd.InteractionsScheme[];
          let Applications:libBackEnd.Application[];
          [project, collaborators,Devices,Schemes,Applications] = result;
          this.name = project.project_name;
          this.breadcrumbs[3].label = project.project_name;
          this.nameField = project.project_name;
          this.descriptionField = project.project_description;
          this.description = project.project_description;
          this.editProject = project.edit_permission;
          this.addIntoProject = project.update_permission;
          this.addCollaborator = project.share_permission;
          this.collaborators = collaborators.map(collaborator => new libPatternFlyListView.Item(collaborator.id, libBackEnd.composeUserString(collaborator, true), null, undefined, project.unshare_permission));
          this.devices = Devices.map(device => new libPatternFlyListView.Item(device.id,device.program_name,device.program_description,["UserDeviceProgram", {program:device.id}],device.delete_permission));
          this.schemes = Schemes.map(scheme => new libPatternFlyListView.Item(scheme.id,scheme.name,scheme.program_description,["UserInteractionsScheme", {scheme:scheme.id}],scheme.delete_permission));
          this.applications = Applications.map(application => new libPatternFlyListView.Item(application.id,application.program_name,application.program_description,["UserApplication", {application:application.id}],application.delete_permission));


        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The project ${this.id} cannot be loaded.`, reason));
        });
  }

  onRemoveDevicesClick(id:string):void{
    "use strict";
    this.notifications.shift();
    this.backEnd.deleteDeviceProgram(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The c_program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The c_program cannot be removed.", reason));
        });
  }

  onRemoveSchemesClick(id:string):void{
    "use strict";
    this.notifications.shift();
    this.backEnd.deleteInteractionsScheme(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The b_program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The b_program cannot be removed.", reason));
        });
  }

  onRemoveApplicationsClick(id:string):void{
    "use strict";
    this.notifications.shift();
    this.backEnd.deleteApplicationGroup(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The M_project has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The M_project cannot be removed.", reason));
        });
  }

  onAddClick():void{
    switch (this.tab){
    case "details":
      this.router.navigate(["UserProjectEdit", {project: this.id}]);
    break;

    case "devices":
      this.router.navigate(["NewUserDeviceProgram"]);
      break;

    case "schemes":
      this.router.navigate(["NewUserInteractionsScheme"]);
      break;

    case "applications":
      this.router.navigate(["NewUserApplicationGroup"]);
      break;

    case "collaborators":
      this.router.navigate(["NewUserProjectCollaborator", {project: this.id}]);
      break;

  }
}

  onCollaboratorAddClick():void {
    "use strict";

    this.router.navigate(["NewUserProjectCollaborator", {project: this.id}]);
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
}
