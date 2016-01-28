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

import * as deviceNew from "./device-new";
import * as deviceProgramNew from "./device-program-new";
import * as devices from "./devices";
import * as events from "./events";
import * as homerNew from "./homer-new";
import * as homerProgram from "./homer-program";
import * as homerProgramNew from "./homer-program-new";
import * as issue from "./issue";
import * as issueConfirmationNew from "./issue-confirmation-new";
import * as issueNew from "./issue-new";
import * as issueRelatedNew from "./issue-related-new";
import * as issueTagNew from "./issue-tag-new";
import * as issueTypeNew from "./issue-type-new";
import * as issues from "./issues";
import * as project from "./project";
import * as projectCollaboratorNew from "./project-collaborator-new";
import * as projectDeviceNew from "./project-device-new";
import * as projectHomerNew from "./project-homer-new";
import * as projectNew from "./project-new";
import * as projectUploadNew from "./project-upload-new";
import * as projects from "./projects";
import * as signing from "./signing";
import * as standaloneProgramNew from "./standalone-program-new";

@ngRouter.RouteConfig([
  {path: "/", redirectTo: "/devices"},
  {path: "/device/new", component: deviceNew.Component, as: "NewDevice"},
  {path: "/devices", component: devices.Component, as: "Devices"},
  {path: "/homer/new", component: homerNew.Component, as: "NewHomer"},
  {path: "/issue/new", component: issueNew.Component, as: "NewIssue"},
  {path: "/issue/types/new", component: issueTypeNew.Component, as: "NewIssueType"},
  {path: "/issues", component: issues.Component, as: "Issues"},
  {path: "/issues/:issue", component: issue.Component, as: "Issue"},
  {path: "/issues/:issue/confirmation/new", component: issueConfirmationNew.Component, as: "NewIssueConfirmation"},
  {path: "/issues/:issue/related/new", component: issueRelatedNew.Component, as: "NewRelatedIssue"},
  {path: "/issues/:issue/tag/new", component: issueTagNew.Component, as: "NewIssueTag"},
  {path: "/signing", component: signing.Component, as: "Signing"},
  {path: "/user/project/new", component: projectNew.Component, as: "NewProject"},
  {path: "/user/projects", component: projects.Component, as: "Projects"},
  {path: "/user/projects/:project", component: project.Component, as: "Project"},
  {path: "/user/projects/:project/collaborator/new", component: projectCollaboratorNew.Component, as: "NewProjectCollaborator"},
  {path: "/user/projects/:project/device/new", component: projectDeviceNew.Component, as: "NewProjectDevice"},
  {path: "/user/projects/:project/device-program/new", component: deviceProgramNew.Component, as: "NewDeviceProgram"},
  {path: "/user/projects/:project/homer/new", component: projectHomerNew.Component, as: "NewProjectHomer"},
  {path: "/user/projects/:project/homer-program/new", component: homerProgramNew.Component, as: "NewHomerProgram"},
  {path: "/user/projects/:project/homer-programs/:program", component: homerProgram.Component, as: "HomerProgram"},
  {path: "/user/projects/:project/standalone-program/new", component: standaloneProgramNew.Component, as: "NewStandaloneProgram"},
  {path: "/user/projects/:project/upload/new", component: projectUploadNew.Component, as: "NewProjectUpload"}
])
@ng.Component({
  selector: "[body]",
  templateUrl: "app/body.html",
  directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["body"]
})
export class Component {

  message:string;

  router:ngRouter.Router;

  public constructor(eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    eventsService.bus.toRx().subscribe((event:any) => this.message += `${event}: ${JSON.stringify(event)}||\n`);
    this.router = router;
  }
}
