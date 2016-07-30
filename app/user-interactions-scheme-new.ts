/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBecki from "./lib-becki/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldInteractionsScheme from "./lib-becki/field-interactions-scheme";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/user-interactions-scheme-new.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldInteractionsScheme.Component,
    libBeckiLayout.Component,
    ngCommon.CORE_DIRECTIVES
  ]
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  projectField:string;

  projects:libBackEnd.Project[];

  nameField:string;

  descriptionField:string;

  deviceField:string;

  devices:libBackEnd.Device[];

  deviceTypes:libBackEnd.DeviceType[];

  deviceProgramField:string;

  devicePrograms:libBackEnd.DeviceProgram[];

  showGroups:boolean;

  groupField:string;

  groups:libBackEnd.ApplicationGroup[];

  schemeField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:string, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("New Scheme of Interactions", ["/user/interactions/scheme/new"])
    ];
    this.projectField = "";
    this.nameField = "";
    this.descriptionField = "";
    this.deviceField = "";
    this.deviceProgramField = "";
    this.showGroups = false;
    this.groupField = "";
    this.schemeField = `{"blocks":{}}`;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    Promise.all<any>([
          this.backEnd.getProjects(),
          this.backEnd.getDeviceTypes()
        ])
        .then(result => {
          let projects:libBackEnd.Project[];
          [projects, this.deviceTypes] = result;
          this.projects = projects.filter(project => project.update_permission);
          this.loadFromProject();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("Projects cannot be loaded.", reason));
        });
  }

  getProject():string {
    "use strict";

    return libBecki.getAdvancedField(this.projectField, this.projects.map(project => project.id));
  }

  loadFromProject():void {
    "use strict";

    this.devices = [];
    this.devicePrograms = [];
    this.showGroups = false;
    this.groups = [];
    if (this.getProject()) {
      // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
      this.backEnd.getProject(this.getProject())
          .then(project => {
            return Promise.all<any>([
              // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
              Promise.all(project.boards_id.map(id => this.backEnd.getDevice(id))),
              Promise.all(project.c_programs_id.map(id => this.backEnd.getDeviceProgram(id))),
              // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
              Promise.all(project.m_projects_id.map(id => this.backEnd.getApplicationGroup(id)))
            ]);
          })
          .then(result => {
            let groups:libBackEnd.ApplicationGroup[];
            [this.devices, this.devicePrograms, groups] = result;
            this.showGroups = groups.length > 1 || (groups.length == 1 && !groups[0].m_programs.length);
            this.groups = groups.filter(group => group.update_permission);
          })
          .catch(reason => {
            this.notifications.current.push(new libBeckiNotifications.Danger("Application groups cannot be loaded.", reason));
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
    return () => this.backEnd.getProjects()
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        .then(projects => Promise.all<libBackEnd.InteractionsScheme>([].concat(...projects.map(project => project.b_programs_id)).map(id => this.backEnd.getInteractionsScheme(id))))
        .then(schemes => !schemes.find(scheme => scheme.name == this.nameField));
  }

  getProgramsForDevice():libBackEnd.DeviceProgram[] {
    "use strict";

    if (!this.deviceField) {
      return [];
    }

    let device = this.devices.find(device => device.id == this.deviceField);
    let type = this.deviceTypes.find(type => type.id == device.type_of_board_id);
    return this.devicePrograms.filter(program => program.type_of_board_id == type.id);
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    Promise.resolve(
            this.getProject() || this.backEnd.createDefaultProject().then(project => {
              this.projects = [project];
              this.projectField = project.id;
              return project.id;
            })
        )
        .then(project => {
          return this.backEnd.createInteractionsScheme(this.nameField, this.descriptionField, project);
        })
        .then(scheme => {
          return this.backEnd.addVersionToInteractionsScheme("Initial version", "", this.schemeField, [], {board_id: this.deviceField, c_program_version_id: this.deviceProgramField}, scheme.id);
        })
        .then(version => {
          return this.groupField ? this.backEnd.addApplicationGroupToInteractionsScheme(this.groupField, version.version_Object.id, false) : null;
        })
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The scheme have been created."));
          this.router.navigate(["/user/interactions/schemes"]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-284
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-284"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["/user/interactions/schemes"]);
  }
}
