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

import * as backEnd from "./back-end";
import * as becki from "./index";
import * as libBootstrapDropdown from "./lib-bootstrap/dropdown";
import * as notifications from "./notifications";

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

@ng.Component({
  selector: "[layout]",
  templateUrl: "app/layout.html",
  directives: [libBootstrapDropdown.DIRECTIVES, notifications.Component, ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["heading: layout", "breadcrumbs", "actionLabel"]
})
export class Component implements ng.OnInit, ng.OnDestroy {

  home:LabeledLink;

  navbarState:string;

  navigation:LabeledLink[];

  @ng.Output()
  actionClick:ng.EventEmitter;

  lastWindowWidth:string;

  backEnd:backEnd.Service;

  notifications:notifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notificationsService:notifications.Service, router:ngRouter.Router) {
    "use strict";

    this.home = becki.HOME;
    this.navbarState = "expanded";
    this.navigation = becki.NAVIGATION;
    this.actionClick = new ng.EventEmitter();
    this.lastWindowWidth = null;
    this.backEnd = backEndService;
    this.notifications = notificationsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    // TODO: https://github.com/angular/angular/issues/4112
    // TODO: https://github.com/angular/angular/issues/7303
    if (!window.localStorage.getItem("authToken")) {
      this.router.navigate(["Signing"]);
    }
    this.onWindowResize();
    // TODO: https://groups.google.com/d/msg/angular/IJf-KyGC3Gs/h33mlUTrAwAJ
    document.documentElement.classList.add(...HTML_CLASSES);
  }

  onDestroy():void {
    "use strict";

    // TODO: https://groups.google.com/d/msg/angular/IJf-KyGC3Gs/h33mlUTrAwAJ
    document.documentElement.classList.remove(...HTML_CLASSES);
  }

  onSignOutClick():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteToken()
        .then(() => {
          this.notifications.next.push(new notifications.Success("Current user have been signed out."));
          this.router.navigate(["Signing"]);
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

  @ng.HostListener("window:resize")
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
