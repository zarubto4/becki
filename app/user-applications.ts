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
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ng.Component({
  templateUrl: "app/user-applications.html",
  directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ng.CORE_DIRECTIVES],
})
export class Component implements ng.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  tab:string;

  applications:libPatternFlyListView.Item[];

  devices:libPatternFlyListView.Item[];

  groups:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Applications", ["UserApplications"])
    ];
    this.tab = "applications";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.backEnd.getApplications()
        .then(applications => this.applications = applications.map(application => new libPatternFlyListView.Item(application.id, application.program_name, application.program_description, ["UserApplication", {application: application.id}], application.delete_permission)))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Applications cannot be loaded.", reason)));
    this.backEnd.getApplicationDevices()
        .then(devices => this.devices = [].concat(
            devices.public_types.map(device => new libPatternFlyListView.Item(device.id, device.name, "global", ["ApplicationDevice", {device: device.id}], device.delete_permission)),
            devices.private_types.map(device => new libPatternFlyListView.Item(device.id, device.name, "project specific", ["ApplicationDevice", {device: device.id}], device.delete_permission))
        ))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Devices cannot be loaded.", reason)));
    this.backEnd.getApplicationGroups()
        .then(groups => this.groups = groups.map(group => new libPatternFlyListView.Item(group.id, group.program_name, group.program_description, ["UserApplicationGroup", {group: group.id}], group.delete_permission)))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Groups cannot be loaded.", reason)));
  }

  onAddClick():void {
    "use strict";

    switch (this.tab) {
      case "applications":
        this.onAddApplicationClick();
        break;
      case "devices":
        this.onAddDeviceClick();
        break;
      case "groups":
        this.onAddGroupClick();
        break;
    }
  }

  onAddApplicationClick():void {
    "use strict";

    this.router.navigate(["NewUserApplication"]);
  }

  onAddDeviceClick():void {
    "use strict";

    this.router.navigate(["NewUserApplicationDevice"]);
  }

  onAddGroupClick():void {
    "use strict";

    this.router.navigate(["NewUserApplicationGroup"]);
  }

  onTabClick(tab:string):void {
    "use strict";

    this.tab = tab;
  }

  onRemoveApplicationClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteApplication(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The application has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The application cannot be removed.", reason));
        });
  }

  onRemoveDeviceClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteApplicationDevice(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The device has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The device cannot be removed.", reason));
        });
  }

  onRemoveGroupClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteApplicationGroup(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The group has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The group cannot be removed.", reason));
        });
  }
}
