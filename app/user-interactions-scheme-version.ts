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
import * as fieldInteractionsScheme from "./field-interactions-scheme";
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/user-interactions-scheme-version.html",
  directives: [fieldInteractionsScheme.Component, layout.Component, ng.CORE_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  schemeId:string;

  name:string;

  schemeName:string;

  breadcrumbs:layout.LabeledLink[];

  description:string;

  showGroups:boolean;

  groups:libBackEnd.ApplicationGroup[];

  scheme:string;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("version");
    this.schemeId = routeParams.get("scheme");
    this.name = "Loading...";
    this.schemeName = "Loading...";
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", becki.HOME.link),
      new layout.LabeledLink("Schemes of Interactions", ["UserInteractions"]),
      new layout.LabeledLink("Loading...", ["UserInteractionsScheme", {scheme: this.schemeId}]),
      new layout.LabeledLink("Versions", ["UserInteractionsScheme", {scheme: this.schemeId}]),
      new layout.LabeledLink("Loading...", ["UserInteractionsSchemeVersion", {scheme: this.schemeId, version: this.id}])
    ];
    this.description = "Loading...";
    this.showGroups = false;
    this.scheme = `{"blocks":{}}`;
    this.backEnd = backEndService;
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
              this.backEnd.request("GET", scheme.project)
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
          return Promise.all<any>([
            version,
            scheme,
            this.backEnd.getProjectApplicationGroups(project.id),
            this.backEnd.request("GET", version.allFiles)
          ]);
        })
        .then(result => {
          let version:libBackEnd.Version;
          let scheme:libBackEnd.InteractionsScheme;
          let groups:libBackEnd.ApplicationGroup[];
          let files:libBackEnd.File[];
          [version, scheme, groups, files] = result;
          if (files.length != 1) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the scheme version does not have only one file"));
          }
          return Promise.all<any>([
            version,
            scheme,
            Promise.all(groups.map(group => Promise.all<any>([group, group.b_progam_connected_version ? this.backEnd.request("GET", group.b_progam_connected_version) : null]))),
            this.backEnd.request("GET", files[0].fileContent)
          ]);
        })
        .then(result => {
          let version:libBackEnd.Version;
          let scheme:libBackEnd.InteractionsScheme;
          let groups:[libBackEnd.ApplicationGroup, libBackEnd.Version][];
          let file:libBackEnd.FileContent;
          [version, scheme, groups, file] = result;
          this.name = version.version_name;
          this.schemeName = scheme.name;
          this.breadcrumbs[3].label = scheme.name;
          this.breadcrumbs[5].label = version.version_name;
          this.description = version.version_description;
          this.showGroups = groups.length > 1 || (groups.length == 1 && !groups[0][0].m_programs.length);
          this.groups = groups.filter(pair => pair[1] && pair[1].id == this.id).map(pair => pair[0]);
          this.scheme = file.content;
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The scheme ${this.schemeId} cannot be loaded: ${reason}`));
        });
  }
}
