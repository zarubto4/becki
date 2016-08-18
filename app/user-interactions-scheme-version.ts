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
import * as libBeckiFieldInteractionsScheme from "./lib-becki/field-interactions-scheme";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/user-interactions-scheme-version.html",
  directives: [libBeckiFieldInteractionsScheme.Component, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

  name:string;

  schemeName:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  description:string;

  showGroups:boolean;

  groups:libBackEnd.MProject[];

  scheme:string;

  activatedRoute:ngRouter.ActivatedRoute;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  routeParamsSubscription:Rx.Subscription;

  constructor(@ngCore.Inject("home") home:string, activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.name = "Loading...";
    this.schemeName = "Loading...";
    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("Schemes of Interactions", ["/user/interactions/schemes"])
    ];
    this.description = "Loading...";
    this.showGroups = false;
    this.scheme = `{"blocks":{}}`;
    this.activatedRoute = activatedRoute;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
      let id = params["version"];
      let schemeId = params["scheme"];
      // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
      this.backEnd.getBProgram(schemeId)
          .then(scheme => {
            return Promise.all<any>([
              scheme,
              // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
              this.backEnd.getProject(scheme.project_id)
            ]);
          })
          .then(result => {
            let scheme:libBackEnd.BProgram;
            let project:libBackEnd.Project;
            [scheme, project] = result;
            return Promise.all<any>([
              scheme,
              // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
              Promise.all(project.m_projects_id.map(id => this.backEnd.getMProject(id)))
            ]);
          })
          .then(result => {
            let scheme:libBackEnd.BProgram;
            let groups:libBackEnd.MProject[];
            [scheme, groups] = result;
            let version = scheme.program_versions.find(version => version.version_Object.id == id);
            if (!version) {
              throw new Error(`version ${id} not found in scheme ${scheme.name}`);
            }
            this.name = version.version_Object.version_name;
            this.schemeName = scheme.name;
            this.breadcrumbs.push(new libBeckiLayout.LabeledLink(scheme.name, ["/user/interactions/schemes", schemeId]));
            this.breadcrumbs.push(new libBeckiLayout.LabeledLink("Versions", ["/user/interactions/schemes", schemeId, "versions"]));
            this.breadcrumbs.push(new libBeckiLayout.LabeledLink(version.version_Object.version_name, ["/user/interactions/schemes", schemeId, "versions", id]));
            this.description = version.version_Object.version_description;
            this.showGroups = groups.length > 1 || (groups.length == 1 && !groups[0].m_programs.length);
            this.groups = groups.filter(group => group.b_progam_connected_version_id && group.b_progam_connected_version_id == id);
            this.scheme = version.program;
          })
          .catch(reason => {
            this.notifications.current.push(new libBeckiNotifications.Danger(`The scheme ${schemeId} cannot be loaded.`, reason));
          });
    });
  }

  ngOnDestroy():void {
    "use strict";

    this.routeParamsSubscription.unsubscribe();
  }
}
