/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as blocko from "blocko";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";
import * as theGrid from "the-grid";

import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiFieldCode from "./lib-becki/field-code";
import * as libBeckiModal from "./lib-becki/modal";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libBootstrapModal from "./modals/modal";
import {ModalsProjectNewComponent, ModalsProjectsNewModel} from "./modals/projects-new";


@ngCore.Component({
  selector: "[body]",
  templateUrl: "app/body.html",
  providers: [
    libBeckiBackEnd.Service,
    {provide: libBootstrapModal.Component, useExisting: ngCore.forwardRef(() => Component)},
    libBeckiNotifications.Service,
    {provide: "home", useValue: "No Name"}
  ],
  directives: [libBeckiFieldCode.Component, ngCommon.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, ModalsProjectNewComponent],
  inputs: ["body"],
  host: {"[class.modal-open]": "modal"}
})
export class Component implements libBootstrapModal.Component {

  private modal:libBootstrapModal.Model;

  private modalClosed:ngCore.EventEmitter<boolean>;

  //public spinnerVisible:boolean;

  private notifications:libBeckiNotifications.Notification[];

  private notificationTimeout:number;

  constructor(router:ngRouter.Router, backEnd:libBeckiBackEnd.Service) {
    "use strict";

    this.modal = null;
    this.modalClosed = new ngCore.EventEmitter<boolean>();
    //this.spinnerVisible = false;
    this.notifications = [];
    this.notificationTimeout = null;
    /*router.events.subscribe(event => {
      if (event instanceof ngRouter.NavigationStart) {
        this.spinnerVisible = false;
      } else if (event instanceof ngRouter.NavigationEnd || event instanceof ngRouter.NavigationCancel || event instanceof ngRouter.NavigationError) {
        this.spinnerVisible = false;
      }
    });*/
    backEnd.notificationReceived.subscribe(notification => {
      let notificationView:libBeckiNotifications.Notification;
      if(notification.status!=null){
        switch (notification.status){
          case "success":
            notificationView = new libBeckiNotifications.Success(notification.messageId);
                break;
          case "error":
            notificationView = new libBeckiNotifications.Danger(notification.reason);


        }
      }else {
        switch (notification.notification_level) {
          case "info":
            notificationView = new libBeckiNotifications.Info(notification.messageId);
            break;
          case "success":
            notificationView = new libBeckiNotifications.Success(notification.messageId);
            break;
          case "warning":
            notificationView = new libBeckiNotifications.Warning(notification.messageId);
            break;
          case "error":
            notificationView = new libBeckiNotifications.Danger(notification.messageId);
            break;
          default:
            return;
        }
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

    if (this.modal instanceof libBootstrapModal.SelectionModel) {
      return "selection";
    }
    if (this.modal instanceof libBootstrapModal.RemovalModel) {
      return "removal";
    }
    if (this.modal instanceof libBootstrapModal.FilenameModel) {
      return "filename";
    }
    if (this.modal instanceof libBeckiModal.WidgetModel) {
      return "widget";
    }
    if (this.modal instanceof libBeckiModal.BlockModel) {
      return "block";
    }
    if (this.modal instanceof ModalsProjectsNewModel) {
      return "modals-projects-new";
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
