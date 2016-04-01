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

import * as backEnd from "./back-end";
import * as becki from "./index";
import * as layout from "./layout";
import * as libPatternFlyListView from "./lib-patternfly/list-view";
import * as notifications from "./notifications";

@ng.Component({
  templateUrl: "app/user-applications.html",
  directives: [layout.Component, libPatternFlyListView.Component, ng.CORE_DIRECTIVES],
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  tab:string;

  applications:libPatternFlyListView.Item[];

  devices:libPatternFlyListView.Item[];

  groups:libPatternFlyListView.Item[];

  backEnd:backEnd.Service;

  notifications:notifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notificationsService:notifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", becki.HOME.link),
      new layout.LabeledLink("Applications", ["UserApplications"])
    ];
    this.tab = "applications";
    this.backEnd = backEndService;
    this.notifications = notificationsService;
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
        .then(applications => this.applications = applications.map(application => new libPatternFlyListView.Item(application.id, application.program_name, application.program_description, ["UserApplication", {application: application.id}])))
        .catch(reason => this.notifications.current.push(new notifications.Danger("Applications cannot be loaded.", reason)));
    this.backEnd.getApplicationDevices()
        .then(devices => this.devices = [].concat(
            devices.public_types.map(device => new libPatternFlyListView.Item(device.id, device.name, "global", ["ApplicationDevice", {device: device.id}])),
            devices.private_types.map(device => new libPatternFlyListView.Item(device.id, device.name, "project specific", ["ApplicationDevice", {device: device.id}]))
        ))
        .catch(reason => this.notifications.current.push(new notifications.Danger("Devices cannot be loaded.", reason)));
    this.backEnd.getApplicationGroups()
        .then(groups => this.groups = groups.map(group => new libPatternFlyListView.Item(group.id, group.program_name, group.program_description, ["UserApplicationGroup", {group: group.id}])))
        .catch(reason => this.notifications.current.push(new notifications.Danger("Groups cannot be loaded.", reason)));
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
          this.notifications.current.push(new notifications.Success("The application has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("The application cannot be removed.", reason));
        });
  }

  onRemoveDeviceClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteApplicationDevice(id)
        .then(() => {
          this.notifications.current.push(new notifications.Success("The device has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("The device cannot be removed.", reason));
        });
  }

  onRemoveGroupClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteApplicationGroup(id)
        .then(() => {
          this.notifications.current.push(new notifications.Success("The group has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("The group cannot be removed.", reason));
        });
  }
}
