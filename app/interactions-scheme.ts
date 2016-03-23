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
import * as libPatternFlyListView from "./lib-patternfly/list-view";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/interactions-scheme.html",
  directives: [
    customValidator.Directive,
    layout.Component,
    libPatternFlyListView.Component,
    ng.FORM_DIRECTIVES,
    ng.CORE_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  name:string;

  breadcrumbs:layout.LabeledLink[];

  editing:boolean;

  project:string;

  nameField:string;

  descriptionField:string;

  description:string;

  versions:libPatternFlyListView.Item[];

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("scheme");
    this.name = "Loading...";
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Schemes of Interactions", ["Interactions"]),
      new layout.LabeledLink(`Scheme of Interactions ${this.id}`, ["InteractionsScheme", {scheme: this.id}])
    ];
    this.editing = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    this.backEnd.getInteractionsScheme(this.id)
        .then(scheme => {
          return Promise.all<any>([
              scheme,
              this.backEnd.getProjects(),
              this.backEnd.request("GET", scheme.project)
          ]);
        })
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let projects:libBackEnd.Project[];
          let project:libBackEnd.Project;
          [scheme, projects, project] = result;
          this.name = scheme.name;
          this.project = projects.length > 1 ? project.project_name : null;
          this.nameField = scheme.name;
          this.descriptionField = scheme.program_description;
          this.description = scheme.program_description;
          this.versions = scheme.versionObjects.map(version => new libPatternFlyListView.Item(version.id, version.version_name, version.version_description));
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The scheme ${this.id} cannot be loaded: ${reason}`));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjects()
        .then(projects => Promise.all(projects.map(project => this.backEnd.getProjectInteractionsSchemes(project.id))))
        .then(schemes => ![].concat(...schemes).find(scheme => scheme.b_program_id != this.id && scheme.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateInteractionsScheme(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The scheme has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The scheme cannot be updated: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.editing = false;
  }

  onAddVersionClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["NewInteractionsSchemeVersion", {scheme: this.id}]);
  }
}
