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
import * as form from "./form";
import * as libBootstrapFields from "./lib-bootstrap/fields";

@ng.Component({
  templateUrl: "app/signing.html",
  directives: [form.Component, libBootstrapFields.Component, ng.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ng.AfterViewInit {

  appName:string;

  signInFields:libBootstrapFields.Field[];

  signUpFields:libBootstrapFields.Field[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("appName") appName:string, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.appName = appName;
    this.signInFields = [
      new libBootstrapFields.Field("Email", "", "email", "glyphicon-envelope"),
      new libBootstrapFields.Field("Password", "", "password", "glyphicon-lock")
    ];
    this.signUpFields = [
      new libBootstrapFields.Field("Email", "", "email", "glyphicon-envelope"),
      new libBootstrapFields.Field("Password", "", "password", "glyphicon-lock")
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  afterViewInit():void {
    "use strict";

    // See https://github.com/twbs/bootstrap/issues/16360#issuecomment-96271746
    (<any>$("#signing .collapse")).collapse({
      parent: "#signing",
      toggle: false
    });
  }

  onSignInSubmit():void {
    "use strict";

    this.backEnd.createToken(this.signInFields[0].model, this.signInFields[1].model)
        .then((message) => {
          this.events.send(message);
          this.router.navigate(["Devices"]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onOpenidSignInClick():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-38
  }

  onFacebookSignInClick():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-38
  }

  onGoogleSignInClick():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-38
  }

  onSignUpSubmit():void {
    "use strict";

    this.backEnd.createPerson(this.signUpFields[0].model, this.signUpFields[1].model)
        .then((message) => {
          this.events.send(message);
          (<any>$("#signing-in")).collapse("show");
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }
}
