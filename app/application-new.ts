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

import * as backEnd from "./back-end";
import * as becki from "./index";
import * as customValidator from "./custom-validator";
import * as fieldApplication from "./field-application";
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

function getAdvancedField(field:string, options:string[]):string {
  "use strict";

  if (field) {
    return field;
  } else if (options.length == 1) {
    return options[0];
  } else {
    return null;
  }
}

@ng.Component({
  templateUrl: "app/application-new.html",
  directives: [
    customValidator.Directive,
    fieldApplication.Component,
    layout.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

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

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  get allDevices():libBackEnd.ApplicationDevice[] {
    "use strict";

    return [].concat(this.devices, this.projectDevices);
  }

  constructor(backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("New Application", ["NewApplication"])
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
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getProjects()
        .then(projects => {
          this.projects = projects;
          this.loadFromProject();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`Projects cannot be loaded: ${reason}`));
        });
    this.backEnd.getApplicationDevices()
        .then(devices => this.devices = devices)
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Target devices cannot be loaded: ${reason}`)));
  }

  getProject():string {
    "use strict";

    return getAdvancedField(this.projectField, this.projects.map(project => project.id));
  }

  getGroup():string {
    "use strict";

    return getAdvancedField(this.groupField, this.groups.map(group => group.id));
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
      this.backEnd.getProjectApplicationGroups(this.getProject())
          .then(groups => this.groups = groups)
          .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Application groups cannot be loaded: ${reason}`)));
      this.backEnd.getProjectApplicationDevices(this.getProject())
          .then(devices => this.projectDevices = devices)
          .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Target devices cannot be loaded: ${reason}`)));
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
            this.getProject() || this.backEnd.createProject("Default", "An automatically created project. It can be edited or removed like any other project.").then(project => {
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
          this.notifications.next.push(new libPatternFlyNotifications.Success("The application has been created."));
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TG-1
          this.notifications.next.push(new libPatternFlyNotifications.Warning("issue/TG-1"));
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The application cannot be created: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Devices"]);
  }
}
