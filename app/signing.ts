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

@ng.Component({
  templateUrl: "app/signing.html",
  directives: [ng.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ng.AfterViewInit {

  appName:string;

  inEmailField:string;

  inPasswordField:string;

  upEmailField:string;

  upPasswordField:string;

  upUsernameField:string;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("appName") appName:string, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.appName = appName;
    this.inEmailField = "";
    this.inPasswordField = "";
    this.upEmailField = "";
    this.upPasswordField = "";
    this.upUsernameField = "";
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

    this.backEnd.createToken(this.inEmailField, this.inPasswordField)
        .then(message => {
          this.events.send(message);
          this.router.navigate(["Devices"]);
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onFacebookSignInClick():void {
    "use strict";

    this.backEnd.createFacebookToken()
        .then(url => {
          this.events.send(url);
          location.href = url;
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onGitHubSignInClick():void {
    "use strict";

    this.backEnd.createGitHubToken()
        .then(url => {
          this.events.send(url);
          location.href = url;
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onSignUpSubmit():void {
    "use strict";

    this.backEnd.createPerson(this.upEmailField, this.upPasswordField, this.upUsernameField)
        .then(message => {
          this.events.send(message);
          (<any>$("#signing-in")).collapse("show");
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }
}
