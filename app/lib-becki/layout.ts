/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as backEnd from "./back-end";
import * as notifications from "./notifications";
import * as libBackEnd from "../lib-back-end/index";
import * as libBootstrapDropdown from "../lib-bootstrap/dropdown";

const HTML_CLASSES = ["layout-pf", "layout-pf-fixed"];

export class LabeledLink {

  label:string;

  link:any[];

  icon:string;

  constructor(label:string, link:any[], icon="file") {
    "use strict";

    this.label = label;
    this.link = link;
    this.icon = icon;
  }
}

@ngCore.Component({
  selector: "[layout]",
  templateUrl: "app/lib-becki/layout.html",
  directives: [libBootstrapDropdown.DIRECTIVES, notifications.Component, ngCommon.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["heading: layout", "breadcrumbs", "actionLabel"]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

  home:LabeledLink;

  navbarNotificationsPage:number;

  navbarNotifications:libBackEnd.NotificationsCollection;

  navbarState:string;

  connections:any[];

  signing:any[];

  navigation:LabeledLink[];

  @ngCore.Output()
  actionClick:ngCore.EventEmitter<void>;

  lastWindowWidth:string;

  backEnd:backEnd.Service;

  notifications:notifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:LabeledLink, @ngCore.Inject("connections") connections:any[], @ngCore.Inject("signing") signing:any[], @ngCore.Inject("navigation") navigation:LabeledLink[], backEndService:backEnd.Service, notificationsService:notifications.Service, router:ngRouter.Router) {
    "use strict";

    this.home = home;
    this.navbarNotificationsPage = 0;
    this.navbarState = "expanded";
    this.connections = connections;
    this.signing = signing;
    this.navigation = navigation;
    this.actionClick = new ngCore.EventEmitter<void>();
    this.lastWindowWidth = null;
    this.backEnd = backEndService;
    this.notifications = notificationsService;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.onWindowResize();
    // TODO: https://groups.google.com/d/msg/angular/IJf-KyGC3Gs/h33mlUTrAwAJ
    document.documentElement.classList.add(...HTML_CLASSES);
  }

  ngOnDestroy():void {
    "use strict";

    // TODO: https://groups.google.com/d/msg/angular/IJf-KyGC3Gs/h33mlUTrAwAJ
    document.documentElement.classList.remove(...HTML_CLASSES);
  }

  showNotifications(page:number):void {
    "use strict";

    this.backEnd.getNotifications(page)
        .then(notifications => {
          this.navbarNotificationsPage = page;
          this.navbarNotifications = notifications;
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("Notifications cannot be loaded.", reason));
        });
  }

  onNotificationsClick():void {
    "use strict";

    this.notifications.shift();
    this.showNotifications(0);
  }

  getNotificationIcon(notification:libBackEnd.Notification):string {
    "use strict";

    switch (notification.level) {
      case "success":
        return "ok";
      case "warning":
        return "warning-triangle-o";
      case "error":
        return "error-circle-o";
      default:
        return "info";
    }
  }

  onShowNotificationsClick(page:number, event:Event):void {
    "use strict";

    this.notifications.shift();
    this.showNotifications(page);
    event.stopPropagation();
  }

  onConnectionsClick():void {
    "use strict";

    this.router.navigate(this.connections);
  }

  onSignOutClick():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteToken()
        .then(() => {
          this.notifications.next.push(new notifications.Success("Current user have been signed out."));
          this.router.navigate(this.signing);
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("Current user cannot be signed out.", reason));
        });
  }

  onActionClick():void {
    "use strict";

    this.actionClick.next(null);
  }

  onNavbarToggleClick():void {
    "use strict";

    const DICTIONARY:{[state: string]: string} = {
      expanded: "collapsed",
      collapsed: "expanded",
      visible: "hidden",
      hidden: "visible"
    };
    this.navbarState = DICTIONARY[this.navbarState];
  }

  @ngCore.HostListener("window:resize")
  onWindowResize():void {
    "use strict";

    let width = window.innerWidth;
    let widthString = "desktop";
    if (width < 768) {
      widthString = "phone";
    } else if (width < 992) {
      widthString = "tablet";
    }

    if (widthString != this.lastWindowWidth) {
      const DICTIONARY:{[width: string]: string} = {
        phone: "hidden",
        tablet: "collapsed",
        desktop: "expanded"
      };
      this.navbarState = DICTIONARY[widthString];
    }

    this.lastWindowWidth = widthString;
  }
}
