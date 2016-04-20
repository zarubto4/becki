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

import * as _ from "underscore";
import * as ng from "angular2/angular2";
import * as ngRouter from "angular2/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldInteractionsScheme from "./lib-becki/field-interactions-scheme";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/user-interactions-scheme-version-new.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldInteractionsScheme.Component,
    libBeckiLayout.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  schemeId:string;

  schemeName:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  showGroups:boolean;

  groupField:string;

  groups:libBackEnd.ApplicationGroup[];

  schemeField:string;

  createVersion:boolean;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.schemeId = routeParams.get("scheme");
    this.schemeName = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Schemes of Interactions", ["UserInteractions"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserInteractionsScheme", {scheme: this.schemeId}]),
      new libBeckiLayout.LabeledLink("New Version", ["NewUserInteractionsSchemeVersion", {scheme: this.schemeId}])
    ];
    this.nameField = "";
    this.descriptionField = "";
    this.showGroups = false;
    this.groupField = "";
    this.schemeField = `{"blocks":{}}`;
    this.createVersion = false;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getInteractionsScheme(this.schemeId)
        .then(scheme => {
          return Promise.all<any>([
              scheme,
              this.backEnd.getProject(scheme.project_id)
          ]);
        })
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let project:libBackEnd.Project;
          [scheme, project] = result;
          if (!scheme.versionObjects.length) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the scheme has no version"));
          }
          let lastVersion = _.max(scheme.versionObjects, version => version.date_of_create);
          if (lastVersion.files_id.length != 1) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the scheme version does not have only one file"));
          }
          return Promise.all<any>([
            scheme,
            Promise.all(project.m_projects_id.map(id => this.backEnd.getApplicationGroup(id))),
            lastVersion,
            this.backEnd.getFile(lastVersion.files_id[0])
          ]);
        })
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let groups:libBackEnd.ApplicationGroup[];
          let lastVersion:libBackEnd.Version;
          let file:libBackEnd.BackEndFile;
          [scheme, groups, lastVersion, file] = result;
          this.schemeName = scheme.name;
          this.breadcrumbs[3].label = scheme.name;
          this.showGroups = groups.length > 1 || (groups.length == 1 && !groups[0].m_programs.length);
          let group = groups.find(group => group.b_progam_connected_version_id && group.b_progam_connected_version_id == lastVersion.id);
          if (group) {
            this.groupField = group.id;
          }
          this.groups = groups;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-195
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-195"));
          this.schemeField = file.fileContent;
          this.createVersion = scheme.update_permission;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The scheme ${this.schemeId} cannot be loaded.`, reason));
        });
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getInteractionsScheme(this.schemeId).then(scheme => !scheme.versionObjects.find(version => version.version_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.backEnd.addVersionToInteractionsScheme(this.nameField, this.descriptionField, this.schemeField, this.schemeId)
        .then(version => {
          return this.groupField ? this.backEnd.addApplicationGroupToInteractionsScheme(this.groupField, version.id, false) : null;
        })
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The version has been created."));
          this.router.navigate(["UserInteractionsScheme", {scheme: this.schemeId}]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The version cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["UserInteractionsScheme", {scheme: this.schemeId}]);
  }
}
