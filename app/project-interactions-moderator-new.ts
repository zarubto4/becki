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
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/project-interactions-moderator-new.html",
  directives: [customValidator.Directive, layout.Component, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  projectId:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  idField:string;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.projectId = routeParams.get("project");
    this.heading = `New Project Moderator of Interactions (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", ["Projects"]),
      new layout.LabeledLink("Projects", ["Projects"]),
      new layout.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new layout.LabeledLink("Moderators of Interactions", ["Project", {project: this.projectId}]),
      new layout.LabeledLink("New Moderator", ["NewProjectInteractionsModerator", {project: this.projectId}])
    ];
    this.idField = "";
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
  }

  validateIdField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjectInteractionsModerators(this.projectId).then(moderators => !moderators.find(moderator => moderator.homer_id == this.idField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.addInteractionsModeratorToProject(this.idField, this.projectId)
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The moderator has been added."));
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The moderator cannot be added: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
