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

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

class SelectableDeviceItem extends libPatternFlyListView.Item {

  project:string;

  selected:boolean;

  constructor(device:libBackEnd.Device, project:string, removable:boolean) {
    "use strict";

    super(device.id, device.id, device.isActive ? "active" : "inactive", undefined, removable);
    this.project = project;
    this.selected = false;
  }
}

@ng.Component({
  templateUrl: "app/user-devices.html",
  directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES],
})
export class Component implements ng.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  showUpdate:boolean;

  addDevice:boolean;

  devices:SelectableDeviceItem[];

  @ng.ViewChild("updateField")
  updateField:ng.ElementRef;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Devices", ["UserDevices"])
    ];
    this.showUpdate = false;
    this.addDevice = false;
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

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-192
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-192"));
    this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(permissions => {
          this.addDevice = libBackEnd.containsPermissions(permissions, ["project.owner", "Project_Editor", "Board Owner", "Project Owner", "board.edit"]);
          let deleteDevice = libBackEnd.containsPermissions(permissions, ["Board Owner", "Project Owner", "board.edit"]);
          if (libBackEnd.containsPermissions(permissions, ["project.owner", "Project_Editor"])) {
            this.backEnd.getProjects()
                .then(projects => Promise.all(projects.map(project => Promise.all<any>([this.backEnd.getProjectDevices(project.id), project]))))
                .then((devices:[libBackEnd.Device[], libBackEnd.Project][]) => this.devices = [].concat(...devices.map(pair => pair[0].map(device => new SelectableDeviceItem(device, pair[1].id, deleteDevice)))))
                .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Devices cannot be loaded.", reason)));
          } else {
            this.devices = [];
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view devices."));
          }
        })
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger(`Permissions cannot be loaded.`, reason)));
  }

  onAddDeviceClick():void {
    "use strict";

    this.router.navigate(["NewUserDevice"]);
  }

  onDevicesClick():void {
    "use strict";

    this.showUpdate = false;
  }

  onUpdateClick():void {
    "use strict";

    this.showUpdate = true;
  }

  onRemoveDeviceClick(id:string):void {
    "use strict";

    this.notifications.shift();
    let device = this.devices.find(device => device.id == id);
    this.backEnd.removeDeviceFromProject(device.id, device.project)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The device has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The device cannot be removed.", reason));
        });
  }

  onUpdateSubmit():void {
    "use strict";

    let devices = this.devices.filter(selectable => selectable.selected).map(selectable => selectable.id);
    if (!devices.length) {
      return;
    }

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-37#comment=109-118
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-37"));
  }
}
