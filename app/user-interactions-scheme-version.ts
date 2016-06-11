/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiFieldInteractionsScheme from "./lib-becki/field-interactions-scheme";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/user-interactions-scheme-version.html",
  directives: [libBeckiFieldInteractionsScheme.Component, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

  id:string;

  schemeId:string;

  name:string;

  schemeName:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  description:string;

  showGroups:boolean;

  groups:libBackEnd.ApplicationGroup[];

  scheme:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("version");
    this.schemeId = routeParams.get("scheme");
    this.name = "Loading...";
    this.schemeName = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Schemes of Interactions", ["UserInteractions"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserInteractionsScheme", {scheme: this.schemeId}]),
      new libBeckiLayout.LabeledLink("Versions", ["UserInteractionsScheme", {scheme: this.schemeId}]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserInteractionsSchemeVersion", {scheme: this.schemeId, version: this.id}])
    ];
    this.description = "Loading...";
    this.showGroups = false;
    this.scheme = `{"blocks":{}}`;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getInteractionsScheme(this.schemeId)
        .then(scheme => {
          return Promise.all<any>([
              scheme,
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
              this.backEnd.getProject(scheme.project_id)
          ]);
        })
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let project:libBackEnd.Project;
          [scheme, project] = result;
          let version = scheme.versionObjects.find(version => version.id == this.id);
          if (!version) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error(`version ${this.id} not found in scheme ${scheme.name}`));
          }
          if (version.files_id.length != 1) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the scheme version does not have only one file"));
          }
          return Promise.all<any>([
            version,
            scheme,
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            Promise.all(project.m_projects_id.map(id => this.backEnd.getApplicationGroup(id))),
            this.backEnd.getFile(version.files_id[0])
          ]);
        })
        .then(result => {
          let version:libBackEnd.Version;
          let scheme:libBackEnd.InteractionsScheme;
          let groups:libBackEnd.ApplicationGroup[];
          let file:libBackEnd.BackEndFile;
          [version, scheme, groups, file] = result;
          this.name = version.version_name;
          this.schemeName = scheme.name;
          this.breadcrumbs[3].label = scheme.name;
          this.breadcrumbs[5].label = version.version_name;
          this.description = version.version_description;
          this.showGroups = groups.length > 1 || (groups.length == 1 && !groups[0].m_programs.length);
          this.groups = groups.filter(group => group.b_progam_connected_version_id && group.b_progam_connected_version_id == this.id);
          this.scheme = file.content;
        })
        .catch(reason => {
          //TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-218
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-218"));
          this.notifications.current.push(new libBeckiNotifications.Danger(`The scheme ${this.schemeId} cannot be loaded.`, reason));
        });
  }
}
