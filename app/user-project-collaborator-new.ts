/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as Rx from "rxjs";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/user-project-collaborator-new.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

  projectId:string;

  projectName:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  idField:string;

  addCollaborator:boolean;

  activatedRoute:ngRouter.ActivatedRoute;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  routeParamsSubscription:Rx.Subscription;

  constructor(@ngCore.Inject("home") home:string, activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.projectName = "Loading...";
    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("Projects", ["/user/projects"])
    ];
    this.idField = "";
    this.addCollaborator = false;
    this.activatedRoute = activatedRoute;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
      this.projectId = params["project"];
      // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
      this.backEnd.getProject(this.projectId)
          .then(project => {
            this.projectName = project.project_name;
            this.breadcrumbs.push(new libBeckiLayout.LabeledLink(project.project_name, ["/user/projects", this.projectId]));
            this.breadcrumbs.push(new libBeckiLayout.LabeledLink("New Collaborator", ["/user/projects", this.projectId, "collaborator/new"]));
            this.addCollaborator = project.share_permission;
          })
          .catch(reason => {
            this.notifications.current.push(new libBeckiNotifications.Danger("The project cannot be loaded.", reason));
          });
    });
  }

  ngOnDestroy():void {
    "use strict";

    this.routeParamsSubscription.unsubscribe();
  }

  validateIdField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return () => this.backEnd.getProject(this.projectId).then(project => !project.owners_id.indexOf(this.idField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.addCollaboratorToProject(this.idField, this.projectId)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The collaborator has been added."));
          this.router.navigate(["/user/projects", this.projectId]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The collaborator cannot be added.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["/user/projects", this.projectId]);
  }
}
