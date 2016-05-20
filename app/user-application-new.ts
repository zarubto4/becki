/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

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
    ngCommon.CORE_DIRECTIVES,
    ngCommon.FORM_DIRECTIVES
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

  constructor(@ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("New Application", ["NewUserApplication"])
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
    this.backEnd.getApplicationDevices()
        .then(devices => this.devices = devices.public_types)
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-219
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-219"));
          this.notifications.current.push(new libBeckiNotifications.Danger("Target devices cannot be loaded.", reason));
        });
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
      this.backEnd.getProject(this.getProject())
          .then(project => {
            return Promise.all<any>([
              Promise.all(project.m_projects_id.map(id => this.backEnd.getApplicationGroup(id))),
              Promise.all(project.screen_size_types_id.map(id => this.backEnd.getApplicationDevice(id)))
            ]);
          })
          .then(result => {
            let groups:libBackEnd.ApplicationGroup[];
            [groups, this.projectDevices] = result;
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-220
            this.groups = groups.filter(group => group.update_permission);
          })
          .catch(reason => {
            //TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-218
            this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-218"));
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-219
            this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-219"));
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-221
            this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-221"));
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
          this.router.navigate(["UserApplications"]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-220
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-220"));
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-222
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-222"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The application cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["UserApplications"]);
  }
}
