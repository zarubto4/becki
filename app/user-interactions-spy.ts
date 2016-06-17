/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiFieldInteractionsScheme from "./lib-becki/field-interactions-scheme";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/user-interactions-spy.html",
  directives: [libBeckiFieldInteractionsScheme.Component, libBeckiLayout.Component]
})
export class Component implements ngCore.OnInit {

  id:string;

  versionName:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  scheme:string;

  versionId:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service) {
    "use strict";

    this.id = routeParams.get("spy");
    this.versionName = "Loading...";
    this.name = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Spies of Interactions", ["UserInteractions"]),
      new libBeckiLayout.LabeledLink("Loading...", ["NewUserInteractionsScheme"])
    ];
    this.scheme = `{"blocks":{}}`;
    this.backEnd = backEnd;
    this.notifications = notifications;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getInteractionsScheme(this.id)
        .then(scheme => {
          if (!scheme.program_state.uploaded) {
            return Promise.reject<any>(new Error("scheme not deployed"));
          }
          let version = scheme.versionObjects.find(version => version.id == scheme.program_state.version_id);
          return Promise.all<any>([
            version,
            scheme,
            this.backEnd.getFile(version.files_id[0])
          ]);
        })
        .then(result => {
          let version:libBackEnd.Version;
          let scheme:libBackEnd.InteractionsScheme;
          let versionFile:libBackEnd.BackEndFile;
          [version, scheme, versionFile] = result;
          this.versionName = version.version_name;
          this.name = scheme.name;
          this.breadcrumbs[3].label = `${scheme.name} ${version.version_name}`;
          this.scheme = versionFile.content;
          this.versionId = version.id;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The spy cannot be loaded.", reason));
        });
  }
}
