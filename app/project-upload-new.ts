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
import * as libBackEnd from "./lib-back-end/index";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/project-upload-new.html",
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  boards:libBackEnd.Board[];

  homers:libBackEnd.Homer[];

  boardPrograms:any[];

  homerPrograms:libBackEnd.HomerProgram[];

  typeField:string;

  deviceField:string;

  programField:string;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

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
    this.typeField = "";
    this.deviceField = "";
    this.programField = "";
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
            this.backEnd.request("GET", project.c_programs),
            this.backEnd.request("GET", project.boards),
            this.backEnd.request("GET", project.b_programs),
            this.backEnd.request("GET", project.homers)
          ]);
        })
        .then(result => {
          this.events.send(result);
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-77
          [this.boardPrograms, this.boards, this.homerPrograms, this.homers] = result;
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onSubmit():void {
    "use strict";

    let since:string;
    let until:string;
    let promise:Promise<string>;
    switch (this.typeField) {
      case "Board":
        promise = this.backEnd.addProgramToBoard(this.programField, this.deviceField);
        break;
      case "Homer":
        promise = this.backEnd.addProgramToHomer(this.programField, this.deviceField);
        break;
      default:
        return;
    }
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-43
    promise.then((message) => {
          this.events.send(message);
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCancelClick():void {
    "use strict";

    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
