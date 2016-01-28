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
import * as events from "./events";
import * as form from "./form";
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapFields from "./lib-bootstrap/fields";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/wrapper-form.html",
  directives: [form.Component, wrapper.Component]
})
export class Component implements ng.OnInit {

  static ASAP = "asap";

  static IMMEDIATELY = "immediately";

  static LATER = "later";

  static DEVICE = "device";

  static HOMER = "homer";

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  fields:libBootstrapFields.Field[];

  deviceOptions:libBootstrapFields.Option[];

  deviceProgramOptions:libBootstrapFields.Option[];

  homerOptions:libBootstrapFields.Option[];

  homerProgramOptions:libBootstrapFields.Option[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    let since = new Date();
    let until = new Date(new Date(since.getTime()).setDate(since.getDate() + 7));
    this.projectId = routeParams.get("project");
    this.heading = `New Program Upload (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("User", ["Projects"]),
      new wrapper.LabeledLink("Projects", ["Projects"]),
      new wrapper.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("Program Uploads", ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("New Upload", ["NewProjectUpload", {project: this.projectId}])
    ];
    this.fields = [
      new libBootstrapFields.Field("Device/Homer program", "", "select", "glyphicon-list", [
        new libBootstrapFields.Option("Device", Component.DEVICE),
        new libBootstrapFields.Option("Homer", Component.HOMER)
      ]),
      new libBootstrapFields.Field("Device/Homer ID", "", "select", "glyphicon-list"),
      new libBootstrapFields.Field("Program", "", "select", "glyphicon-console"),
      new libBootstrapFields.Field("When", "", "select", "glyphicon-time", [
        new libBootstrapFields.Option("Immediately", Component.IMMEDIATELY),
        new libBootstrapFields.Option("As soon as possible", Component.ASAP),
        new libBootstrapFields.Option("Later", Component.LATER)
      ]),
      libBootstrapFields.Field.fromDate("Since", since, "text", "glyphicon-time", undefined, false),
      libBootstrapFields.Field.fromDate("Until", until, "text", "glyphicon-time", undefined, false)
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getProject(this.projectId)
        .then((project) => {
          this.events.send(project);
          return Promise.all<any>([
            this.backEnd.request("GET", project.boards),
            this.backEnd.request("GET", project.homers),
            this.backEnd.request("GET", project.programs)
          ]);
        })
        .then(result => {
          this.events.send(result);
          let devices:libBackEnd.Device[];
          let homers:libBackEnd.Homer[];
          let programs:libBackEnd.HomerProgram[];
          [devices, homers, programs] = result;
          this.deviceOptions = devices.map(device => new libBootstrapFields.Option(device.hwName, device.hwName));
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-13
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-14
          this.deviceProgramOptions = [];
          this.homerOptions = homers.map(homer => new libBootstrapFields.Option(homer.homerId, homer.homerId));
          this.homerProgramOptions = programs.map(program => new libBootstrapFields.Option(program.programName, program.programId));
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onFieldChange():void {
    "use strict";

    switch (this.fields[0].model) {
      case Component.DEVICE:
        this.fields[1].label = "Device ID";
        this.fields[1].options = this.deviceOptions;
        this.fields[2].options = this.deviceProgramOptions;
        break;
      case Component.HOMER:
        this.fields[1].label = "Homer ID";
        this.fields[1].options = this.homerOptions;
        this.fields[2].options = this.homerProgramOptions;
        break;
      default:
        this.fields[1].label = "Device/Homer ID";
        this.fields[1].options = [];
        this.fields[2].options = [];
        break;
    }
    this.fields[4].visible = false;
    this.fields[5].visible = false;
    switch (this.fields[3].model) {
      case Component.LATER:
        this.fields[4].visible = true;
      case Component.ASAP:
        this.fields[5].visible = true;
        break;
    }
  }

  onSubmit():void {
    "use strict";

    let promise:Promise<string>;
    switch (this.fields[0].model) {
      case Component.DEVICE:
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-15
        return;
      case Component.HOMER:
        switch (this.fields[3].model) {
          case Component.IMMEDIATELY:
            promise = this.backEnd.uploadToHomerNow(this.fields[1].model, this.fields[2].model);
            break;
          case Component.ASAP:
            promise = this.backEnd.uploadToHomerAsap(this.fields[1].model, this.fields[2].model, this.fields[5].getDate().getTime().toString());
            break;
          case Component.LATER:
            promise = this.backEnd.uploadToHomerLater(this.fields[1].model, this.fields[2].model, this.fields[4].getDate().getTime().toString(), this.fields[5].getDate().getTime().toString());
            break;
          default:
            return;
        }
        break;
      default:
        return;
    }
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-24
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-25
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-26
    promise.then((message) => {
          this.events.send(message);
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCancel():void {
    "use strict";

    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
