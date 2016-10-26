/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as Rx from "rxjs";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ngCore.Component({
  templateUrl: "app/user-application-group.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiLayout.Component,
    libPatternFlyListView.Component,
    ngCommon.CORE_DIRECTIVES
  ]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

  id:string;

  group:libBackEnd.ApplicationGroup;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  editGroup:boolean;

  project:string;

  nameField:string;

  descriptionField:string;

  applications:libPatternFlyListView.Item[];

  activatedRoute:ngRouter.ActivatedRoute;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  routeParamsSubscription:Rx.Subscription;

  constructor(@ngCore.Inject("home") home:string, activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("Applications Groups", ["/user/application/groups"])
    ];
    this.editing = false;
    this.editGroup = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.activatedRoute = activatedRoute;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = params["group"];
      this.refresh();
    });
  }

  ngOnDestroy():void {
    "use strict";

    this.routeParamsSubscription.unsubscribe();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    Promise.all<any>([
          // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
          this.backEnd.getMProject(this.id),
          this.backEnd.getProjects()
        ])
        .then(result => {
          let projects:libBackEnd.Project[];
          [this.group, projects] = result;
          this.breadcrumbs.push(new libBeckiLayout.LabeledLink(this.group.program_name, ["/user/application/groups", this.id]));
          this.editGroup = this.group.edit_permission;
          this.project = projects.length > 1 ? projects.find(project => project.id == this.group.project_id).project_name : null;
          this.nameField = this.group.program_name;
          this.descriptionField = this.group.program_description;
          this.applications = this.group.m_programs.map(application => new libPatternFlyListView.Item(application.id, application.program_name, application.program_description, ["/user/applications", application.id], application.delete_permission));
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
    return () => this.backEnd.getProjects()
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        .then(projects => Promise.all<libBackEnd.ApplicationGroup>([].concat(...projects.map(project => project.m_projects_id)).map(id => this.backEnd.getMProject(id))))
        .then(groups => !groups.find(group => group.id != this.id && group.program_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateMProject(this.id, this.nameField, this.descriptionField)
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

    this.router.navigate(["/user/application/new"]);
  }

  onRemoveApplicationClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteMProgram(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The application has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The application cannot be removed.", reason));
        });
  }
}
