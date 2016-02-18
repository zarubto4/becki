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
import * as customValidator from "./custom-validator";
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/project.html",
  directives: [
    customValidator.Directive,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES,
    libBootstrapPanelList.Component,
    wrapper.Component
  ]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  nameField:string;

  descriptionField:string;

  collaborators:libBootstrapPanelList.Item[];

  boardPrograms:libBootstrapPanelList.Item[];

  standalonePrograms:libBootstrapPanelList.Item[];

  homerPrograms:libBootstrapPanelList.Item[];

  boards:libBootstrapPanelList.Item[];

  homers:libBootstrapPanelList.Item[];

  uploadQueue:libBootstrapPanelList.Item[];

  progress:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
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
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-36
    this.standalonePrograms = [
      new libBootstrapPanelList.Item(null, "(issue/TYRION-36)", "does not work")
    ];
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-43
    this.uploadQueue = [
      new libBootstrapPanelList.Item(null, "(issue/TYRION-43)", "does not work"),
      new libBootstrapPanelList.Item(null, "(issue/TYRION-43)", "does not work"),
      new libBootstrapPanelList.Item(null, "(issue/TYRION-43)", "does not work")
    ];
    this.progress = 0;
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.progress += 1;
    this.backEnd.getProject(this.id)
        .then(project => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-36
          return Promise.all<any>([
            project,
            this.backEnd.request("GET", project.c_programs),
            this.backEnd.request("GET", project.boards),
            this.backEnd.request("GET", project.b_programs),
            this.backEnd.request("GET", project.homers),
            this.backEnd.request("GET", project.owners)
          ]);
        })
        .then(result => {
          let project:libBackEnd.Project;
          let boardPrograms:libBackEnd.BoardProgram[];
          let boards:libBackEnd.Board[];
          let homerPrograms:libBackEnd.HomerProgram[];
          let homers:libBackEnd.Homer[];
          let collaborators:libBackEnd.Person[];
          [project, boardPrograms, boards, homerPrograms, homers, collaborators] = result;
          this.nameField = project.projectName;
          this.descriptionField = project.projectDescription;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-77
          this.boardPrograms = boardPrograms.map(program => new libBootstrapPanelList.Item(program.id, program.programName, program.programDescription, ["BoardProgram", {project: this.id, program: program.id}]));
          this.boards = boards.map(board => new libBootstrapPanelList.Item(board.id, board.id, board.isActive ? "active" : "inactive"));
          this.homerPrograms = homerPrograms.map(program => new libBootstrapPanelList.Item(program.programId, program.programName, program.programDescription, ["HomerProgram", {project: this.id, program: program.programId}]));
          this.homers = homers.map(homer => new libBootstrapPanelList.Item(homer.homerId, homer.homerId, null));
          this.collaborators = collaborators.map(collaborator => new libBootstrapPanelList.Item(collaborator.id, libBackEnd.composePersonString(collaborator), null));
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The project ${this.id} cannot be loaded: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    return () => {
      this.progress += 1;
      // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
      return this.backEnd.getProjects()
          .then(projects => {
            this.progress -= 1;
            return !projects.find(project => project.projectId != this.id && project.projectName == this.nameField);
          })
          .catch(reason => {
            this.progress -= 1;
            return Promise.reject(reason);
          });
    };
  }

  onUpdatingSubmit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.updateProject(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The project has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The project cannot be updated: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCollaboratorAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewProjectCollaborator", {project: this.id}]);
  }

  onCollaboratorsRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.removeCollaboratorsFromProject(ids, this.id)
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The collaborators have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The collaborators cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onBoardProgramAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewBoardProgram", {project: this.id}]);
  }

  onBoardProgramsRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    Promise.all(ids.map(id => this.backEnd.deleteBoardProgram(id)))
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The programs have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The programs cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onStandaloneProgramAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewStandaloneProgram", {project: this.id}]);
  }

  onStandaloneProgramsRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    Promise.all(ids.map(id => this.backEnd.deleteStandaloneProgram(id)))
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The programs have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The programs cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onHomerProgramAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewHomerProgram", {project: this.id}]);
  }

  onHomerProgramsRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    Promise.all(ids.map(id => this.backEnd.deleteHomerProgram(id)))
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The programs have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The programs cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onBoardAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewProjectBoard", {project: this.id}]);
  }

  onBoardsRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    Promise.all(ids.map(id => this.backEnd.removeBoardFromProject(id, this.id)))
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The boards have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The boards cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onHomerAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewProjectHomer", {project: this.id}]);
  }

  onHomersRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-91
    Promise.all(ids.map(id => this.backEnd.removeHomerFromProject(id, this.id)))
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The Homers have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The Homers cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onUploadAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewProjectUpload", {project: this.id}]);
  }

  onUploadsRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-43
    this.alerts.current.push(new libBootstrapAlerts.Danger("issue/TYRION-43"));
  }
}
