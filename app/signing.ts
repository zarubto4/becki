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
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";

@ng.Component({
  templateUrl: "app/signing.html",
  directives: [libBootstrapAlerts.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ng.AfterViewInit, ng.OnInit {

  appName:string;

  inEmailField:string;

  inPasswordField:string;

  upEmailField:string;

  upPasswordField:string;

  upUsernameField:string;

  progress:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("appName") appName:string, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.appName = appName;
    this.inEmailField = "";
    this.inPasswordField = "";
    this.upEmailField = "";
    this.upPasswordField = "";
    this.upUsernameField = "";
    this.progress = 0;
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
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

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.createToken(this.inEmailField, this.inPasswordField)
        .then(() => this.router.navigate(["Devices"]))
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`The person cannot be signed in: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onFacebookSignInClick():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.createFacebookToken()
        .then(url => location.href = url)
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`The person cannot be signed in: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onGitHubSignInClick():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.createGitHubToken()
        .then(url => location.href = url)
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`The person cannot be signed in: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onSignUpSubmit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.createPerson(this.upEmailField, this.upPasswordField, this.upUsernameField)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The person have been signed up."));
          (<any>$("#signing-in")).collapse("show");
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The person cannot be signed up: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }
}
