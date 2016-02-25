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
import * as customValidator from "./custom-validator";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/signing.html",
  directives: [customValidator.Directive, libPatternFlyNotifications.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  appName:string;

  signIn:boolean;

  inEmailField:string;

  inPasswordField:string;

  upEmailField:string;

  upPassword1Field:string;

  upPassword2Field:string;

  upUsernameField:string;

  progress:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("appName") appName:string, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.appName = appName;
    this.signIn = true;
    this.inEmailField = "";
    this.inPasswordField = "";
    this.upEmailField = "";
    this.upPassword1Field = "";
    this.upPassword2Field = "";
    this.upUsernameField = "";
    this.progress = 0;
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

  onSignInClick():void {
    "use strict";

    this.signIn = true;
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
        .then(url => {
          location.href = url;
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The person cannot be signed in: ${reason}`));
          this.progress -= 1;
        });
  }

  onGitHubSignInClick():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.createGitHubToken()
        .then(url => {
          location.href = url;
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The person cannot be signed in: ${reason}`));
          this.progress -= 1;
        });
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
    this.progress += 1;
    this.backEnd.createPerson(this.upEmailField, this.upPassword1Field, this.upUsernameField)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The person have been signed up."));
          this.signIn = true;
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The person cannot be signed up: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }
}
