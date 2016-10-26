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
  templateUrl: "app/system-producer.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

  id:string;

  producer:libBackEnd.Producer;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  editProducer:boolean;

  nameField:string;

  descriptionField:string;

  activatedRoute:ngRouter.ActivatedRoute;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  routeParamsSubscription:Rx.Subscription;

  constructor(@ngCore.Inject("home") home:string, activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("System", ["/system"]),
      new libBeckiLayout.LabeledLink("Producers", ["/system/producers"])
    ];
    this.editing = false;
    this.editProducer = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.activatedRoute = activatedRoute;
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
      this.id = params["producer"];
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
    this.backEnd.getProducer(this.id)
        .then(producer => {
          this.producer = producer;
          this.breadcrumbs.push(new libBeckiLayout.LabeledLink(producer.name, ["/system/producers", this.id]));
          this.editProducer = producer.edit_permission;
          this.nameField = producer.name;
          this.descriptionField = producer.description;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The producer ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProducers().then(producers => !producers.find(producer => producer.id != this.id && producer.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateProducer(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The producer has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The producer cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }
}
