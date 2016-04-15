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

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

class SelectableModerator {

  model:libBackEnd.InteractionsModerator;

  selected:boolean;

  constructor(model:libBackEnd.InteractionsModerator) {
    "use strict";

    this.model = model;
    this.selected = false;
  }
}

@ng.Component({
  templateUrl: "app/user-interactions-scheme.html",
  directives: [
    libBeckiCustomValidator.Directive,
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

  editing:boolean;

  editScheme:boolean;

  project:string;

  nameField:string;

  descriptionField:string;

  description:string;

  addVersion:boolean;

  versions:libPatternFlyListView.Item[];

  uploadVersionField:string;

  moderators:SelectableModerator[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("scheme");
    this.name = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Schemes of Interactions", ["UserInteractions"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserInteractionsScheme", {scheme: this.id}])
    ];
    this.editing = false;
    this.editScheme = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.addVersion = false;
    this.uploadVersionField = "";
    this.backEnd = backEnd;
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
              this.backEnd.request("GET", scheme.project)
          ]);
        })
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let project:libBackEnd.Project;
          [scheme, project] = result;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-192
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-192"));
          return Promise.all<any>([
            scheme,
            this.backEnd.getUserRolesAndPermissionsCurrent(),
            this.backEnd.getProjects(),
            project,
            this.backEnd.getProjectInteractionsModerators(project.id)
          ]);
        })
        .then(result => {
          let scheme:libBackEnd.InteractionsScheme;
          let permissions:libBackEnd.RolesAndPermissions;
          let projects:libBackEnd.Project[];
          let project:libBackEnd.Project;
          let moderators:libBackEnd.InteractionsModerator[];
          [scheme, permissions, projects, project, moderators] = result;
          this.name = scheme.name;
          this.breadcrumbs[3].label = scheme.name;
          let hasPermission = libBackEnd.containsPermissions(permissions, ["project.owner", "Project_Editor"]);
          this.editScheme = hasPermission;
          this.project = projects.length > 1 ? project.project_name : null;
          this.nameField = scheme.name;
          this.descriptionField = scheme.program_description;
          this.description = scheme.program_description;
          this.addVersion = hasPermission;
          let viewVersion = libBackEnd.containsPermissions(permissions, ["project.owner"]);
          this.versions = scheme.versionObjects.map(version => new libPatternFlyListView.Item(version.id, version.version_name, version.version_description, viewVersion ? ["UserInteractionsSchemeVersion", {scheme: this.id, version: version.id}] : undefined, false));
          this.moderators = moderators.map(moderator => new SelectableModerator(moderator));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The scheme ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(permissions => {
          if (!libBackEnd.containsPermissions(permissions, ["project.owner", "Project_Editor"])) {
            return Promise.reject('You are not allowed to list other schemes.');
          }
        })
        .then(() => this.backEnd.getProjects())
        .then(projects => Promise.all(projects.map(project => this.backEnd.getProjectInteractionsSchemes(project.id))))
        .then(schemes => ![].concat(...schemes).find(scheme => scheme.b_program_id != this.id && scheme.name == this.nameField));
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

  onAddVersionClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["NewUserInteractionsSchemeVersion", {scheme: this.id}]);
  }

  onUploadSubmit():void {
    "use strict";

    let moderators = this.moderators.filter(selectable => selectable.selected).map(selectable => selectable.model.homer_id);
    if (!moderators.length) {
      return;
    }

    this.notifications.shift();
    Promise.all(moderators.map(id => this.backEnd.addSchemeToInteractionsModerator(this.uploadVersionField, id, this.id)))
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The scheme has been uploaded."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be uploaded.", reason));
        });
  }
}
