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

@ng.Component({
  templateUrl: "app/user-project.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiLayout.Component,
    libPatternFlyListView.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  nameField:string;

  descriptionField:string;

  description:string;

  editProject:boolean;

  addCollaborator:boolean;

  collaborators:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("project");
    this.name = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Projects", ["Projects"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserProject", {project: this.id}])
    ];
    this.editing = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.editProject = false;
    this.addCollaborator = false;
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
    this.backEnd.getProject(this.id)
        .then(project => {
          return Promise.all<any>([
            project,
            Promise.all(project.owners_id.map(id => this.backEnd.getUser(id)))
          ]);
        })
        .then(result => {
          let project:libBackEnd.Project;
          let collaborators:libBackEnd.User[];
          [project, collaborators] = result;
          this.name = project.project_name;
          this.breadcrumbs[3].label = project.project_name;
          this.nameField = project.project_name;
          this.descriptionField = project.project_description;
          this.description = project.project_description;
          this.editProject = project.edit_permission;
          this.addCollaborator = project.share_permission;
          this.collaborators = collaborators.map(collaborator => new libPatternFlyListView.Item(collaborator.id, libBackEnd.composeUserString(collaborator, true), null, undefined, project.unshare_permission));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The project ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjects().then(projects => !projects.find(project => project.id != this.id && project.project_name == this.nameField));
  }

  onUpdatingSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateProject(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The project has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The project cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.editing = false;
  }

  onCollaboratorAddClick():void {
    "use strict";

    this.router.navigate(["NewProjectCollaborator", {project: this.id}]);
  }

  onCollaboratorRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.removeCollaboratorsFromProject([id], this.id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The collaborator has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The collaborator cannot be removed.", reason));
        });
  }
}
