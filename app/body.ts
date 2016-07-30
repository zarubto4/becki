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
import * as libBootstrapModal from "./lib-bootstrap/modal";

@ngCore.Component({
  selector: "[body]",
  templateUrl: "app/body.html",
  providers: [
    libBeckiBackEnd.Service,
    {provide: libBootstrapModal.Component, useExisting: ngCore.forwardRef(() => Component)},
    libBeckiNotifications.Service,
    {provide: "home", useValue: "No Name"}
  ],
  directives: [libBeckiFieldCode.Component, ngCommon.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["body"],
  host: {"[class.modal-open]": "modal"}
})
export class Component implements libBootstrapModal.Component {

  private modal:libBootstrapModal.Model;

  private modalClosed:ngCore.EventEmitter<boolean>;

  public spinnerVisible:boolean;

  private notifications:libBeckiNotifications.Notification[];

  private notificationTimeout:number;

  constructor(router:ngRouter.Router, backEnd:libBeckiBackEnd.Service) {
    "use strict";

    this.modal = null;
    this.modalClosed = new ngCore.EventEmitter<boolean>();
    this.spinnerVisible = false;
    this.notifications = [];
    this.notificationTimeout = null;
    router.events.subscribe(event => {
      if (event instanceof ngRouter.NavigationStart) {
        this.spinnerVisible = true;
      } else if (event instanceof ngRouter.NavigationEnd || event instanceof ngRouter.NavigationCancel || event instanceof ngRouter.NavigationError) {
        this.spinnerVisible = false;
      }
    });
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
