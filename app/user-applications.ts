/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ngCore.Component({
  templateUrl: "app/user-applications.html",
  directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ngCommon.CORE_DIRECTIVES],
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  tab:string;

  applications:libPatternFlyListView.Item[];

  devices:libPatternFlyListView.Item[];

  groups:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:string, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("Applications", ["/user/applications"])
    ];
    this.tab = "applications";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.backEnd.getApplications()
        .then(applications => this.applications = applications.map(application => new libPatternFlyListView.Item(application.id, application.program_name, application.program_description, ["/user/applications", application.id], application.delete_permission)))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Applications cannot be loaded.", reason)));
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    this.backEnd.getApplicationDevices()
        .then(devices => this.devices = [].concat(
            devices.public_types.map(device => new libPatternFlyListView.Item(device.id, device.name, "global", ["/application/devices", device.id], device.delete_permission)),
            devices.private_types.map(device => new libPatternFlyListView.Item(device.id, device.name, "project specific", ["/application/devices", device.id], device.delete_permission))
        ))
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("Devices cannot be loaded.", reason));
        });
    this.backEnd.getProjects()
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        .then(projects => Promise.all<libBackEnd.MProject>([].concat(...projects.map(project => project.m_projects_id)).map(id => this.backEnd.getApplicationGroup(id))))
        .then(groups => this.groups = groups.map(group => new libPatternFlyListView.Item(group.id, group.program_name, group.program_description, ["/user/application/groups", group.id], group.delete_permission)))
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

    this.router.navigate(["/user/application/new"]);
  }

  onAddDeviceClick():void {
    "use strict";

    this.router.navigate(["/user/application/device/new"]);
  }

  onAddGroupClick():void {
    "use strict";

    this.router.navigate(["/user/application/group/new"]);
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
