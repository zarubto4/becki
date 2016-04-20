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

import * as blocko from "blocko";
import * as ng from "angular2/angular2";
import * as ngRouter from "angular2/router";
import * as theGrid from "the-grid";

import * as applicationDevice from "./application-device";
import * as deviceProgram from "./device-program";
import * as deviceProgramNew from "./device-program-new";
import * as deviceProgramVersionNew from "./device-program-version-new";
import * as deviceType from "./device-type";
import * as deviceTypeNew from "./device-type-new";
import * as devices from "./devices";
import * as issue from "./issue";
import * as issueConfirmationNew from "./issue-confirmation-new";
import * as issueNew from "./issue-new";
import * as issueRelatedNew from "./issue-related-new";
import * as issues from "./issues";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiFieldCode from "./lib-becki/field-code";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiModal from "./lib-becki/modal";
import * as libBeckiNotifications from "./lib-becki/notifications";
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
import * as systemDeviceNew from "./system-device-new";
import * as systemInteractionsModeratorNew from "./system-interactions-moderator-new";
import * as systemIssueConfirmation from "./system-issue-confirmation";
import * as systemIssueConfirmationNew from "./system-issue-confirmation-new";
import * as systemIssueType from "./system-issue-type";
import * as systemIssueTypeNew from "./system-issue-type-new";
import * as user from "./user";
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
  {path: "/device/type/new", component: deviceTypeNew.Component, as: "NewDeviceType"},
  {path: "/device/types/:type", component: deviceType.Component, as: "DeviceType"},
  {path: "/devices", component: devices.Component, as: "Devices"},
  {path: "/issue/new", component: issueNew.Component, as: "NewIssue"},
  {path: "/issues", component: issues.Component, as: "Issues"},
  {path: "/issues/:issue", component: issue.Component, as: "Issue"},
  {path: "/issues/:issue/confirmation/new", component: issueConfirmationNew.Component, as: "NewIssueConfirmation"},
  {path: "/issues/:issue/related/new", component: issueRelatedNew.Component, as: "NewRelatedIssue"},
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
  {path: "/system/device/new", component: systemDeviceNew.Component, as: "NewSystemDevice"},
  {path: "/system/interactions/moderator/new", component: systemInteractionsModeratorNew.Component, as: "NewSystemInteractionsModerator"},
  {path: "/system/issue/confirmation/new", component: systemIssueConfirmationNew.Component, as: "NewSystemIssueConfirmation"},
  {path: "/system/issue/confirmations/:confirmation", component: systemIssueConfirmation.Component, as: "SystemIssueConfirmation"},
  {path: "/system/issue/type/new", component: systemIssueTypeNew.Component, as: "NewSystemIssueType"},
  {path: "/system/issue/types/:type", component: systemIssueType.Component, as: "SystemIssueType"},
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
  {path: "/user/projects/:project/standalone-programs/:program", component: standaloneProgram.Component, as: "StandaloneProgram"},
  {path: "/users/:user", component: user.Component, as: "User"},
])
@ng.Component({
  selector: "[body]",
  templateUrl: "app/body.html",
  providers: [
    libBeckiModal.Service,
    ng.provide("home", {useValue: new libBeckiLayout.LabeledLink("No Name", ["UserApplications"])}),
    ng.provide("navigation", {
      useValue: [
        new libBeckiLayout.LabeledLink("Applications", ["UserApplications"], "mobile"),
        new libBeckiLayout.LabeledLink("Interactions", ["UserInteractions"], "link"),
        new libBeckiLayout.LabeledLink("Devices", ["UserDevices"], "rocket"),
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-155
        new libBeckiLayout.LabeledLink("System (TYRION-155)", ["System"], "globe"),
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-208
        new libBeckiLayout.LabeledLink("Issues (TYRION-208)", ["Issues"], "bug"),
        new libBeckiLayout.LabeledLink("Applications (Vision)", ["UserApplicationsVision"], "mobile"),
        new libBeckiLayout.LabeledLink("Devices (TODO)", ["Devices"], "tachometer"),
        new libBeckiLayout.LabeledLink("Projects (TODO)", ["Projects"], "book")
      ]
    }),
  ],
  directives: [libBeckiFieldCode.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["body"],
  host: {"[class.modal-open]": "modalEvent"}
})
export class Component {

  public modalEvent:libBeckiModal.Event;

  public router:ngRouter.Router;

  private notifications:libBeckiNotifications.Notification[];

  private notificationTimeout:number;

  constructor(modal:libBeckiModal.Service, router:ngRouter.Router, backEnd:libBeckiBackEnd.Service) {
    "use strict";

    this.modalEvent = null;
    this.router = router;
    this.notifications = [];
    this.notificationTimeout = null;
    modal.modalChange.toRx().subscribe((event:libBeckiModal.Event) => this.modalEvent = event);
    backEnd.notificationsNew.toRx().subscribe((event:MessageEvent) => {
      let notificationData = JSON.parse(event.data);
      let notification:libBeckiNotifications.Notification;
      switch (notificationData.level) {
        case "info":
          notification = new libBeckiNotifications.Info(notificationData.text);
          break;
        case "success":
          notification = new libBeckiNotifications.Success(notificationData.text);
          break;
        case "warning":
          notification = new libBeckiNotifications.Warning(notificationData.text);
          break;
        case "error":
          notification = new libBeckiNotifications.Danger(notificationData.text);
          break;
        default:
          return;
      }
      this.notifications.push(notification);
    });
  }

  getModalEventType():string {
    "use strict";

    if (this.modalEvent instanceof libBeckiModal.WidgetEvent) {
      return "widget";
    }
    if (this.modalEvent instanceof libBeckiModal.BlockEvent) {
      return "block";
    }
    return null;
  }

  getWidgetPropertyType(property:theGrid.Core.ConfigProperty):string {
    "use strict";

    switch (property.type) {
      case theGrid.Core.ConfigPropertyType.Integer:
        return "int";
      case theGrid.Core.ConfigPropertyType.Float:
        return "float";
      case theGrid.Core.ConfigPropertyType.String:
        return "text";
      case theGrid.Core.ConfigPropertyType.Boolean:
        return "bool";
      default:
        return null;
    }
  }

  getBlockPropertyType(property:blocko.BlockoCore.ConfigProperty):string {
    "use strict";

    switch (property.type) {
      case blocko.BlockoCore.ConfigPropertyType.Integer:
        return "int";
      case blocko.BlockoCore.ConfigPropertyType.Float:
        return "float";
      case blocko.BlockoCore.ConfigPropertyType.String:
        return "text";
      case blocko.BlockoCore.ConfigPropertyType.Boolean:
        return "bool";
      case blocko.BlockoCore.ConfigPropertyType.JSString:
        return "javascript";
      default:
        return null;
    }
  }

  onModalCloseClick():void {
    "use strict";

    this.modalEvent = null;
  }

  onModalEditClick():void {
    "use strict";

    if (this.modalEvent instanceof libBeckiModal.WidgetEvent) {
      (<libBeckiModal.WidgetEvent>this.modalEvent).widget.emitOnConfigsChanged();
    } else if (this.modalEvent instanceof libBeckiModal.BlockEvent) {
      (<libBeckiModal.BlockEvent>this.modalEvent).block.emitConfigsChanged();
    }
    this.modalEvent = null;
  }

  getNotification():libBeckiNotifications.Notification {
    "use strict";

    if (!this.notifications.length) {
      return null;
    }
    if (this.notificationTimeout == null) {
      this.notificationTimeout = setTimeout(this.onNotificationCloseClick.bind(this), 1000 * 8);
    }
    return this.notifications[0];
  }

  onNotificationCloseClick():void {
    "use strict";

    clearTimeout(this.notificationTimeout);
    this.notifications.shift();
    this.notificationTimeout = null;
  }
}
