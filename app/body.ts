/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as blocko from "blocko";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";
import * as theGrid from "the-grid";

import * as applicationDevice from "./application-device";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiFieldCode from "./lib-becki/field-code";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiModal from "./lib-becki/modal";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as signing from "./signing";
import * as system from "./system";
import * as systemCompilationServer from "./system-compilation-server";
import * as systemCompilationServerNew from "./system-compilation-server-new";
import * as systemDeviceNew from "./system-device-new";
import * as systemDeviceType from "./system-device-type";
import * as systemDeviceTypeNew from "./system-device-type-new";
import * as systemInteractionsModeratorNew from "./system-interactions-moderator-new";
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
import * as userApplicationsVision from "./user-applications-vision";
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

@ngRouter.RouteConfig([
  {path: "/application/devices/:device", component: applicationDevice.Component, as: "ApplicationDevice"},
  {path: "/signing", component: signing.Component, as: "Signing"},
  {path: "/system", component: system.Component, as: "System"},
  {path: "/system/compilation/server/new", component: systemCompilationServerNew.Component, as: "NewSystemCompilationServer"},
  {path: "/system/compilation/servers/:server", component: systemCompilationServer.Component, as: "SystemCompilationServer"},
  {path: "/system/device/new", component: systemDeviceNew.Component, as: "NewSystemDevice"},
  {path: "/system/device/type/new", component: systemDeviceTypeNew.Component, as: "NewSystemDeviceType"},
  {path: "/system/device/types/:type", component: systemDeviceType.Component, as: "SystemDeviceType"},
  {path: "/system/interactions/moderator/new", component: systemInteractionsModeratorNew.Component, as: "NewSystemInteractionsModerator"},
  {path: "/system/interactions/server/new", component: systemInteractionsServerNew.Component, as: "NewSystemInteractionsServer"},
  {path: "/system/interactions/servers/:server", component: systemInteractionsServer.Component, as: "SystemInteractionsServer"},
  {path: "/system/libraries/:library", component: systemLibrary.Component, as: "SystemLibrary"},
  {path: "/system/library/group/new", component: systemLibraryGroupNew.Component, as: "NewSystemLibraryGroup"},
  {path: "/system/library/groups/:group", component: systemLibraryGroup.Component, as: "SystemLibraryGroup"},
  {path: "/system/library/new", component: systemLibraryNew.Component, as: "NewSystemLibrary"},
  {path: "/system/processor/new", component: systemProcessorNew.Component, as: "NewSystemProcessor"},
  {path: "/system/processors/:processor", component: systemProcessor.Component, as: "SystemProcessor"},
  {path: "/system/producer/new", component: systemProducerNew.Component, as: "NewSystemProducer"},
  {path: "/system/producers/:producer", component: systemProducer.Component, as: "SystemProducer"},
  {path: "/user/application/device/new", component: userApplicationDeviceNew.Component, as: "NewUserApplicationDevice"},
  {path: "/user/application/group/new", component: userApplicationGroupNew.Component, as: "NewUserApplicationGroup"},
  {path: "/user/application/groups/:group", component: userApplicationGroup.Component, as: "UserApplicationGroup"},
  {path: "/user/application/new", component: userApplicationNew.Component, as: "NewUserApplication"},
  {path: "/user/application/vision", component: userApplicationsVision.Component, as: "UserApplicationsVision"},
  {path: "/user/applications", component: userApplications.Component, as: "UserApplications", useAsDefault: true},
  {path: "/user/applications/:application", component: userApplication.Component, as: "UserApplication"},
  {path: "/user/connections", component: userConnections.Component, as: "UserConnections"},
  {path: "/user/device/new", component: userDeviceNew.Component, as: "NewUserDevice"},
  {path: "/user/device/program/new", component: userDeviceProgramNew.Component, as: "NewUserDeviceProgram"},
  {path: "/user/device/programs/:program", component: userDeviceProgram.Component, as: "UserDeviceProgram"},
  {path: "/user/devices", component: userDevices.Component, as: "UserDevices"},
  {path: "/user/interactions", component: userInteractions.Component, as: "UserInteractions"},
  {path: "/user/interactions/block/new", component: userInteractionsBlockNew.Component, as: "NewUserInteractionsBlock"},
  {path: "/user/interactions/blocks/:block", component: userInteractionsBlock.Component, as: "UserInteractionsBlock"},
  {path: "/user/interactions/moderator/new", component: userInteractionsModeratorNew.Component, as: "NewUserInteractionsModerator"},
  {path: "/user/interactions/scheme/new", component: userInteractionsSchemeNew.Component, as: "NewUserInteractionsScheme"},
  {path: "/user/interactions/schemes/:scheme", component: userInteractionsScheme.Component, as: "UserInteractionsScheme"},
  {path: "/user/interactions/schemes/:scheme/versions/:version", component: userInteractionsSchemeVersion.Component, as: "UserInteractionsSchemeVersion"},
  {path: "/user/interactions/spies/:spy", component: userInteractionsSpy.Component, as: "UserInteractionsSpy"},
  {path: "/user/project/new", component: userProjectNew.Component, as: "NewUserProject"},
  {path: "/user/projects", component: userProjects.Component, as: "UserProjects"},
  {path: "/user/projects/:project", component: userProject.Component, as: "UserProject"},
  {path: "/user/projects/:project/collaborator/new", component: userProjectCollaboratorNew.Component, as: "NewUserProjectCollaborator"},
  {path: "/users/:user", component: user.Component, as: "User"},
])
@ngCore.Component({
  selector: "[body]",
  templateUrl: "app/body.html",
  providers: [
    libBeckiBackEnd.Service,
    ngCore.provide(libBeckiModal.Component, {useExisting: ngCore.forwardRef(() => Component)}),
    libBeckiNotifications.Service,
    ngCore.provide("connections", {useValue: ["UserConnections"]}),
    ngCore.provide("home", {useValue: new libBeckiLayout.LabeledLink("No Name", ["UserApplications"])}),
    ngCore.provide("navigation", {
      useValue: [
        new libBeckiLayout.LabeledLink("Applications", ["UserApplications"], "mobile"),
        new libBeckiLayout.LabeledLink("Applications (Vision)", ["UserApplicationsVision"], "mobile"),
        new libBeckiLayout.LabeledLink("Interactions", ["UserInteractions"], "link"),
        new libBeckiLayout.LabeledLink("Devices", ["UserDevices"], "rocket"),
        new libBeckiLayout.LabeledLink("Projects", ["UserProjects"], "book"),
        new libBeckiLayout.LabeledLink("System", ["System"], "globe")
      ]
    }),
    ngCore.provide("signing", {useValue: ["Signing"]})
  ],
  directives: [libBeckiFieldCode.Component, ngCommon.CORE_DIRECTIVES, ngCommon.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["body"],
  host: {"[class.modal-open]": "modalEvent"}
})
export class Component implements libBeckiModal.Component {

  public modalEvent:libBeckiModal.Event;

  public router:ngRouter.Router;

  private notifications:libBeckiNotifications.Notification[];

  private notificationTimeout:number;

  constructor(router:ngRouter.Router, backEnd:libBeckiBackEnd.Service) {
    "use strict";

    this.modalEvent = null;
    this.router = router;
    this.notifications = [];
    this.notificationTimeout = null;
    backEnd.notificationReceived.subscribe(notification => {
      let notificationView:libBeckiNotifications.Notification;
      switch (notification.level) {
        case "info":
          notificationView = new libBeckiNotifications.Info(notification.text);
          break;
        case "success":
          notificationView = new libBeckiNotifications.Success(notification.text);
          break;
        case "warning":
          notificationView = new libBeckiNotifications.Warning(notification.text);
          break;
        case "error":
          notificationView = new libBeckiNotifications.Danger(notification.text);
          break;
        default:
          return;
      }
      this.notifications.push(notificationView);
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
