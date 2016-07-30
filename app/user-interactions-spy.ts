/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as Rx from "rxjs";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiFieldInteractionsScheme from "./lib-becki/field-interactions-scheme";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/user-interactions-spy.html",
  directives: [libBeckiFieldInteractionsScheme.Component, libBeckiLayout.Component]
})
export class Component implements ngCore.OnInit, ngCore.OnDestroy {

  versionName:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  scheme:string;

  versionId:string;

  activatedRoute:ngRouter.ActivatedRoute;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  routeParamsSubscription:Rx.Subscription;

  constructor(@ngCore.Inject("home") home:string, activatedRoute:ngRouter.ActivatedRoute, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.versionName = "Loading...";
    this.name = "Loading...";
    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("Spies of Interactions", ["/user/interactions/spies"])
    ];
    this.scheme = `{"blocks":{}}`;
    this.activatedRoute = activatedRoute;
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
      let id = params["spy"];
      // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
      this.backEnd.getInteractionsScheme(id)
          .then(scheme => {
            if (!scheme.program_state.uploaded) {
              throw new Error("scheme not deployed");
            }
            let version = scheme.program_versions.find(version => version.version_Object.id == scheme.program_state.version_id);
            this.versionName = version.version_Object.version_name;
            this.name = scheme.name;
            this.breadcrumbs.push(new libBeckiLayout.LabeledLink(`${scheme.name} ${version.version_Object.version_name}`, ["/user/interactions/spies", id]));
            this.scheme = version.program;
            this.versionId = version.version_Object.id;
          })
          .catch(reason => {
            this.notifications.current.push(new libBeckiNotifications.Danger("The spy cannot be loaded.", reason));
          });
    });
  }

  ngOnDestroy():void {
    "use strict";

    this.routeParamsSubscription.unsubscribe();
  }
}
