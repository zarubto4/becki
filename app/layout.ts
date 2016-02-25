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
// TODO: https://github.com/patternfly/patternfly/pull/195

import * as ng from "angular2/angular2";
import * as ngRouter from "angular2/router";

import * as backEnd from "./back-end";
import * as becki from "./index";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

const HTML_CLASSES = ["layout-pf-alt", "layout-pf-alt-fixed", "layout-pf-alt-fixed-with-footer"];

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
  directives: [libPatternFlyNotifications.Component, ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["heading: layout", "breadcrumbs"]
})
export class Component implements ng.OnInit, ng.OnDestroy {

  home:any[];

  dropdownOpen:boolean;

  navbarState:string;

  navigation:LabeledLink[];

  lastWindowWidth:string;

  progress:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.home = becki.HOME.link;
    this.dropdownOpen = false;
    this.navbarState = "expanded";
    this.navigation = becki.NAVIGATION;
    this.lastWindowWidth = null;
    this.progress = 0;
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    // TODO https://github.com/angular/angular/issues/4112
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

  onDropdownClick(event:Event):void {
    "use strict";

    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }

  onSignOutClick():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-65
    this.backEnd.deleteToken()
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("Current user have been signed out."));
          this.router.navigate(["Signing"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`Current user cannot be signed out: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  @ng.HostListener("document:click")
  onDocumentClick():void {
    "use strict";

    this.dropdownOpen = false;
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
