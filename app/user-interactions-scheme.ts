/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as _ from "underscore";
import * as ngCommmon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldInteractionsScheme from "./lib-becki/field-interactions-scheme";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ngCore.Component({
  templateUrl: "app/user-interactions-scheme.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldInteractionsScheme.Component,
    libBeckiLayout.Component,
    libPatternFlyListView.Component,
    ngCommmon.FORM_DIRECTIVES,
    ngCommmon.CORE_DIRECTIVES
  ]
})
export class Component implements ngCore.OnInit {

  id:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  showHistory:boolean;

  editing:boolean;

  editScheme:boolean;

  addVersion:boolean;

  project:string;

  nameField:string;

  descriptionField:string;

  description:string;

  versionNameField:string;

  versionName:string;

  versionDescriptionField:string;

  versionDescription:string;

  versionDeviceField:string;

  devices:libBackEnd.Device[];

  deviceTypes:libBackEnd.DeviceType[];

  versionDeviceProgramField:string;

  devicePrograms:libBackEnd.DeviceProgram[];

  showApplicationGroups:boolean;

  versionApplicationGroupField:string;

  applicationGroups:libBackEnd.ApplicationGroup[];

  versionApplicationGroups:libBackEnd.ApplicationGroup[];

  versionSchemeField:string;

  versionScheme:string;

  versions:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.id = routeParams.get("scheme");
    this.name = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Schemes of Interactions", ["UserInteractions"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserInteractionsScheme", {scheme: this.id}])
    ];
    this.showHistory = false;
    this.editing = false;
    this.editScheme = false;
    this.addVersion = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.versionNameField = "";
    this.versionName = "Loading...";
    this.versionDescriptionField = "";
    this.versionDescription = "Loading...";
    this.versionDeviceField = "";
    this.versionDeviceProgramField = "";
    this.showApplicationGroups = false;
    this.versionApplicationGroupField = "";
    this.versionSchemeField = `{"blocks":{}}`;
    this.versionScheme = `{"blocks":{}}`;
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    Promise.all<any>([
          // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
          this.backEnd.getInteractionsScheme(this.id),
          this.backEnd.getProjects()
        ])
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let projects:libBackEnd.Project[];
          [scheme, projects] = result;
          let project = projects.find(project => project.id == scheme.project_id);
          return Promise.all<any>([
            scheme,
            projects,
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            Promise.all(project.boards_id.map(id => this.backEnd.getDevice(id))),
            this.backEnd.getDeviceTypes(),
            Promise.all(project.c_programs_id.map(id => this.backEnd.getDeviceProgram(id))),
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            Promise.all(project.m_projects_id.map(id => this.backEnd.getApplicationGroup(id)))
          ]);
        })
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let projects:libBackEnd.Project[];
          let applicationGroups:libBackEnd.ApplicationGroup[];
          [scheme, projects, this.devices, this.deviceTypes, this.devicePrograms, applicationGroups] = result;
          if (!scheme.program_versions.length) {
            throw new Error("the scheme has no version");
          }
          let lastVersion = _.max(scheme.program_versions, version => version.version_Object.date_of_create);
          this.name = scheme.name;
          this.breadcrumbs[3].label = scheme.name;
          this.editScheme = scheme.edit_permission;
          this.addVersion = scheme.update_permission;
          this.project = projects.length > 1 ? projects.find(project => project.id == scheme.project_id).project_name : null;
          this.nameField = scheme.name;
          this.descriptionField = scheme.program_description;
          this.description = scheme.program_description;
          this.versionNameField = lastVersion.version_Object.version_name;
          this.versionName = lastVersion.version_Object.version_name;
          this.versionDescriptionField = lastVersion.version_Object.version_description;
          this.versionDescription = lastVersion.version_Object.version_description;
          this.showApplicationGroups = applicationGroups.length > 1 || (applicationGroups.length == 1 && !applicationGroups[0].m_programs.length);
          this.versionApplicationGroups = applicationGroups.filter(group => group.b_progam_connected_version_id && group.b_progam_connected_version_id == lastVersion.version_Object.id);
          if (this.versionApplicationGroups.length) {
            this.versionApplicationGroupField = this.versionApplicationGroups[0].id;
          }
          this.applicationGroups = applicationGroups.filter(group => group.update_permission);
          this.versionSchemeField = lastVersion.program;
          this.versionScheme = lastVersion.program;
          this.versions = scheme.program_versions.map(version => new libPatternFlyListView.Item(version.version_Object.id, version.version_Object.version_name, version.version_Object.version_description, ["UserInteractionsSchemeVersion", {scheme: this.id, version: version.version_Object.id}], false));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The scheme ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  onDetailsClick():void {
    "use strict";

    this.showHistory = false;
  }

  onHistoryClick():void {
    "use strict";

    this.showHistory = true;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjects()
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        .then(projects => Promise.all<libBackEnd.InteractionsScheme>([].concat(...projects.map(project => project.b_programs_id)).map(id => this.backEnd.getInteractionsScheme(id))))
        .then(schemes => !schemes.find(scheme => scheme.id != this.id && scheme.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateInteractionsScheme(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The scheme has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.editing = false;
  }

  validateVersionNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return () => this.backEnd.getInteractionsScheme(this.id).then(scheme => !scheme.program_versions.find(version => version.version_Object.version_name == this.versionNameField));
  }

  getProgramsForVersionDevice():libBackEnd.DeviceProgram[] {
    "use strict";

    if (!this.versionDeviceField) {
      return [];
    }

    let device = this.devices.find(device => device.id == this.versionDeviceField);
    let type = this.deviceTypes.find(type => type.id == device.type_of_board_id);
    return this.devicePrograms.filter(program => program.type_of_board_id == type.id);
  }

  onVersionSubmit():void {
    "use strict";

    this.backEnd.addVersionToInteractionsScheme(this.versionNameField, this.versionDescriptionField, this.versionSchemeField, [], {board_id: this.versionDeviceField, c_program_version_id: this.versionDeviceProgramField}, this.id)
        .then(version => {
          return this.versionApplicationGroupField ? this.backEnd.addApplicationGroupToInteractionsScheme(this.versionApplicationGroupField, version.version_Object.id, false) : null;
        })
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The version has been created."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-284
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-284"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        });
  }
}
