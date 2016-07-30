/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as Rx from "rxjs";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldApplication from "./lib-becki/field-application";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/user-application.html",
  directives: [
    libBeckiCustomValidator.Directive, libBeckiFieldApplication.Component, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES
  ]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

  id:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  editApplication:boolean;

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

  activatedRoute:ngRouter.ActivatedRoute;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  routeParamsSubscription:Rx.Subscription;

  constructor(@ngCore.Inject("home") home:string, activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.name = "Loading...";
    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("Applications", ["/user/applications"])
    ];
    this.editing = false;
    this.editApplication = false;
    this.showProject = false;
    this.showGroup = false;
    this.group = "Loading...";
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.device = null;
    this.codeField = "{}";
    this.code = "{}";
    this.activatedRoute = activatedRoute;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = params["application"];
      this.refresh();
    });
  }

  ngOnDestroy():void {
    "use strict";

    this.routeParamsSubscription.unsubscribe();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    this.backEnd.getApplication(this.id)
        .then(application => {
          return Promise.all<any>([
            application,
            this.backEnd.getProjects(),
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            this.backEnd.getApplicationGroup(application.m_project_id),
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            this.backEnd.getApplicationDevice(application.screen_size_type_id)
          ]);
        })
        .then(result => {
          let application:libBackEnd.Application;
          let projects:libBackEnd.Project[];
          let group:libBackEnd.ApplicationGroup;
          let device:libBackEnd.ApplicationDevice;
          [application, projects, group, device] = result;
          this.name = application.program_name;
          this.breadcrumbs.push(new libBeckiLayout.LabeledLink(application.program_name, ["/user/applications", this.id]));
          this.editApplication = application.edit_permission;
          this.showProject = projects.length > 1;
          this.project = projects.find(project => project.id == group.project_id);
          this.showGroup = this.project.m_projects_id.length > 1;
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
