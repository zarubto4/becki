/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
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

import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/system-processor-new.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  nameField:string;

  codeField:string;

  descriptionField:string;

  speedField:number;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["System"]),
      new libBeckiLayout.LabeledLink("New Processor", ["NewSystemProcessor"])
    ];
    this.nameField = "";
    this.codeField = "";
    this.descriptionField = "";
    this.speedField = 0;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProcessors().then(processors => !processors.find(processor => processor.processor_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createProcessor(this.nameField, this.codeField, this.descriptionField, this.speedField)
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The processor has been created."));
          this.router.navigate(["System"]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-211
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-211"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The processor cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["System"]);
  }
}
