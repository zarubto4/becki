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

class DeviceProgramItem  extends libPatternFlyListView.Item {

  versions:libBackEnd.Version[];

  constructor(program:libBackEnd.CProgram) {
    "use strict";

    super(program.id, program.program_name, `${program.program_description}`, ["/user/device/programs", program.id], program.delete_permission);
    this.versions = program.program_versions.map(version => version.version_object);
  }
}

class SelectableDevice {

  model:libBackEnd.Board;

  selected:boolean;

  constructor(model:libBackEnd.Board) {
    "use strict";

    this.model = model;
    this.selected = false;
  }
}

@ngCore.Component({
  templateUrl: "app/user-devices.html",
  directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ngCommon.CORE_DIRECTIVES],
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  tab:string;

  programs:DeviceProgramItem[];

  devices:libPatternFlyListView.Item[];

  uploadProgramDevices:SelectableDevice[];

  uploadProgramField:string;

  uploadProgramVersionField:string;

  uploadBinaryDevices:SelectableDevice[];

  @ngCore.ViewChild("uploadBinaryField")
  uploadBinaryField:ngCore.ElementRef;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:string, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("Devices", ["/user/devices"])
    ];
    this.tab = 'programs';
    this.uploadProgramField = "";
    this.uploadProgramVersionField = "";
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

    this.backEnd.getProjects()
        .then(projects => {
          return Promise.all<any>([
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            Promise.all([].concat(...projects.map(project => project.c_programs_id)).map(id => this.backEnd.getDeviceProgram(id))),
            // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
            Promise.all([].concat(...projects.map(project => project.boards_id.map(id => [id, project]))).map(pair => Promise.all<any>([this.backEnd.getDevice(pair[0]), pair[1]])))
          ]);
        })
        .then(result => {
          let programs:libBackEnd.CProgram[];
          let devices:[libBackEnd.Board, libBackEnd.Project][];
          [programs, devices] = result;
          this.programs = programs.map(program => new DeviceProgramItem(program));
          this.devices = devices.map(pair => new libPatternFlyListView.Item(pair[0].id, pair[0].id, pair[0].isActive ? "active" : "inactive", undefined, pair[1].update_permission));
          this.uploadProgramDevices = devices.filter(pair => pair[0].update_permission).map(pair => new SelectableDevice(pair[0]));
          this.uploadBinaryDevices = devices.filter(pair => pair[0].update_permission).map(pair => new SelectableDevice(pair[0]));
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

    this.router.navigate(["/user/device/program/new"]);
  }

  onAddDeviceClick():void {
    "use strict";

    this.router.navigate(["/user/device/new"]);
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

  getUploadProgramVersions():libBackEnd.Version[] {
    "use strict";

    let program = this.programs.find(program => program.id == this.uploadProgramField);
    return program ? program.versions : [];
  }

  onUploadProgramFieldChange():void {
    "use strict";

    let versions = this.getUploadProgramVersions();
    this.uploadProgramVersionField = versions.length ? versions[0].id : "";
  }

  onUploadProgramSubmit():void {
    "use strict";

    let devices = this.uploadProgramDevices.filter(selectable => selectable.selected).map(selectable => selectable.model.id);
    if (!devices.length) {
      return;
    }

    this.notifications.shift();
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    this.backEnd.updateDeviceWithProgram(this.uploadProgramVersionField, devices)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The program has been uploaded."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-258
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-258"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The program cannot be uploaded.", reason));
        });
  }

  onUploadBinarySubmit():void {
    "use strict";

    let devices = this.uploadBinaryDevices.filter(selectable => selectable.selected).map(selectable => selectable.model.id);
    if (!devices.length) {
      return;
    }

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-301
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-301"));
  }

  onRemoveDeviceClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.removeDeviceFromProject(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The device has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The device cannot be removed.", reason));
        });
  }
}
