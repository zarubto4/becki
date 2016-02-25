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
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/signing.html",
  directives: [libPatternFlyNotifications.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ng.OnInit {

  appName:string;

  inCollapsed:boolean;

  inEmailField:string;

  inPasswordField:string;

  upCollapsed:boolean;

  upEmailField:string;

  upPasswordField:string;

  upUsernameField:string;

  progress:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("appName") appName:string, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.appName = appName;
    this.inCollapsed = false;
    this.inEmailField = "";
    this.inPasswordField = "";
    this.upCollapsed = true;
    this.upEmailField = "";
    this.upPasswordField = "";
    this.upUsernameField = "";
    this.progress = 0;
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
  }

  onSignInClick():void {
    "use strict";

    this.inCollapsed = !this.inCollapsed;
  }

  onSignInSubmit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.createToken(this.inEmailField, this.inPasswordField)
        .then(() => this.router.navigate(["Devices"]))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`The person cannot be signed in: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onFacebookSignInClick():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.createFacebookToken()
        .then(url => location.href = url)
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`The person cannot be signed in: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onGitHubSignInClick():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.createGitHubToken()
        .then(url => location.href = url)
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`The person cannot be signed in: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onSignUpClick():void {
    "use strict";

    this.upCollapsed = !this.upCollapsed;
  }

  onSignUpSubmit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.createPerson(this.upEmailField, this.upPasswordField, this.upUsernameField)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The person have been signed up."));
          this.inCollapsed = false;
          this.upCollapsed = true;
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The person cannot be signed up: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }
}
