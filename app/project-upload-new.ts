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

class Selectable<T> {

  model:T;

  selected:boolean;

  constructor(model:T) {
    "use strict";

    this.model = model;
    this.selected = false;
  }
}

@ng.Component({
  templateUrl: "app/project-upload-new.html",
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  boards:Selectable<libBackEnd.Board>[];

  homers:Selectable<libBackEnd.Homer>[];

  boardPrograms:libBackEnd.BoardProgram[];

  homerPrograms:libBackEnd.HomerProgram[];

  typeField:string;

  programField:string;

  @ng.ViewChild("fileField")
  fileField:ng.ElementRef;

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
    this.programField = "";
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getProject(this.projectId)
        .then(project => {
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
          let boards:libBackEnd.Board[];
          let homers:libBackEnd.Homer[];
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-77
          [this.boardPrograms, boards, this.homerPrograms, homers] = result;
          this.boards = boards.map(board => new Selectable(board));
          this.homers = homers.map(homer => new Selectable(homer));
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onSubmit():void {
    "use strict";

    let boards = this.boards.filter(selectable => selectable.selected).map(selectable => selectable.model.id);
    let homers = this.homers.filter(selectable => selectable.selected).map(selectable => selectable.model.homerId);
    let promise:Promise<string[]>;
    switch (this.typeField) {
      case "Board program (project)":
        promise = Promise.all(boards.map(id => this.backEnd.addProgramToBoard(this.programField, id)));
        break;
      case "Homer program (project)":
        promise = Promise.all(homers.map(id => this.backEnd.addProgramToHomer(this.programField, id)));
        break;
      case "Board program (binary)":
        // TODO: http://youtrack.byzance.cz/youtrack/issue/TYRION-37#comment=109-118
        alert("issue/TYRION-37");
        return;
      default:
        return;
    }
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-43
    promise.then(messages => {
          this.events.send(messages);
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onCancelClick():void {
    "use strict";

    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
