/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ngCore.Component({
  templateUrl: "app/application-device.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES, ngCommon.FORM_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

  id:string;

  device:libBackEnd.ApplicationDevice;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  editing:boolean;

  editDevice:boolean;

  project:libBackEnd.Project;

  showProject:boolean;

  nameField:string;

  widthField:number;

  heightField:number;

  columnsField:number;

  rowsField:number;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("device");
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("Devices for Applications", ["UserApplications"]),
      new libBeckiLayout.LabeledLink("Loading...", ["ApplicationDevice", {device: this.id}])
    ];
    this.editing = false;
    this.editDevice = false;
    this.showProject = false;
    this.nameField = "Loading...";
    this.widthField = 1;
    this.heightField = 1;
    this.columnsField = 1;
    this.rowsField = 1;
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

    this.editing = false;
    Promise.all<any>([
          // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
          this.backEnd.getApplicationDevice(this.id),
          this.backEnd.getProjects()
        ])
        .then(result => {
          let projects:libBackEnd.Project[];
          [this.device, projects] = result;
          this.breadcrumbs[2].label = this.device.name;
          this.project = projects.find(project => project.screen_size_types_id.indexOf(this.id) != -1) || null;
          this.editDevice = this.device.edit_permission;
          this.showProject = this.project && projects.length > 1;
          this.nameField = this.device.name;
          this.widthField = this.device.portrait_width;
          this.heightField = this.device.portrait_height;
          this.columnsField = this.device.portrait_square_width;
          this.rowsField = this.device.portrait_square_height;
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The device ${this.id} cannot be loaded.`, reason));
        });
  }

  onEditClick():void {
    "use strict";

    this.editing = !this.editing;
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return () => this.backEnd.getApplicationDevices().then(devices => ![].concat(devices.public_types, devices.private_types).find(device => device.id != this.id && device.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateApplicationDevice(this.id, this.nameField, this.widthField, this.heightField, this.columnsField, this.rowsField, this.device.width_lock, this.device.height_lock, this.device.portrait_min_screens, this.device.portrait_max_screens, this.device.landscape_min_screens, this.device.landscape_max_screens, this.device.touch_screen, this.project ? this.project.id : undefined)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The device has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The device cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.editing = false;
  }
}
