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

  static ASAP = "asap";

  static IMMEDIATELY = "immediately";

  static LATER = "later";

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

  standalonePrograms:any[];

  standaloneProgramProperties:libAdminlteTable.Property[];

  newStandaloneProgramLink:any[];

  homerPrograms:any[];

  homerProgramProperties:libAdminlteTable.Property[];

  newHomerProgramLink:any[];

  homers:libBackEnd.Homer[];

  homerProperties:libAdminlteTable.Property[];

  homerFields:libAdminlteFields.Field[];

  homerQueue:any[];

  homerQueueProperties:libAdminlteTable.Property[];

  homerQueueFields:libAdminlteFields.Field[];

  collaboratorFields:libAdminlteFields.Field[];

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
    this.newStandaloneProgramLink = ["NewStandaloneProgram", {project: this.id}];
    this.homerProgramProperties = [
      new libAdminlteTable.Property("Name", "programName"),
      new libAdminlteTable.Property("Description", "programDescription")
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
      new libAdminlteFields.Field("Program:", "", "select"),
      new libAdminlteFields.Field("When:", "", "select", [
        new libAdminlteFields.Option("Immediately", Component.IMMEDIATELY),
        new libAdminlteFields.Option("As soon as possible", Component.ASAP),
        new libAdminlteFields.Option("Later", Component.LATER)
      ]),
      new libAdminlteFields.Field("Since:", Date.now().toString()),
      new libAdminlteFields.Field("Until:", (Date.now() + 7 * 24 * 60 * 60 * 1000).toString())
    ];
    this.collaboratorFields = [
      new libAdminlteFields.Field("ID:", "")
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
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-36
          return Promise.all<any>([
            project,
            this.backEnd.request("GET", project.boards, undefined, true),
            this.backEnd.request("GET", project.homers, undefined, true),
            this.backEnd.request("GET", project.programs, undefined, true)
          ]);
        })
        .then(result => {
          this.events.send(result);
          let project:libBackEnd.Project;
          let boards:libBackEnd.Device[];
          let homers:libBackEnd.Homer[];
          let programs:libBackEnd.HomerProgram[];
          [project, boards, homers, programs] = result;
          this.projectFields[0].model = project.projectName;
          this.projectFields[1].model = project.projectDescription;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-13
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-14
          this.devices = boards;
          this.deviceQueueFields[0].options = boards.map(device =>
              new libAdminlteFields.Option(device.hwName, device.hwName)
          );
          this.homerPrograms = programs;
          this.homers = homers;
          this.homerQueueFields[0].options = homers.map(homer =>
              new libAdminlteFields.Option(homer.homerId, homer.homerId)
          );
          this.homerQueueFields[1].options = programs.map(program =>
              new libAdminlteFields.Option(program.programName, program.programId)
          );
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onUpdatingSubmit():void {
    "use strict";

    this.backEnd.updateProject(this.id, this.projectFields[0].model, this.projectFields[1].model)
        .then((message) => this.events.send(message))
        .catch((reason) => this.events.send(reason));
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

  onDeviceUpdatingSubmit():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-15
  }

  getHomerProgramLink():(program:libBackEnd.HomerProgram)=>any[] {
    "use strict";

    return (program) => ["HomerProgram", {project: this.id, program: program.programId}];
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

  onHomerUpdatingSubmit():void {
    "use strict";

    let promise:Promise<string>;
    switch (this.homerQueueFields[2].model) {
      case Component.IMMEDIATELY:
        promise = this.backEnd.uploadToHomerNow(this.homerQueueFields[0].model, this.homerQueueFields[1].model);
        break;
      case Component.ASAP:
        promise = this.backEnd.uploadToHomerAsap(this.homerQueueFields[0].model, this.homerQueueFields[1].model, this.homerQueueFields[4].model);
        break;
      case Component.LATER:
        promise = this.backEnd.uploadToHomerLater(this.homerQueueFields[0].model, this.homerQueueFields[1].model, this.homerQueueFields[3].model, this.homerQueueFields[4].model);
        break;
      default:
        return;
    }
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-24
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-25
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-26
    promise.then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCollaboratorAdditionSubmit():void {
    "use strict";
    // TODO https://youtrack.byzance.cz/youtrack/issue/TYRION-21
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
