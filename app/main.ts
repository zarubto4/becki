/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngForms from "@angular/forms";
import * as ngHttp from "@angular/http";
import * as ngPlatformBrowserDynamic from "@angular/platform-browser-dynamic";
import * as ngRouter from "@angular/router";

import * as applicationDevice from "./application-device";
import * as body from "./body";
import * as libBeckiLayout from "./lib-becki/layout";
import * as signing from "./signing";
import * as system from "./system";
import * as systemCompilationServer from "./system-compilation-server";
import * as systemCompilationServerNew from "./system-compilation-server-new";
import * as systemDeviceNew from "./system-device-new";
import * as systemDeviceType from "./system-device-type";
import * as systemDeviceTypeNew from "./system-device-type-new";
import * as systemInteractionsServer from "./system-interactions-server";
import * as systemInteractionsServerNew from "./system-interactions-server-new";
import * as systemLibrary from "./system-library";
import * as systemLibraryGroup from "./system-library-group";
import * as systemLibraryGroupNew from "./system-library-group-new";
import * as systemLibraryNew from "./system-library-new";
import * as systemProcessor from "./system-processor";
import * as systemProcessorNew from "./system-processor-new";
import * as systemProducer from "./system-producer";
import * as systemProducerNew from "./system-producer-new";
import * as user from "./user";
import * as userApplication from "./user-application";
import * as userApplicationDeviceNew from "./user-application-device-new";
import * as userApplicationGroup from "./user-application-group";
import * as userApplicationGroupNew from "./user-application-group-new";
import * as userApplicationNew from "./user-application-new";
import * as userApplications from "./user-applications";
import * as userConnections from "./user-connections";
import * as userDeviceNew from "./user-device-new";
import * as userDeviceProgram from "./user-device-program";
import * as userDeviceProgramNew from "./user-device-program-new";
import * as userDevices from "./user-devices";
import * as userInteractions from "./user-interactions";
import * as userInteractionsBlock from "./user-interactions-block";
import * as userInteractionsBlockNew from "./user-interactions-block-new";
import * as userInteractionsModeratorNew from "./user-interactions-moderator-new";
import * as userInteractionsScheme from "./user-interactions-scheme";
import * as userInteractionsSchemeNew from "./user-interactions-scheme-new";
import * as userInteractionsSchemeVersion from "./user-interactions-scheme-version";
import * as userInteractionsSpy from "./user-interactions-spy";
import * as userProject from "./user-project";
import * as userProjectCollaboratorNew from "./user-project-collaborator-new";
import * as userProjectNew from "./user-project-new";
import * as userProjects from "./user-projects";
import * as userInteractionsBlockGroupNew from "./user-interactions-blockGroup-new";
import * as userInteractionsBlockGroup from "./user-interactions-block-group";
import * as userProjectEdit from "./user-project-edit";

