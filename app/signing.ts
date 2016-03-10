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
import * as customValidator from "./custom-validator";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

const REDIRECT_URL = `${window.location.pathname}#`;

@ng.Component({
  templateUrl: "app/signing.html",
  directives: [customValidator.Directive, libPatternFlyNotifications.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  brand:string;

  signIn:boolean;

  inEmailField:string;

  inPasswordField:string;

  upEmailField:string;

  upPassword1Field:string;

  upPassword2Field:string;

  upUsernameField:string;

  redirecting:boolean;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.brand = becki.HOME.label;
    this.signIn = true;
    this.inEmailField = "";
    this.inPasswordField = "";
    this.upEmailField = "";
    this.upPassword1Field = "";
    this.upPassword2Field = "";
    this.upUsernameField = "";
    this.redirecting = false;
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    // TODO: https://groups.google.com/d/msg/angular/IJf-KyGC3Gs/h33mlUTrAwAJ
    document.documentElement.classList.add("login-pf");
  }

  onDestroy():void {
    "use strict";

    // TODO: https://groups.google.com/d/msg/angular/IJf-KyGC3Gs/h33mlUTrAwAJ
    document.documentElement.classList.remove("login-pf");
  }

  redirect(url:string):void {
    "use strict";

    this.redirecting = true;
    location.href = url;
  }

  onSignInClick():void {
    "use strict";

    this.signIn = true;
  }

  onSignInSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createToken(this.inEmailField, this.inPasswordField)
        .then(() => this.router.navigate(["Devices"]))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`The person cannot be signed in: ${reason}`)));
  }

  onFacebookSignInClick():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createFacebookToken(REDIRECT_URL)
        .then(url => this.redirect(url))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`The person cannot be signed in: ${reason}`)));
  }

  onGitHubSignInClick():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createGitHubToken(REDIRECT_URL)
        .then(url => this.redirect(url))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`The person cannot be signed in: ${reason}`)));
  }

  onSignUpClick():void {
    "use strict";

    this.signIn = false;
  }

  validateUpPasswordField():()=>Promise<boolean> {
    "use strict";

    return () => Promise.resolve(this.upPassword1Field == this.upPassword2Field);
  }

  onSignUpSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createPerson(this.upEmailField, this.upPassword1Field, this.upUsernameField)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The person have been signed up. It is necessary to follow the instructions sent to their email before signing in."));
          this.signIn = true;
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The person cannot be signed up: ${reason}`));
        });
  }
}
