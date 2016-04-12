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
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/application-device.html",
  directives: [libBeckiCustomValidator.Directive, libBeckiLayout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

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

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
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

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.editing = false;
    this.backEnd.getProjects()
        .then(projects => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-192
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-192"));
          return Promise.all<any>([
            this.backEnd.getApplicationDevice(this.id),
            Promise.all(projects.map(project => Promise.all<any>([project, this.backEnd.getProjectApplicationDevices(project.id)]))),
            this.backEnd.getUserRolesAndPermissionsCurrent()
          ]);
        })
        .then(result => {
          let projects:[libBackEnd.Project, libBackEnd.ApplicationDevice[]][];
          let permissions:libBackEnd.RolesAndPermissions;
          [this.device, projects] = result;
          this.breadcrumbs[2].label = this.device.name;
          let pair = projects.find(pair => pair[1].find(device => device.id == this.id) !== undefined);
          this.editDevice = !pair || libBackEnd.containsPermissions(permissions, ["project.owner"]);
          this.project = pair ? pair[0] : null;
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
