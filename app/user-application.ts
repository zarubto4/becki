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
import * as libBeckiFieldApplication from "./lib-becki/field-application";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/user-application.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldApplication.Component,
    libBeckiLayout.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  showProject:boolean;

  project:libBackEnd.Project;

  showGroup:boolean;

  group:string;

  nameField:string;

  descriptionField:string;

  description:string;

  device:libBackEnd.ApplicationDevice;

  codeField:string;

  code:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("application");
    this.name = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Applications", ["UserApplications"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserApplication", {application: this.id}])
    ];
    this.editing = false;
    this.showProject = false;
    this.showGroup = false;
    this.group = "Loading...";
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.device = null;
    this.codeField = "{}";
    this.code = "{}";
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

    this.editing = false;
    this.backEnd.getApplication(this.id)
        .then(application => {
          return Promise.all<any>([
            application,
            this.backEnd.request("GET", application.m_project)
          ]);
        })
        .then(result => {
          let application:libBackEnd.Application;
          let group:libBackEnd.ApplicationGroup;
          [application, group] = result;
          return Promise.all<any>([
            application,
            this.backEnd.request("GET", group.project),
            group
          ]);
        })
        .then(result => {
          let application:libBackEnd.Application;
          let project:libBackEnd.Project;
          let group:libBackEnd.ApplicationGroup;
          [application, project, group] = result;
          return Promise.all<any>([
            application,
            this.backEnd.getProjects(),
            project,
            this.backEnd.getProjectApplicationGroups(project.id),
            group,
            this.backEnd.request("GET", application.screen_size_type)
          ]);
        })
        .then(result => {
          let application:libBackEnd.Application;
          let projects:libBackEnd.Project[];
          let groups:libBackEnd.ApplicationGroup[];
          let group:libBackEnd.ApplicationGroup;
          let device:libBackEnd.ApplicationDevice;
          [application, projects, this.project, groups, group, device] = result;
          this.name = application.program_name;
          this.breadcrumbs[3].label = application.program_name;
          this.showProject = projects.length > 1;
          this.showGroup = groups.length > 1;
          this.group = group.program_name;
          this.nameField = application.program_name;
          this.descriptionField = application.program_description;
          this.description = application.program_description;
          if (!this.device) {
            this.device = device;
          }
          this.codeField = application.m_code;
          this.code = application.m_code;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The application ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getApplications().then(applications => !applications.find(application => application.id != this.id && application.program_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateApplication(this.id, this.nameField, this.descriptionField, this.device.id, this.codeField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The application has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The application cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.editing = false;
  }
}
