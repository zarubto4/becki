/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/user-project-collaborator-new.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.FORM_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

  projectId:string;

  projectName:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  idField:string;

  addCollaborator:boolean;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.projectId = routeParams.get("project");
    this.projectName = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Projects", ["UserProjects"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserProject", {project: this.projectId}]),
      new libBeckiLayout.LabeledLink("New Collaborator", ["NewUserProjectCollaborator", {project: this.projectId}])
    ];
    this.idField = "";
    this.addCollaborator = false;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getProject(this.projectId)
        .then(project => {
          this.projectName = project.project_name;
          this.breadcrumbs[3].label = project.project_name;
          this.addCollaborator = project.share_permission;
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-219
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-219"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The project cannot be loaded.", reason));
        });
  }

  validateIdField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProject(this.projectId).then(project => !project.owners_id.indexOf(this.idField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.addCollaboratorToProject(this.idField, this.projectId)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The collaborator has been added."));
          this.router.navigate(["UserProject", {project: this.projectId}]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The collaborator cannot be added.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["UserProject", {project: this.projectId}]);
  }
}
