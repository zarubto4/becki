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
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyListView from "./lib-patternfly/list-view";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

class DeviceItem extends libPatternFlyListView.Item {

  project:string;

  constructor(device:libBackEnd.Device, project:string) {
    "use strict";

    super(device.id, device.id, device.isActive ? "active" : "inactive");
    this.project = project;
  }
}

@ng.Component({
  templateUrl: "app/user-devices.html",
  directives: [layout.Component, libPatternFlyListView.Component, ng.CORE_DIRECTIVES],
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  items:DeviceItem[];

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", becki.HOME.link),
      new layout.LabeledLink("Devices", ["UserDevices"])
    ];
    this.backEnd = backEndService;
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

    this.backEnd.getProjects()
        .then(projects => Promise.all(projects.map(project => Promise.all<any>([this.backEnd.getProjectDevices(project.id), project]))))
        .then((devices:[libBackEnd.Device[], libBackEnd.Project][]) => this.items = [].concat(...devices.map(pair => pair[0].map(device => new DeviceItem(device, pair[1].id)))))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Devices cannot be loaded: ${reason}`)));
  }

  onAddClick():void {
    "use strict";

    this.router.navigate(["NewUserDevice"]);
  }

  onRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    let device = this.items.find(device => device.id == id);
    this.backEnd.removeDeviceFromProject(device.id, device.project)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The device has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The device cannot be removed: ${reason}`));
        });
  }
}
