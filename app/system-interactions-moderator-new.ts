/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/system-interactions-moderator-new.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.FORM_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  idField:string;

  typeField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["System"]),
      new libBeckiLayout.LabeledLink("New Moderator of Interactions", ["NewSystemInteractionsModerator"])
    ];
    this.idField = "";
    this.typeField = "";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-155
    this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-155"));
  }

  validateIdField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-155
    return () => Promise.resolve(true);
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createInteractionsModerator(this.idField, this.typeField)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The moderator have been created."));
          this.router.navigate(["System"]);
        })
        .catch((reason) => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-220
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-220"));
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-285
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-285"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The moderator cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["System"]);
  }
}
