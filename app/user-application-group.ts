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

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ng.Component({
  templateUrl: "app/user-application-group.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiLayout.Component,
    libPatternFlyListView.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  group:libBackEnd.ApplicationGroup;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  editGroup:boolean;

  project:string;

  nameField:string;

  descriptionField:string;

  applications:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("group");
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Applications Groups", ["UserApplications"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserApplicationGroup", {group: this.id}])
    ];
    this.editing = false;
    this.editGroup = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
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
    Promise.all<any>([
          this.backEnd.getApplicationGroup(this.id),
          this.backEnd.getProjects()
        ])
        .then(result => {
          let projects:libBackEnd.Project[];
          [this.group, projects] = result;
          this.breadcrumbs[3].label = this.group.program_name;
          this.editGroup = this.group.edit_permission;
          this.project = projects.length > 1 ? projects.find(project => project.id == this.group.project_id).project_name : null;
          this.nameField = this.group.program_name;
          this.descriptionField = this.group.program_description;
          this.applications = this.group.m_programs.map(application => new libPatternFlyListView.Item(application.id, application.program_name, application.program_description, ["UserApplication", {application: application.id}], application.delete_permission));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The group ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getApplicationGroups().then(groups => !groups.find(group => group.id != this.id && group.program_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateApplicationGroup(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The group has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The group cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.editing = false;
  }

  onAddApplicationClick():void {
    "use strict";

    this.router.navigate(["NewUserApplication"]);
  }

  onRemoveApplicationClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteApplication(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The application has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The application cannot be removed.", reason));
        });
  }
}
