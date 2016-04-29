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
import * as libBecki from "./lib-becki/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/user-interactions-moderator-new.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  projectField:string;

  projects:libBackEnd.Project[];

  idField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("New Moderator of Interactions", ["NewUserInteractionsModerator"])
    ];
    this.projectField = "";
    this.idField = "";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getProjects()
        .then(projects => this.projects = projects)
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Projects cannot be loaded.", reason)));
  }

  validateIdField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjects().then(projects => projects.every(project => project.homers_id.indexOf(this.idField) == -1));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    Promise.resolve(
            libBecki.getAdvancedField(this.projectField, this.projects.map(project => project.id)) || this.backEnd.createDefaultProject().then(project => {
              this.projects = [project];
              this.projectField = project.id;
              return project.id;
            })
        )
        .then(project => {
          return this.backEnd.addInteractionsModeratorToProject(this.idField, project);
        })
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The moderator has been added."));
          this.router.navigate(["UserInteractions"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The moderator cannot be added.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["UserInteractions"]);
  }
}
