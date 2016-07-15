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
import * as libBootstrapModal from "./lib-bootstrap/modal";
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

@ngRouter.RouteConfig([
  {path: "/application/devices/:device", component: applicationDevice.Component, name: "ApplicationDevice"},
  {path: "/signing", component: signing.Component, name: "Signing"},
  {path: "/system", component: system.Component, name: "System"},
  {path: "/user/interactions/block/groups/:group", component: userInteractionsBlockGroup.Component, name: "UserInteractionsBlockGroup"},
  {path: "/user/interactions/block/group/new", component: userInteractionsBlockGroupNew.Component, name: "UserInteractionsBlockGroupNew"},
  {path: "/system/compilation/server/new", component: systemCompilationServerNew.Component, name: "NewSystemCompilationServer"},
  {path: "/system/compilation/servers/:server", component: systemCompilationServer.Component, name: "SystemCompilationServer"},
  {path: "/system/device/new", component: systemDeviceNew.Component, name: "NewSystemDevice"},
  {path: "/system/device/type/new", component: systemDeviceTypeNew.Component, name: "NewSystemDeviceType"},
  {path: "/system/device/types/:type", component: systemDeviceType.Component, name: "SystemDeviceType"},
  {path: "/system/interactions/server/new", component: systemInteractionsServerNew.Component, name: "NewSystemInteractionsServer"},
  {path: "/system/interactions/servers/:server", component: systemInteractionsServer.Component, name: "SystemInteractionsServer"},
  {path: "/system/libraries/:library", component: systemLibrary.Component, name: "SystemLibrary"},
  {path: "/system/library/group/new", component: systemLibraryGroupNew.Component, name: "NewSystemLibraryGroup"},
  {path: "/system/library/groups/:group", component: systemLibraryGroup.Component, name: "SystemLibraryGroup"},
  {path: "/system/library/new", component: systemLibraryNew.Component, name: "NewSystemLibrary"},
  {path: "/system/processor/new", component: systemProcessorNew.Component, name: "NewSystemProcessor"},
  {path: "/system/processors/:processor", component: systemProcessor.Component, name: "SystemProcessor"},
  {path: "/system/producer/new", component: systemProducerNew.Component, name: "NewSystemProducer"},
  {path: "/system/producers/:producer", component: systemProducer.Component, name: "SystemProducer"},
  {path: "/user/application/device/new", component: userApplicationDeviceNew.Component, name: "NewUserApplicationDevice"},
  {path: "/user/application/group/new", component: userApplicationGroupNew.Component, name: "NewUserApplicationGroup"},
  {path: "/user/application/groups/:group", component: userApplicationGroup.Component, name: "UserApplicationGroup"},
  {path: "/user/application/new", component: userApplicationNew.Component, name: "NewUserApplication"},
  {path: "/user/applications", component: userApplications.Component, name: "UserApplications", useAsDefault: true},
  {path: "/user/applications/:application", component: userApplication.Component, name: "UserApplication"},
  {path: "/user/connections", component: userConnections.Component, name: "UserConnections"},
  {path: "/user/device/new", component: userDeviceNew.Component, name: "NewUserDevice"},
  {path: "/user/device/program/new", component: userDeviceProgramNew.Component, name: "NewUserDeviceProgram"},
  {path: "/user/device/programs/:program", component: userDeviceProgram.Component, name: "UserDeviceProgram"},
  {path: "/user/devices", component: userDevices.Component, name: "UserDevices"},
  {path: "/user/interactions", component: userInteractions.Component, name: "UserInteractions"},
  {path: "/user/interactions/block/new", component: userInteractionsBlockNew.Component, name: "NewUserInteractionsBlock"},
  {path: "/user/interactions/blocks/:block", component: userInteractionsBlock.Component, name: "UserInteractionsBlock"},
  {path: "/user/interactions/moderator/new", component: userInteractionsModeratorNew.Component, name: "NewUserInteractionsModerator"},
  {path: "/user/interactions/scheme/new", component: userInteractionsSchemeNew.Component, name: "NewUserInteractionsScheme"},
  {path: "/user/interactions/schemes/:scheme", component: userInteractionsScheme.Component, name: "UserInteractionsScheme"},
  {path: "/user/interactions/schemes/:scheme/versions/:version", component: userInteractionsSchemeVersion.Component, name: "UserInteractionsSchemeVersion"},
  {path: "/user/interactions/spies/:spy", component: userInteractionsSpy.Component, name: "UserInteractionsSpy"},
  {path: "/user/project/new", component: userProjectNew.Component, name: "NewUserProject"},
  {path: "/user/projects", component: userProjects.Component, name: "UserProjects"},
  {path: "/user/projects/:project", component: userProject.Component, name: "UserProject"},
  {path: "/user/projects/:project/collaborator/new", component: userProjectCollaboratorNew.Component, name: "NewUserProjectCollaborator"},
  {path: "/users/:user", component: user.Component, name: "User"},
  {path: "/user/projects/edit/:project", component: userProjectEdit.Component, name: "UserProjectEdit"},
])
@ngCore.Component({
  selector: "[body]",
  templateUrl: "app/body.html",
  providers: [
    libBeckiBackEnd.Service,
    {provide: libBootstrapModal.Component, useExisting: ngCore.forwardRef(() => Component)},
    libBeckiNotifications.Service,
    {provide: "connections", useValue: ["UserConnections"]},
    {provide: "home", useValue: new libBeckiLayout.LabeledLink("No Name", ["UserApplications"])},
    {provide: "navigation", useValue: [
      new libBeckiLayout.LabeledLink("Projects", ["UserProjects"], "book"),
      new libBeckiLayout.LabeledLink("Applications", ["UserApplications"], "mobile"),
      new libBeckiLayout.LabeledLink("Interactions", ["UserInteractions"], "link"),
      new libBeckiLayout.LabeledLink("Devices", ["UserDevices"], "rocket"),
      new libBeckiLayout.LabeledLink("System", ["System"], "globe")
    ]},
    {provide: "signing", useValue: ["Signing"]}
  ],
  directives: [libBeckiFieldCode.Component, ngCommon.CORE_DIRECTIVES, ngCommon.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["body"],
  host: {"[class.modal-open]": "modal"}
})
export class Component implements libBootstrapModal.Component {

  private modal:libBootstrapModal.Model;

  private modalClosed:ngCore.EventEmitter<boolean>;

  public router:ngRouter.Router;

  private notifications:libBeckiNotifications.Notification[];

  private notificationTimeout:number;

  constructor(router:ngRouter.Router, backEnd:libBeckiBackEnd.Service) {
    "use strict";

    this.modal = null;
    this.modalClosed = new ngCore.EventEmitter<boolean>();
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

  showModal(model:libBootstrapModal.Model):Promise<boolean> {
    "use strict";

    if (this.modal) {
      throw "only one modal supported yet";
    }
    this.modal = model;
    return new Promise(resolve => this.modalClosed.subscribe(resolve));
  }

  closeModal(result:boolean):void {
    "use strict";

    this.modal = null;
    this.modalClosed.emit(result);
  }

  getModalType():string {
    "use strict";

    if (this.modal instanceof libBootstrapModal.RemovalModel) {
      return "removal";
    }
    if (this.modal instanceof libBeckiModal.WidgetModel) {
      return "widget";
    }
    if (this.modal instanceof libBeckiModal.BlockModel) {
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

  onModalCloseClick(result:boolean):void {
    "use strict";

    this.closeModal(result);
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
