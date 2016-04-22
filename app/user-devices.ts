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

    super(device.id, device.id, device.type_of_board.name, undefined, removable);
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

  tab:string;

  addProgram:boolean;

  addDevice:boolean;

  programs:libPatternFlyListView.Item[];

  devices:SelectableDeviceItem[];

  @ng.ViewChild("uploadField")
  uploadField:ng.ElementRef;

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
    this.tab = 'programs';
    this.addProgram = false;
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

    this.backEnd.getProjects()
        .then(projects => {
          return Promise.all<any>([
            Promise.all([].concat(...projects.map(project => project.c_programs_id)).map(id => this.backEnd.getDeviceProgram(id))),
            Promise.all([].concat(...projects.map(project => project.boards_id.map(id => [id, project]))).map(pair => Promise.all<any>([this.backEnd.getDevice(pair[0]), pair[1]])))
          ]);
        })
        .then(result => {
          let programs:libBackEnd.DeviceProgram[];
          let devices:[libBackEnd.Device, libBackEnd.Project][];
          [programs, devices] = result;
          this.programs = programs.map(program => new libPatternFlyListView.Item(program.id, program.program_name, program.program_description, ["UserDeviceProgram", {program: program.id}], program.delete_permission));
          this.devices = devices.map(pair => new SelectableDeviceItem(pair[0], pair[1].id, pair[1].update_permission));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("Devices cannot be loaded.", reason));
        });
  }

  onAddClick():void {
    "use strict";

    switch (this.tab) {
      case "programs":
        this.onAddProgramClick();
        break;
      case "devices":
        this.onAddDeviceClick();
        break;
    }
  }

  onAddProgramClick():void {
    "use strict";

    this.router.navigate(["NewUserDeviceProgram"]);
  }

  onAddDeviceClick():void {
    "use strict";

    this.router.navigate(["NewUserDevice"]);
  }

  onTabClick(tab:string):void {
    "use strict";

    this.tab = tab;
  }

  onRemoveProgramClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteDeviceProgram(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The program cannot be removed.", reason));
        });
  }

  onUploadSubmit():void {
    "use strict";

    let devices = this.devices.filter(selectable => selectable.selected).map(selectable => selectable.id);
    if (!devices.length) {
      return;
    }

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-37#comment=109-118
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-37"));
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
}
