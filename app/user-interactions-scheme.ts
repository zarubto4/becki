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

import * as _ from "underscore";
import * as ng from "angular2/angular2";
import * as ngRouter from "angular2/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldInteractionsScheme from "./lib-becki/field-interactions-scheme";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ng.Component({
  templateUrl: "app/user-interactions-scheme.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldInteractionsScheme.Component,
    libBeckiLayout.Component,
    libPatternFlyListView.Component,
    ng.FORM_DIRECTIVES,
    ng.CORE_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  showHistory:boolean;

  editing:boolean;

  editScheme:boolean;

  project:string;

  nameField:string;

  descriptionField:string;

  description:string;

  versionNameField:string;

  versionName:string;

  versionDescriptionField:string;

  versionDescription:string;

  showApplicationGroups:boolean;

  versionApplicationGroupField:string;

  applicationGroups:libBackEnd.ApplicationGroup[];

  versionApplicationGroups:libBackEnd.ApplicationGroup[];

  versionSchemeField:string;

  versionScheme:string;

  addVersion:boolean;

  versions:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
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
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.versionNameField = "";
    this.versionName = "Loading...";
    this.versionDescriptionField = "";
    this.versionDescription = "Loading...";
    this.showApplicationGroups = false;
    this.versionApplicationGroupField = "";
    this.versionSchemeField = `{"blocks":{}}`;
    this.versionScheme = `{"blocks":{}}`;
    this.addVersion = false;
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    Promise.all<any>([
          this.backEnd.getInteractionsScheme(this.id),
          this.backEnd.getProjects()
        ])
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let projects:libBackEnd.Project[];
          [scheme, projects] = result;
          if (!scheme.versionObjects.length) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the scheme has no version"));
          }
          let lastVersion = _.max(scheme.versionObjects, version => version.date_of_create);
          if (lastVersion.files_id.length != 1) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the scheme version does not have only one file"));
          }
          let project = projects.find(project => project.id == scheme.project_id);
          return Promise.all<any>([
            scheme,
            projects,
            lastVersion,
            Promise.all(project.m_projects_id.map(id => this.backEnd.getApplicationGroup(id))),
            this.backEnd.getFile(lastVersion.files_id[0])
          ]);
        })
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let projects:libBackEnd.Project[];
          let version:libBackEnd.Version;
          let versionFile:libBackEnd.BackEndFile;
          [scheme, projects, version, this.applicationGroups, versionFile] = result;
          this.name = scheme.name;
          this.breadcrumbs[3].label = scheme.name;
          this.editScheme = scheme.edit_permission;
          this.project = projects.length > 1 ? projects.find(project => project.id == scheme.project_id).project_name : null;
          this.nameField = scheme.name;
          this.descriptionField = scheme.program_description;
          this.description = scheme.program_description;
          this.versionNameField = version.version_name;
          this.versionName = version.version_name;
          this.versionDescriptionField = version.version_description;
          this.versionDescription = version.version_description;
          this.showApplicationGroups = this.applicationGroups.length > 1 || (this.applicationGroups.length == 1 && !this.applicationGroups[0].m_programs.length);
          this.versionApplicationGroups = this.applicationGroups.filter(group => group.b_progam_connected_version_id && group.b_progam_connected_version_id == version.id);
          if (this.versionApplicationGroups.length) {
            this.versionApplicationGroupField = this.versionApplicationGroups[0].id;
          }
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-195
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-195"));
          this.versionSchemeField = versionFile.fileContent;
          this.versionScheme = versionFile.fileContent;
          this.addVersion = scheme.update_permission;
          this.versions = scheme.versionObjects.map(version => new libPatternFlyListView.Item(version.id, version.version_name, version.version_description, ["UserInteractionsSchemeVersion", {scheme: this.id, version: version.id}], false));
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
        .then(projects => Promise.all([].concat(...projects.map(project => project.b_programs_id)).map(id => this.backEnd.getInteractionsScheme(id))))
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
    return () => this.backEnd.getInteractionsScheme(this.id).then(scheme => !scheme.versionObjects.find(version => version.version_name == this.versionNameField));
  }

  onVersionSubmit():void {
    "use strict";

    this.backEnd.addVersionToInteractionsScheme(this.versionNameField, this.versionDescriptionField, this.versionSchemeField, this.id)
        .then(version => {
          return this.versionApplicationGroupField ? this.backEnd.addApplicationGroupToInteractionsScheme(this.versionApplicationGroupField, version.id, false) : null;
        })
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The version has been created."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        });
  }
}
