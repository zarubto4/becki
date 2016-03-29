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

import * as applicationDevice from "./application-device";
import * as deviceNew from "./device-new";
import * as deviceProgram from "./device-program";
import * as deviceProgramNew from "./device-program-new";
import * as deviceProgramVersionNew from "./device-program-version-new";
import * as deviceType from "./device-type";
import * as deviceTypeNew from "./device-type-new";
import * as devices from "./devices";
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
import * as projectCollaboratorNew from "./project-collaborator-new";
import * as projectNew from "./project-new";
import * as projects from "./projects";
import * as signing from "./signing";
import * as standaloneProgram from "./standalone-program";
import * as standaloneProgramNew from "./standalone-program-new";
import * as system from "./system";
import * as systemInteractionsModeratorNew from "./system-interactions-moderator-new";
import * as userApplication from "./user-application";
import * as userApplicationDeviceNew from "./user-application-device-new";
import * as userApplicationGroup from "./user-application-group";
import * as userApplicationGroupNew from "./user-application-group-new";
import * as userApplicationNew from "./user-application-new";
import * as userApplications from "./user-applications";
import * as userApplicationsVision from "./user-applications-vision";
import * as userDeviceNew from "./user-device-new";
import * as userDevices from "./user-devices";
import * as userInteractions from "./user-interactions";
import * as userInteractionsModeratorNew from "./user-interactions-moderator-new";
import * as userInteractionsScheme from "./user-interactions-scheme";
import * as userInteractionsSchemeNew from "./user-interactions-scheme-new";
import * as userInteractionsSchemeVersion from "./user-interactions-scheme-version";
import * as userInteractionsSchemeVersionNew from "./user-interactions-scheme-version-new";

@ngRouter.RouteConfig([
  {path: "/", redirectTo: "/user/applications"},
  {path: "/application/devices/:device", component: applicationDevice.Component, as: "ApplicationDevice"},
  {path: "/device/new", component: deviceNew.Component, as: "NewDevice"},
  {path: "/device/type/new", component: deviceTypeNew.Component, as: "NewDeviceType"},
  {path: "/device/types/:type", component: deviceType.Component, as: "DeviceType"},
  {path: "/devices", component: devices.Component, as: "Devices"},
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
  {path: "/system", component: system.Component, as: "System"},
  {path: "/system/interactions/moderator/new", component: systemInteractionsModeratorNew.Component, as: "NewSystemInteractionsModerator"},
  {path: "/user/application/device/new", component: userApplicationDeviceNew.Component, as: "NewUserApplicationDevice"},
  {path: "/user/application/group/new", component: userApplicationGroupNew.Component, as: "NewUserApplicationGroup"},
  {path: "/user/application/groups/:group", component: userApplicationGroup.Component, as: "UserApplicationGroup"},
  {path: "/user/application/new", component: userApplicationNew.Component, as: "NewUserApplication"},
  {path: "/user/application/vision", component: userApplicationsVision.Component, as: "UserApplicationsVision"},
  {path: "/user/applications", component: userApplications.Component, as: "UserApplications"},
  {path: "/user/applications/:application", component: userApplication.Component, as: "UserApplication"},
  {path: "/user/device/new", component: userDeviceNew.Component, as: "NewUserDevice"},
  {path: "/user/devices", component: userDevices.Component, as: "UserDevices"},
  {path: "/user/interactions", component: userInteractions.Component, as: "UserInteractions"},
  {path: "/user/interactions/moderator/new", component: userInteractionsModeratorNew.Component, as: "NewUserInteractionsModerator"},
  {path: "/user/interactions/scheme/new", component: userInteractionsSchemeNew.Component, as: "NewUserInteractionsScheme"},
  {path: "/user/interactions/schemes/:scheme", component: userInteractionsScheme.Component, as: "UserInteractionsScheme"},
  {path: "/user/interactions/schemes/:scheme/version/new", component: userInteractionsSchemeVersionNew.Component, as: "NewUserInteractionsSchemeVersion"},
  {path: "/user/interactions/schemes/:scheme/versions/:version", component: userInteractionsSchemeVersion.Component, as: "UserInteractionsSchemeVersion"},
  {path: "/user/project/new", component: projectNew.Component, as: "NewProject"},
  {path: "/user/projects", component: projects.Component, as: "Projects"},
  {path: "/user/projects/:project", component: project.Component, as: "Project"},
  {path: "/user/projects/:project/device-program/new", component: deviceProgramNew.Component, as: "NewDeviceProgram"},
  {path: "/user/projects/:project/device-programs/:program", component: deviceProgram.Component, as: "DeviceProgram"},
  {path: "/user/projects/:project/device-programs/:program/version/new", component: deviceProgramVersionNew.Component, as: "NewDeviceProgramVersion"},
  {path: "/user/projects/:project/collaborator/new", component: projectCollaboratorNew.Component, as: "NewProjectCollaborator"},
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
