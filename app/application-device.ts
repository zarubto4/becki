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
import * as customValidator from "./custom-validator";
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/application-device.html",
  directives: [customValidator.Directive, layout.Component, ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES]
})
export class Component implements ng.OnInit {

  id:string;

  device:libBackEnd.ApplicationDevice;

  breadcrumbs:layout.LabeledLink[];

  editing:boolean;

  project:libBackEnd.Project;

  showProject:boolean;

  nameField:string;

  heightField:number;

  widthField:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("device");
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Devices for Applications", ["UserApplications"]),
      new layout.LabeledLink("Loading...", ["ApplicationDevice", {device: this.id}])
    ];
    this.editing = false;
    this.showProject = false;
    this.nameField = "Loading...";
    this.heightField = 1;
    this.widthField = 1;
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

    this.editing = false;
    this.backEnd.getProjects()
        .then(projects => {
          return Promise.all<any>([
            this.backEnd.getApplicationDevice(this.id),
            Promise.all(projects.map(project => Promise.all<any>([project, this.backEnd.getProjectApplicationDevices(project.id)])))
          ]);
        })
        .then(result => {
          let projects:[libBackEnd.Project, libBackEnd.ApplicationDevice[]][];
          [this.device, projects] = result;
          this.breadcrumbs[2].label = this.device.name;
          let pair = projects.find(pair => pair[1].find(device => device.id == this.id) !== undefined);
          this.project = pair ? pair[0] : null;
          this.showProject = this.project && projects.length > 1;
          this.nameField = this.device.name;
          this.heightField = this.device.height;
          this.widthField = this.device.width;
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The device ${this.id} cannot be loaded: ${reason}`));
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
    this.backEnd.updateApplicationDevice(this.id, this.nameField, this.heightField, this.widthField, this.project ? this.project.id : undefined, this.device.height_lock, this.device.width_lock, this.device.touch_screen)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The device has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The device cannot be updated: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.editing = false;
  }
}
