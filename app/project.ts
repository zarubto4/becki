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
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/project.html",
  directives: [ng.FORM_DIRECTIVES, libBootstrapPanelList.Component, wrapper.Component]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  nameField:string;

  descriptionField:string;

  collaborators:libBootstrapPanelList.Item[];

  newCollaboratorLink:any[];

  boardPrograms:libBootstrapPanelList.Item[];

  newBoardProgramLink:any[];

  standalonePrograms:libBootstrapPanelList.Item[];

  newStandaloneProgramLink:any[];

  homerPrograms:libBootstrapPanelList.Item[];

  newHomerProgramLink:any[];

  boards:libBootstrapPanelList.Item[];

  additionalBoardLink:any[];

  homers:libBootstrapPanelList.Item[];

  additionalHomerLink:any[];

  uploadQueue:libBootstrapPanelList.Item[];

  newUploadLink:any[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("project");
    this.heading = `Project ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("User", ["Projects"]),
      new wrapper.LabeledLink("Projects", ["Projects"]),
      new wrapper.LabeledLink(`Project ${this.id}`, ["Project", {project: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.newCollaboratorLink = ["NewProjectCollaborator", {project: this.id}];
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-14
    this.boardPrograms = [
      new libBootstrapPanelList.Item(null, "(issue/TYRION-14)", "does not work"),
      new libBootstrapPanelList.Item(null, "(issue/TYRION-14)", "does not work"),
      new libBootstrapPanelList.Item(null, "(issue/TYRION-14)", "does not work")
    ];
    this.newBoardProgramLink = ["NewBoardProgram", {project: this.id}];
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-36
    this.standalonePrograms = [
      new libBootstrapPanelList.Item(null, "(issue/TYRION-36)", "does not work")
    ];
    this.newStandaloneProgramLink = ["NewStandaloneProgram", {project: this.id}];
    this.newHomerProgramLink = ["NewHomerProgram", {project: this.id}];
    this.additionalBoardLink = ["NewProjectBoard", {project: this.id}];
    this.additionalHomerLink = ["NewProjectHomer", {project: this.id}];
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-15
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-43
    this.uploadQueue = [
      new libBootstrapPanelList.Item(null, "(issue/TYRION-15)", "does not work"),
      new libBootstrapPanelList.Item(null, "(issue/TYRION-43)", "does not work")
    ];
    this.newUploadLink = ["NewProjectUpload", {project: this.id}];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getProject(this.id)
        .then(project => {
          this.events.send(project);
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-36
          return Promise.all<any>([
            project,
            this.backEnd.request("GET", project.boards),
            this.backEnd.request("GET", project.programs),
            this.backEnd.request("GET", project.homers),
            this.backEnd.request("GET", project.owners)
          ]);
        })
        .then(result => {
          this.events.send(result);
          let project:libBackEnd.Project;
          let boards:libBackEnd.Board[];
          let homerPrograms:libBackEnd.HomerProgram[];
          let homers:libBackEnd.Homer[];
          let collaborators:libBackEnd.Person[];
          [project, boards, homerPrograms, homers, collaborators] = result;
          this.nameField = project.projectName;
          this.descriptionField = project.projectDescription;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-47
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-14
          this.boards = boards.map(board => new libBootstrapPanelList.Item(board.id, board.id, board.isActive ? "active" : "inactive"));
          this.homerPrograms = homerPrograms.map(program => new libBootstrapPanelList.Item(program.programId, program.programName, program.programDescription));
          this.homers = homers.map(homer => new libBootstrapPanelList.Item(homer.homerId, homer.homerId, null));
          this.collaborators = collaborators.map(collaborator => new libBootstrapPanelList.Item(collaborator.id, collaborator.nickName, collaborator.mail));
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onUpdatingSubmit():void {
    "use strict";

    this.backEnd.updateProject(this.id, this.nameField, this.descriptionField)
        .then(message => this.events.send(message))
        .catch(reason => this.events.send(reason));
  }

  getHomerProgramLink():(program:libBootstrapPanelList.Item)=>any[] {
    "use strict";

    return (program) => ["HomerProgram", {project: this.id, program: program.id}];
  }
}
