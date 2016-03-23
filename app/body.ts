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

import * as application from "./application";
import * as applicationDevice from "./application-device";
import * as applicationDeviceNew from "./application-device-new";
import * as applicationGroup from "./application-group";
import * as applicationGroupNew from "./application-group-new";
import * as applicationNew from "./application-new";
import * as applications from "./applications";
import * as applicationsVision from "./applications-vision";
import * as boardNew from "./board-new";
import * as boardProgram from "./board-program";
import * as boardProgramNew from "./board-program-new";
import * as boardProgramVersionNew from "./board-program-version-new";
import * as boardType from "./board-type";
import * as boardTypeNew from "./board-type-new";
import * as devices from "./devices";
import * as homerNew from "./homer-new";
import * as interactions from "./interactions";
import * as interactionsScheme from "./interactions-scheme";
import * as interactionsSchemeNew from "./interactions-scheme-new";
import * as interactionsSchemeVersionNew from "./interactions-scheme-version-new";
import * as issue from "./issue";
import * as issueConfirmationNew from "./issue-confirmation-new";
import * as issueConfirmationType from "./issue-confirmation-type";
import * as issueConfirmationTypeNew from "./issue-confirmation-type-new";
import * as issueNew from "./issue-new";
import * as issueRelatedNew from "./issue-related-new";
import * as issueTagNew from "./issue-tag-new";
import * as issueType from "./issue-type";
import * as issueTypeNew from "./issue-type-new";
import * as issues from "./issues";
import * as libraryGroup from "./library-group";
import * as libraryGroupNew from "./library-group-new";
import * as library from "./library";
import * as libraryNew from "./library-new";
import * as processor from "./processor";
import * as processorNew from "./processor-new";
import * as producer from "./producer";
import * as producerNew from "./producer-new";
import * as project from "./project";
import * as projectBoardNew from "./project-board-new";
import * as projectCollaboratorNew from "./project-collaborator-new";
import * as projectHomerNew from "./project-homer-new";
import * as projectNew from "./project-new";
import * as projects from "./projects";
import * as signing from "./signing";
import * as standaloneProgram from "./standalone-program";
import * as standaloneProgramNew from "./standalone-program-new";

@ngRouter.RouteConfig([
  {path: "/", redirectTo: "/applications"},
  {path: "/application/device/new", component: applicationDeviceNew.Component, as: "NewApplicationDevice"},
  {path: "/application/devices/:device", component: applicationDevice.Component, as: "ApplicationDevice"},
  {path: "/application/group/new", component: applicationGroupNew.Component, as: "NewApplicationGroup"},
  {path: "/application/groups/:group", component: applicationGroup.Component, as: "ApplicationGroup"},
  {path: "/application/new", component: applicationNew.Component, as: "NewApplication"},
  {path: "/application/vision", component: applicationsVision.Component, as: "ApplicationsVision"},
  {path: "/applications", component: applications.Component, as: "Applications"},
  {path: "/applications/:application", component: application.Component, as: "Application"},
  {path: "/board/new", component: boardNew.Component, as: "NewBoard"},
  {path: "/board/type/new", component: boardTypeNew.Component, as: "NewBoardType"},
  {path: "/board/types/:type", component: boardType.Component, as: "BoardType"},
  {path: "/devices", component: devices.Component, as: "Devices"},
  {path: "/homer/new", component: homerNew.Component, as: "NewHomer"},
  {path: "/interactions", component: interactions.Component, as: "Interactions"},
  {path: "/interactions/scheme/new", component: interactionsSchemeNew.Component, as: "NewInteractionsScheme"},
  {path: "/interactions/schemes/:scheme/version/new", component: interactionsSchemeVersionNew.Component, as: "NewInteractionsSchemeVersion"},
  {path: "/issue/new", component: issueNew.Component, as: "NewIssue"},
  {path: "/issue/confirmation/new", component: issueConfirmationTypeNew.Component, as: "NewIssueConfirmationType"},
  {path: "/issue/confirmations/:confirmation", component: issueConfirmationType.Component, as: "IssueConfirmationType"},
  {path: "/issue/type/new", component: issueTypeNew.Component, as: "NewIssueType"},
  {path: "/issue/types/:type", component: issueType.Component, as: "IssueType"},
  {path: "/issues", component: issues.Component, as: "Issues"},
  {path: "/issues/:issue", component: issue.Component, as: "Issue"},
  {path: "/issues/:issue/confirmation/new", component: issueConfirmationNew.Component, as: "NewIssueConfirmation"},
  {path: "/issues/:issue/related/new", component: issueRelatedNew.Component, as: "NewRelatedIssue"},
  {path: "/issues/:issue/tag/new", component: issueTagNew.Component, as: "NewIssueTag"},
  {path: "/libraries/:library", component: library.Component, as: "Library"},
  {path: "/library/group/new", component: libraryGroupNew.Component, as: "NewLibraryGroup"},
  {path: "/library/groups/:group", component: libraryGroup.Component, as: "LibraryGroup"},
  {path: "/library/new", component: libraryNew.Component, as: "NewLibrary"},
  {path: "/processor/new", component: processorNew.Component, as: "NewProcessor"},
  {path: "/processors/:processor", component: processor.Component, as: "Processor"},
  {path: "/producer/new", component: producerNew.Component, as: "NewProducer"},
  {path: "/producers/:producer", component: producer.Component, as: "Producer"},
  {path: "/signing", component: signing.Component, as: "Signing"},
  {path: "/user/interactions-schemes/:scheme", component: interactionsScheme.Component, as: "InteractionsScheme"},
  {path: "/user/project/new", component: projectNew.Component, as: "NewProject"},
  {path: "/user/projects", component: projects.Component, as: "Projects"},
  {path: "/user/projects/:project", component: project.Component, as: "Project"},
  {path: "/user/projects/:project/board/new", component: projectBoardNew.Component, as: "NewProjectBoard"},
  {path: "/user/projects/:project/board-program/new", component: boardProgramNew.Component, as: "NewBoardProgram"},
  {path: "/user/projects/:project/board-programs/:program", component: boardProgram.Component, as: "BoardProgram"},
  {path: "/user/projects/:project/board-programs/:program/version/new", component: boardProgramVersionNew.Component, as: "NewBoardProgramVersion"},
  {path: "/user/projects/:project/collaborator/new", component: projectCollaboratorNew.Component, as: "NewProjectCollaborator"},
  {path: "/user/projects/:project/homer/new", component: projectHomerNew.Component, as: "NewProjectHomer"},
  {path: "/user/projects/:project/standalone-program/new", component: standaloneProgramNew.Component, as: "NewStandaloneProgram"},
  {path: "/user/projects/:project/standalone-programs/:program", component: standaloneProgram.Component, as: "StandaloneProgram"}
])
@ng.Component({
  selector: "[body]",
  templateUrl: "app/body.html",
  directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["body"]
})
export class Component {

  router:ngRouter.Router;

  public constructor(router:ngRouter.Router) {
    "use strict";

    this.router = router;
  }
}
