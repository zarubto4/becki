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

import * as ng from "angular2/angular2";
import * as ngRouter from "angular2/router";

import * as backEnd from "./back-end";
import * as becki from "./index";
import * as customValidator from "./custom-validator";
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
  templateUrl: "app/interactions-scheme.html",
  directives: [customValidator.Directive, layout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  projectId:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  groups:SelectableApplicationGroup[];

  lastVersion:string;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("scheme");
    this.projectId = routeParams.get("project");
    this.heading = `Scheme of Interactions ${this.id} (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", ["Projects"]),
      new layout.LabeledLink("Projects", ["Projects"]),
      new layout.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new layout.LabeledLink("Schemes of Interactions", ["Project", {project: this.projectId}]),
      new layout.LabeledLink(`Scheme of Interactions ${this.id}`, ["InteractionsScheme", {project: this.projectId, scheme: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getInteractionsScheme(this.id)
        .then(scheme => {
          if (!scheme.versionObjects) {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject<any>(new Error("the scheme has no version"));
          } else if (scheme.versionObjects.length > 1) {
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-164
            this.notifications.current.push(new libPatternFlyNotifications.Warning("issue/TYRION-164"));
          }
          return Promise.all<any>([
              scheme,
              this.backEnd.getProjectApplicationGroups(this.projectId),
              scheme.versionObjects[0].id
          ]);
        })
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let groups:libBackEnd.ApplicationGroup[];
          let lastVersion:string;
          [scheme, groups, lastVersion] = result;
          return Promise.all<any>([
              scheme,
              Promise.all(groups.map(group => Promise.all<any>([group, group.b_program ? this.backEnd.request("GET", group.b_program) : null]))),
              lastVersion
          ]);
        })
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let groups:[libBackEnd.ApplicationGroup, libBackEnd.InteractionsScheme][];
          [scheme, groups, this.lastVersion] = result;
          this.nameField = scheme.name;
          this.descriptionField = scheme.program_description;
          this.groups = groups.map(pair => new SelectableApplicationGroup(pair[0], pair[1] ? pair[1].b_program_id == this.id : false));
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The scheme ${this.id} cannot be loaded: ${reason}`));
        });
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjectInteractionsSchemes(this.projectId).then(schemes => !schemes.find(scheme => scheme.b_program_id != this.id && scheme.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    Promise.all<any>([
          this.backEnd.updateInteractionsScheme(this.id, this.nameField, this.descriptionField),
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-169
          Promise.all(this.groups.filter(group => !group.selected && group.select).map(group => this.backEnd.addApplicationGroupToInteractionsScheme(group.model.id, this.lastVersion, true)))
        ])
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The scheme has been updated."));
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The scheme cannot be updated: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
