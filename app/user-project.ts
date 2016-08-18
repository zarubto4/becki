/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as Rx from "rxjs";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";
import {Router} from "@angular/router";

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
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

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

  activatedRoute:ngRouter.ActivatedRoute;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  routeParamsSubscription:Rx.Subscription;

  constructor(activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:Router) {
    "use strict";

    this.name = "Loading...";
    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink("home", ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("Projects", ["/user/projects"])
    ];
    this.tab="details";
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.editProject = false;
    this.addCollaborator = false;
    this.addIntoProject = false;
    this.activatedRoute = activatedRoute;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = params["project"];
      this.refresh();
    });
  }

  ngOnDestroy():void {
    "use strict";

    this.routeParamsSubscription.unsubscribe();
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
            Promise.all(project.c_programs_id.map(id => this.backEnd.getCProgram(id))),
            Promise.all(project.b_programs_id.map(id => this.backEnd.getBProgram(id))),
            Promise.all(project.m_projects_id.map(id => this.backEnd.getMProject(id)))
          ]);
        })
        .then(result => {
          let project:libBackEnd.Project;
          let collaborators:libBackEnd.User[];
          let Devices:libBackEnd.CProgram[];
          let Schemes:libBackEnd.BProgram[];
          let Applications:libBackEnd.MProgram[];
          [project, collaborators,Devices,Schemes,Applications] = result;
          this.name = project.project_name;
          this.breadcrumbs.push(new libBeckiLayout.LabeledLink(project.project_name, ["/user/projects", this.id]));
          this.nameField = project.project_name;
          this.descriptionField = project.project_description;
          this.description = project.project_description;
          this.editProject = project.edit_permission;
          this.addIntoProject = project.update_permission;
          this.addCollaborator = project.share_permission;
          this.collaborators = collaborators.map(collaborator => new libPatternFlyListView.Item(collaborator.id, libBackEnd.composeUserString(collaborator, true), null, undefined, project.unshare_permission));
          this.devices = Devices.map(device => new libPatternFlyListView.Item(device.id,device.program_name,device.program_description,["/user/device/programs", device.id],device.delete_permission));
          this.schemes = Schemes.map(scheme => new libPatternFlyListView.Item(scheme.id,scheme.name,scheme.program_description,["/user/interactions/schemes", scheme.id],scheme.delete_permission));
          this.applications = Applications.map(application => new libPatternFlyListView.Item(application.id,application.program_name,application.program_description,["/user/applications", application.id],application.delete_permission));


        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The project ${this.id} cannot be loaded.`, reason));
        });
  }

  onRemoveDevicesClick(id:string):void{
    "use strict";
    this.notifications.shift();
    this.backEnd.deleteCProgram(id)
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
    this.backEnd.deleteBProgram(id)
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
    this.backEnd.deleteMProject(id)
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
      this.router.navigate(["/user/projects", this.id, "edit"]);
    break;

    case "devices":
      this.router.navigate(["/user/device/program/new"]);
      break;

    case "schemes":
      this.router.navigate(["/user/interactions/scheme/new"]);
      break;

    case "applications":
      this.router.navigate(["/user/application/group/new"]);
      break;

    case "collaborators":
      this.router.navigate(["/user/projects", this.id, "collaborator/new"]);
      break;

  }
}

  onCollaboratorAddClick():void {
    "use strict";

    this.router.navigate(["/user/projects", this.id, "collaborator/new"]);
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
