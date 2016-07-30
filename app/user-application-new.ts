/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBecki from "./lib-becki/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldApplication from "./lib-becki/field-application";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/user-application-new.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldApplication.Component,
    libBeckiLayout.Component,
    ngCommon.CORE_DIRECTIVES
  ]
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  projectField:string;

  projects:libBackEnd.Project[];

  nameField:string;

  groupField:string;

  groups:libBackEnd.ApplicationGroup[];

  descriptionField:string;

  deviceField:string;

  devices:libBackEnd.ApplicationDevice[];

  projectDevices:libBackEnd.ApplicationDevice[];

  selected:boolean;

  codeField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  get allDevices():libBackEnd.ApplicationDevice[] {
    "use strict";

    return [].concat(this.devices, this.projectDevices);
  }

  constructor(@ngCore.Inject("home") home:string, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("New Application", ["/user/application/new"])
    ];
    this.projectField = "";
    this.groupField = "";
    this.nameField = "";
    this.descriptionField = "";
    this.deviceField = "";
    this.devices = [];
    this.projectDevices = [];
    this.selected = false;
    this.codeField = "{}";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getProjects()
        .then(projects => {
          this.projects = projects.filter(project => project.m_projects_id.length > 0 || project.update_permission);
          this.loadFromProject();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("Projects cannot be loaded.", reason));
        });
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    this.backEnd.getApplicationDevices()
        .then(devices => this.devices = devices.public_types)
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Target devices cannot be loaded.", reason)));
  }

  getProject():string {
    "use strict";

    return libBecki.getAdvancedField(this.projectField, this.projects.map(project => project.id));
  }

  getGroup():string {
    "use strict";

    return libBecki.getAdvancedField(this.groupField, this.groups.map(group => group.id));
  }

  getDevice():libBackEnd.ApplicationDevice {
    "use strict";

    return this.deviceField ? this.allDevices.find(device => device.id == this.deviceField) : null;
  }

  loadFromProject():void {
    "use strict";

    this.groupField = "";
    this.groups = [];
    this.deviceField = "";
    this.projectDevices = [];
    if (this.getProject()) {
      // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
      this.backEnd.getProject(this.getProject())
          .then(project => {
            return Promise.all<any>([
              // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
              Promise.all(project.m_projects_id.map(id => this.backEnd.getApplicationGroup(id))),
              // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
              Promise.all(project.screen_size_types_id.map(id => this.backEnd.getApplicationDevice(id)))
            ]);
          })
          .then(result => {
            let groups:libBackEnd.ApplicationGroup[];
            [groups, this.projectDevices] = result;
            this.groups = groups;
          })
          .catch(reason => {
            this.notifications.current.push(new libBeckiNotifications.Danger(`Application groups/devices cannot be loaded: ${reason}`));
          });
    }
  }

  onProjectChange():void {
    "use strict";

    this.loadFromProject();
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getApplications().then(applications => !applications.find(application => application.program_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    if (!this.selected) {
      this.selected = true;
      return;
    }

    this.notifications.shift();
    Promise.resolve(
            this.getProject() || this.backEnd.createDefaultProject().then(project => {
              this.projects = [project];
              this.projectField = project.id;
              return project.id;
            })
        )
        .then(project => {
          return this.getGroup() || this.backEnd.createApplicationGroup("Default", "An automatically created group. It can be edited or removed like any other group.", project).then(group => {
                this.groups = [group];
                this.groupField = group.id;
                return group.id;
              });
        })
        .then(group => {
          return this.backEnd.createApplication(this.nameField, this.descriptionField, this.deviceField, this.codeField, group);
        })
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The application has been created."));
          this.router.navigate(["/user/applications"]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-302
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-302"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The application cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["/user/applications"]);
  }
}
