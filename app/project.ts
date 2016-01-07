/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
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
import * as events from "./events";
import * as form from "./form";
import * as libAdminlteFields from "./lib-adminlte/fields";
import * as libAdminlteInbox from "./lib-adminlte/inbox";
import * as libAdminlteTable from "./lib-adminlte/table";
import * as libAdminlteTableWithActions from "./lib-adminlte/table-with-actions";
import * as libAdminlteWrapper from "./lib-adminlte/wrapper";
import * as libBackEnd from "./lib-back-end/index";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/project.html",
  directives: [
    form.Component,
    libAdminlteInbox.Component,
    libAdminlteTableWithActions.Component,
    wrapper.Component
  ]
})
export class Component {

  id:string;

  heading:string;

  breadcrumbs:libAdminlteWrapper.LabeledLink[];

  projectFields:libAdminlteFields.Field[];

  devicePrograms:any[];

  deviceProgramProperties:libAdminlteTable.Property[];

  newDeviceProgramLink:any[];

  devices:libBackEnd.Device[];

  deviceProperties:libAdminlteTable.Property[];

  deviceFields:libAdminlteFields.Field[];

  deviceQueue:any[];

  deviceQueueProperties:libAdminlteTable.Property[];

  deviceQueueFields:libAdminlteFields.Field[];

  homerPrograms:any[];

  homerProgramProperties:libAdminlteTable.Property[];

  newHomerProgramLink:any[];

  homers:libBackEnd.Homer[];

  homerProperties:libAdminlteTable.Property[];

  homerFields:libAdminlteFields.Field[];

  homerQueue:any[];

  homerQueueProperties:libAdminlteTable.Property[];

  homerQueueFields:libAdminlteFields.Field[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("project");
    this.heading = `Project ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new libAdminlteWrapper.LabeledLink("User", ["Projects"]),
      new libAdminlteWrapper.LabeledLink("Projects", ["Projects"]),
      new libAdminlteWrapper.LabeledLink(`Project ${this.id}`, ["Project", {project: this.id}])
    ];
    this.projectFields = [
      new libAdminlteFields.Field("Name:", "Loading..."),
      new libAdminlteFields.Field("Description:", "Loading...")
    ];
    this.newDeviceProgramLink = ["NewDeviceProgram", {project: this.id}];
    this.deviceProperties = [
      new libAdminlteTable.Property("ID", "hwName"),
      new libAdminlteTable.Property("Type", "typeOfDevice")
    ];
    this.deviceFields = [
      new libAdminlteFields.Field("ID:", "")
    ];
    this.deviceQueueFields = [
      new libAdminlteFields.Field("Device:", "", "select"),
      new libAdminlteFields.Field("Program:", "", "select")
    ];
    this.newHomerProgramLink = ["NewHomerProgram", {project: this.id}];
    this.homerProperties = [
      new libAdminlteTable.Property("ID", "homerId")
    ];
    this.homerFields = [
      new libAdminlteFields.Field("ID:", "")
    ];
    this.homerQueueFields = [
      new libAdminlteFields.Field("Homer:", "", "select"),
      new libAdminlteFields.Field("Program:", "", "select")
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.refresh();
  }

  refresh():void {
    "use strict";

    this.backEnd.getProject(this.id)
        .then((project) => {
          this.events.send(project);
          this.projectFields[0].model = project.projectName;
          this.projectFields[1].model = project.projectDescription;
          // TODO: http://byzance.myjetbrains.com/youtrack/issue/TBE-14
          this.devices = project.electronicDevicesList;
          this.homers = project.homerList;
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  getSelfLink():any[] {
    "use strict";

    return ["Project", {project: this.id}];
  }

  onUpdatingSubmit():void {
    "use strict";

    this.backEnd.updateProject(this.id, this.projectFields[0].model, this.projectFields[1].model)
        .then((message) => this.events.send(message))
        .catch((reason) => this.events.send(reason));
  }

  onDeviceUpdatingSubmit():void {
    "use strict";

    // TODO: http://byzance.myjetbrains.com/youtrack/issue/TBE-15
  }

  onDeviceAdditionSubmit():void {
    "use strict";

    this.backEnd.addDeviceToProject(this.deviceFields[0].model, this.id)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onHomerUpdatingSubmit():void {
    "use strict";

    this.backEnd.updateHomer(this.homerQueueFields[0].model, this.homerQueueFields[1].model)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onHomerAdditionSubmit():void {
    "use strict";

    this.backEnd.addHomerToProject(this.homerFields[0].model, this.id)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onDeletionSubmit():void {
    "use strict";

    this.backEnd.deleteProject(this.id)
        .then((message) => {
          this.events.send(message);
          this.router.navigate(["Projects"]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }
}
