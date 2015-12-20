/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
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
import * as deviceNew from "./device-new";
import * as devices from "./devices";
import * as events from "./events";
import * as homerNew from "./homer-new";
import * as homerProgram from "./homer-program";
import * as homerProgramNew from "./homer-program-new";
import * as issue from "./issue";
import * as issueNew from "./issue-new";
import * as issues from "./issues";
import * as project from "./project";
import * as projectNew from "./project-new";
import * as projects from "./projects";
import * as signingIn from "./signing-in";
import * as userNew from "./user-new";

@ngRouter.RouteConfig([
  {path: "/", redirectTo: "/signing/in"},
  {path: "/device/new", component: deviceNew.Component, as: "NewDevice"},
  {path: "/devices", component: devices.Component, as: "Devices"},
  {path: "/homer/new", component: homerNew.Component, as: "NewHomer"},
  {path: "/issue/new", component: issueNew.Component, as: "NewIssue"},
  {path: "/issues", component: issues.Component, as: "Issues"},
  {path: "/issues/:issue", component: issue.Component, as: "Issue"},
  {path: "/signing/in", component: signingIn.Component, as: "SigningIn"},
  {path: "/user/new", component: userNew.Component, as: "NewUser"},
  {path: "/user/project/new", component: projectNew.Component, as: "NewProject"},
  {path: "/user/projects", component: projects.Component, as: "Projects"},
  {path: "/user/projects/:project", component: project.Component, as: "Project"},
  {path: "/user/projects/:project/homer-programs/new", component: homerProgramNew.Component, as: "NewHomerProgram"},
  {path: "/user/projects/:project/homer-programs/:program", component: homerProgram.Component, as: "HomerProgram"}
])
@ng.Component({
  selector: "[body]",
  templateUrl: "app/body.html",
  directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  providers: [backEnd.Service, events.Service],
  inputs: ["body"]
})
export class Component implements ng.OnInit {

  message:string;

  events:events.Service;

  router:ngRouter.Router;

  public constructor(eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.events.bus.toRx().subscribe((event:any) => this.message = `${event}: ${JSON.stringify(event)}`);
  }
}
