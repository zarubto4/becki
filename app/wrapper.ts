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
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";

export class LabeledLink {

  label:string;

  link:any[];

  constructor(label:string, link:any[]) {
    "use strict";

    this.label = label;
    this.link = link;
  }
}

@ng.Component({
  selector: "[wrapper]",
  templateUrl: "app/wrapper.html",
  directives: [libBootstrapAlerts.Component, ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["heading: wrapper", "breadcrumbs"]
})
export class Component implements ng.OnInit {

  home:LabeledLink;

  navigation:LabeledLink[];

  user:string;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";
    this.home = becki.HOME;
    this.navigation = becki.NAVIGATION;
    this.user = "Loading...";
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    // TODO https://github.com/angular/angular/issues/4112
    if (!window.localStorage.getItem("authToken")) {
      this.router.navigate(["Signing"]);
    }
    this.backEnd.getSignedInPerson()
        .then(person => this.user = libBackEnd.composePersonString(person) || "User")
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Details about current user cannot be loaded: ${reason}`)));
  }

  onSignOutClick():void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-65
    this.backEnd.deleteToken()
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("Current user have been signed out."));
          this.router.navigate(["Signing"]);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`Current user cannot be signed out: ${reason}`));
        });
  }
}