ngPlatformBrowserDynamic.bootstrap(
    body.Component,
    [
      ngForms.disableDeprecatedForms(),
      ngForms.provideForms(),
      ngHttp.HTTP_PROVIDERS,
      ngRouter.provideRouter([
        {path: "", redirectTo: "user", pathMatch: "full"},
        {path: "application/devices/:device", component: applicationDevice.Component},
        {path: "application/devices", redirectTo: "user/applications"},
        {path: "signing", component: signing.Component},
        {path: "system", component: system.Component},
        {path: "system/compilation/server/new", component: systemCompilationServerNew.Component},
        {path: "system/compilation/servers/:server", component: systemCompilationServer.Component},
        {path: "system/compilation/servers", redirectTo: "system"},
        {path: "system/device/new", component: systemDeviceNew.Component},
        {path: "system/device/type/new", component: systemDeviceTypeNew.Component},
        {path: "system/device/types/:type", component: systemDeviceType.Component},
        {path: "system/device/types", redirectTo: "system"},
        {path: "system/interactions/server/new", component: systemInteractionsServerNew.Component},
        {path: "system/interactions/servers/:server", component: systemInteractionsServer.Component},
        {path: "system/interactions/servers", redirectTo: "system"},
        {path: "system/libraries/:library", component: systemLibrary.Component},
        {path: "system/libraries", redirectTo: "system"},
        {path: "system/library/group/new", component: systemLibraryGroupNew.Component},
        {path: "system/library/groups/:group", component: systemLibraryGroup.Component},
        {path: "system/library/groups", redirectTo: "system"},
        {path: "system/library/new", component: systemLibraryNew.Component},
        {path: "system/processor/new", component: systemProcessorNew.Component},
        {path: "system/processors/:processor", component: systemProcessor.Component},
        {path: "system/processors", redirectTo: "system"},
        {path: "system/producer/new", component: systemProducerNew.Component},
        {path: "system/producers/:producer", component: systemProducer.Component},
        {path: "system/producers", redirectTo: "system"},
        // see https://github.com/angular/angular/issues/10120
        {path: "user", children: [
          {path: "", redirectTo: "applications", pathMatch: "full"},
          {path: "application/device/new", component: userApplicationDeviceNew.Component},
          {path: "application/devices", redirectTo: "applications"},
          {path: "application/group/new", component: userApplicationGroupNew.Component},
          {path: "application/groups/:group", component: userApplicationGroup.Component},
          {path: "application/groups", redirectTo: "applications"},
          {path: "application/new", component: userApplicationNew.Component},
          {path: "applications/:application", component: userApplication.Component},
          {path: "applications", component: userApplications.Component},
          {path: "connections", component: userConnections.Component},
          {path: "device/new", component: userDeviceNew.Component},
          {path: "device/program/new", component: userDeviceProgramNew.Component},
          {path: "device/programs/:program", component: userDeviceProgram.Component},
          {path: "device/programs", redirectTo: "devices"},
          {path: "devices", component: userDevices.Component},
          {path: "interactions/block/group/new", component: userInteractionsBlockGroupNew.Component},
          {path: "interactions/block/groups/:group", component: userInteractionsBlockGroup.Component},
          {path: "interactions/block/groups", redirectTo: "interactions"},
          {path: "interactions/block/new", component: userInteractionsBlockNew.Component},
          {path: "interactions/blocks/:block", component: userInteractionsBlock.Component},
          {path: "interactions/blocks", redirectTo: "interactions"},
          {path: "interactions/moderator/new", component: userInteractionsModeratorNew.Component},
          {path: "interactions/moderators", redirectTo: "interactions"},
          {path: "interactions/scheme/new", component: userInteractionsSchemeNew.Component},
          {path: "interactions/schemes/:scheme", component: userInteractionsScheme.Component},
          {path: "interactions/schemes/:scheme/versions/:version", component: userInteractionsSchemeVersion.Component},
          {path: "interactions/schemes/:scheme/versions", redirectTo: "interactions/schemes/:scheme"},
          {path: "interactions/schemes", redirectTo: "interactions"},
          {path: "interactions/spies/:spy", component: userInteractionsSpy.Component},
          {path: "interactions/spies", redirectTo: "interactions"},
          {path: "interactions", component: userInteractions.Component},
          {path: "project/new", component: userProjectNew.Component},
          {path: "projects/:project", component: userProject.Component},
          {path: "projects/:project/collaborator/new", component: userProjectCollaboratorNew.Component},
          {path: "projects/:project/edit", component: userProjectEdit.Component},
          {path: "projects", component: userProjects.Component},
        ]},
        {path: "users/:user", component: user.Component},
      ]),
      {provide: "connections", useValue: ["/user/connections"]},
      {provide: "navigation", useValue: [
        new libBeckiLayout.LabeledLink("Projects", ["/user/projects"], "book"),
        new libBeckiLayout.LabeledLink("Applications", ["/user/applications"], "mobile"),
        new libBeckiLayout.LabeledLink("Interactions", ["/user/interactions"], "link"),
        new libBeckiLayout.LabeledLink("Devices", ["/user/devices"], "rocket"),
        new libBeckiLayout.LabeledLink("System", ["/system"], "globe")
      ]},
      {provide: "signing", useValue: ["/signing"]}
    ]
);
