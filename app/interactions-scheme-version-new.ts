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
import * as fieldInteractionsScheme from "./field-interactions-scheme";
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

class SelectableApplicationGroup {

  model:libBackEnd.ApplicationGroup;

  selected:boolean;

  select:boolean;

  constructor(model:libBackEnd.ApplicationGroup, selected = false) {
    "use strict";

    this.model = model;
    this.selected = selected;
    this.select = selected;
  }
}

@ng.Component({
  templateUrl: "app/interactions-scheme-version-new.html",
  directives: [
    customValidator.Directive,
    fieldInteractionsScheme.Component,
    layout.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  schemeId:string;

  schemeName:string;

  breadcrumbs:layout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  groups:SelectableApplicationGroup[];

  schemeField:string;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.schemeId = routeParams.get("scheme");
    this.schemeName = "Loading...";
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Schemes of Interactions", ["Interactions"]),
      new layout.LabeledLink("Loading...", ["Interactions"]),
      new layout.LabeledLink("New Version", ["Interactions"])
    ];
    this.nameField = "";
    this.descriptionField = "";
    this.schemeField = `{"blocks":{}}`;
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
          if (!scheme.versionObjects) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the scheme has no version"));
          } else if (scheme.versionObjects.length > 1) {
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-164
            this.notifications.current.push(new libPatternFlyNotifications.Warning("issue/TYRION-164"));
          }
          let lastVersion = scheme.versionObjects[0];
          return Promise.all<any>([
            scheme,
            this.backEnd.getProjectApplicationGroups(project.id),
            lastVersion,
            this.backEnd.request("GET", lastVersion.allFiles)
          ]);
        })
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let groups:libBackEnd.ApplicationGroup[];
          let lastVersion:libBackEnd.Version;
          let files:libBackEnd.File[];
          [scheme, groups, lastVersion, files] = result;
          if (files.length != 1) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the scheme version does not have only one file"));
          }
          return Promise.all<any>([
            scheme,
            Promise.all(groups.map(group => Promise.all<any>([group, group.b_progam_connected_version ? this.backEnd.request("GET", group.b_progam_connected_version) : null]))),
            lastVersion,
            this.backEnd.request("GET", files[0].fileContent)
          ]);
        })
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let groups:[libBackEnd.ApplicationGroup, libBackEnd.Version][];
          let lastVersion:libBackEnd.Version;
          let file:libBackEnd.FileContent;
          [scheme, groups, lastVersion, file] = result;
          this.schemeName = scheme.name;
          this.breadcrumbs[2].label = scheme.name;
          this.groups = groups.map(pair => new SelectableApplicationGroup(pair[0], pair[1] ? pair[1].id == lastVersion.id : false));
          this.schemeField = file.content;
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The scheme ${this.schemeId} cannot be loaded: ${reason}`));
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
        .then(() => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-163
          return this.backEnd.getInteractionsScheme(this.schemeId);
        })
        .then(scheme => {
          if (!scheme.versionObjects) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the scheme has no version"));
          } else if (scheme.versionObjects.length > 1) {
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-164
            this.notifications.current.push(new libPatternFlyNotifications.Warning("issue/TYRION-164"));
          }
          return Promise.all(this.groups.filter(group => group.selected).map(group => this.backEnd.addApplicationGroupToInteractionsScheme(group.model.id, scheme.versionObjects[0].id, false)));
        })
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The version has been created."));
          this.router.navigate(["Interactions"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The version cannot be created: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Interactions"]);
  }
}
