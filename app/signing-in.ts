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
import * as events from "./events";
import * as libAdminlteFields from './lib-adminlte/fields';

@ng.Component({
  templateUrl: "app/lib-adminlte/login.html",
  directives: [libAdminlteFields.Component, ng.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES]
})
export class Component {

  appName:string;

  fields:libAdminlteFields.Field[];

  newUserLink:any[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("appName") appName:string, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.appName = appName;
    this.fields = [
      new libAdminlteFields.Field("Email:", ""),
      new libAdminlteFields.Field("Password:", "", "password")
    ];
    this.newUserLink = ["NewUser"];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onSubmit():void {
    "use strict";

    this.backEnd.createToken(this.fields[0].model, this.fields[1].model)
        .then((message) => {
          this.events.send(message);
          this.router.navigate(["Devices"]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onFacebookClick():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-38
  }

  onGoogleClick():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-38
  }
}
