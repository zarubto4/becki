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

import * as becki from "./index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiNotifications from "./lib-becki/notifications";

const REDIRECT_URL = `${window.location.pathname}#`;

@ng.Component({
  templateUrl: "app/signing.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiNotifications.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
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

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
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
    this.backEnd = backEnd;
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
        .then(() => this.router.navigate(becki.HOME.link))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("The user cannot be signed in.", reason)));
  }

  onFacebookSignInClick():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createFacebookToken(REDIRECT_URL)
        .then(url => this.redirect(url))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("The user cannot be signed in.", reason)));
  }

  onGitHubSignInClick():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createGitHubToken(REDIRECT_URL)
        .then(url => this.redirect(url))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("The user cannot be signed in.", reason)));
  }

  onSignUpClick():void {
    "use strict";

    this.signIn = false;
  }

  validateUpEmailField():()=>Promise<boolean> {
    "use strict";

    return () => {
      if (this.upEmailField) {
        return this.backEnd.getUserEmailUsed(this.upEmailField);
      } else {
        return Promise.resolve(true);
      }
    };
  }

  validateUpPasswordField():()=>Promise<boolean> {
    "use strict";

    return () => Promise.resolve(this.upPassword1Field == this.upPassword2Field);
  }

  validateUpUsernameField():()=>Promise<boolean> {
    "use strict";

    return () => {
      if (this.upUsernameField.length >= 9) {
        return this.backEnd.getUsernameUsed(this.upUsernameField);
      } else {
        return Promise.resolve(true);
      }
    };
  }

  onSignUpSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createUser(this.upEmailField, this.upPassword1Field, this.upUsernameField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The user have been signed up. It is necessary to follow the instructions sent to their email before signing in."));
          this.signIn = true;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The user cannot be signed up.", reason));
        });
  }
}
