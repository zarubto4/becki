/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as Rx from "rxjs";
import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/system-processor.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

  id:string;

  processor:libBackEnd.Processor;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  nameField:string;

  codeField:string;

  descriptionField:string;

  speedField:number;

  activatedRoute:ngRouter.ActivatedRoute;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  routeParamsSubscription:Rx.Subscription;

  constructor(@ngCore.Inject("home") home:string, activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("System", ["/system"]),
      new libBeckiLayout.LabeledLink("Processors", ["/system/processors"])
    ];
    this.editing = false;
    this.nameField = "Loading...";
    this.codeField = "Loading...";
    this.descriptionField = "Loading...";
    this.speedField = 0;
    this.activatedRoute = activatedRoute;
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = params["processor"];
      this.refresh();
    });
  }

  ngOnDestroy():void {
    "use strict";

    this.routeParamsSubscription.unsubscribe();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    this.backEnd.getProcessor(this.id)
        .then(processor => {
          this.breadcrumbs.push(new libBeckiLayout.LabeledLink(processor.processor_name, ["/system/processors", this.id]));
          this.breadcrumbs[3].label = processor.processor_name;
          this.processor = processor;
          this.nameField = processor.processor_name;
          this.codeField = processor.processor_code;
          this.descriptionField = processor.description;
          this.speedField = processor.speed;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The processor ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProcessors().then(processors => !processors.find(processor => processor.id != this.id && processor.processor_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateProcessor(this.id, this.nameField, this.codeField, this.descriptionField, this.speedField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The processor has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The processor cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }
}
