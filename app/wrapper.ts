/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
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
import * as events from "./events";
import * as libAdminlteWrapper from "./lib-adminlte/wrapper";

@ng.Component({
  selector: "[wrapper]",
  templateUrl: "app/lib-adminlte/wrapper.html",
  directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["heading: wrapper", "breadcrumbs"]
})
export class Component implements ng.OnInit {

  home:libAdminlteWrapper.LabeledLink;

  navigation:libAdminlteWrapper.LabeledLink[];

  email:string;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";
    this.home = becki.HOME;
    this.navigation = becki.NAVIGATION;
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    // TODO https://github.com/angular/angular/issues/4112
    if (this.backEnd.authEmail === null) {
      this.router.navigate(["SigningIn"]);
    }
    this.email = this.backEnd.authEmail;
  }

  onSignOutClick():void {
    "use strict";

    this.backEnd.deleteToken()
        .then((message) => {
          this.events.send(message);
          this.router.navigate(["SigningIn"]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }
}
