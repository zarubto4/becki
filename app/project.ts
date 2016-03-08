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
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapListGroup from "./lib-bootstrap/list-group";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

class SelectableItem extends libBootstrapListGroup.Item {

  selected:boolean;

  constructor(id:string, name:string, description:string, link:any[] = null) {
    "use strict";

    super(id, name, description, link);
    this.selected = false;
  }
}

@ng.Component({
  templateUrl: "app/project.html",
  directives: [
    customValidator.Directive,
    layout.Component,
    libBootstrapListGroup.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  id:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  nameField:string;

  descriptionField:string;

  newCollaboratorLink:any[];

  collaborators:libBootstrapListGroup.Item[];

  newBoardProgramLink:any[];

  boardPrograms:libBootstrapListGroup.Item[];

  newStandaloneProgramLink:any[];

  standalonePrograms:libBootstrapListGroup.Item[];

  newHomerProgramLink:any[];

  homerPrograms:libBootstrapListGroup.Item[];

  newBoardLink:any[];

  boards:SelectableItem[];

  boardUploadingProgramField:string;

  @ng.ViewChild("boardUploadingBinaryFileField")
  boardUploadingBinaryFileField:ng.ElementRef;

  newHomerLink:any[];

  homers:SelectableItem[];

  homerUploadingProgramField:string;

  progress:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("project");
    this.heading = `Project ${this.id}`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", ["Projects"]),
      new layout.LabeledLink("Projects", ["Projects"]),
      new layout.LabeledLink(`Project ${this.id}`, ["Project", {project: this.id}])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.newCollaboratorLink = ["NewProjectCollaborator", {project: this.id}];
    this.newBoardProgramLink = ["NewBoardProgram", {project: this.id}];
    this.newStandaloneProgramLink = ["NewStandaloneProgram", {project: this.id}];
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-146
    this.standalonePrograms = [
      new libBootstrapListGroup.Item(null, "(issue/TYRION-146)", "does not work")
    ];
    this.newHomerProgramLink = ["NewHomerProgram", {project: this.id}];
    this.newBoardLink = ["NewProjectBoard", {project: this.id}];
    this.boardUploadingProgramField = "";
    this.newHomerLink = ["NewProjectHomer", {project: this.id}];
    this.homerUploadingProgramField = "";
    this.progress = 0;
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

    this.progress += 1;
    Promise.all<any>([
          this.backEnd.getProject(this.id),
          this.backEnd.getProjectOwners(this.id),
          this.backEnd.getProjectBoardPrograms(this.id),
          this.backEnd.getProjectHomerPrograms(this.id),
          this.backEnd.getProjectBoards(this.id),
          this.backEnd.getProjectHomers(this.id)
        ])
        .then(result => {
          let project:libBackEnd.Project;
          let collaborators:libBackEnd.Person[];
          let boardPrograms:libBackEnd.BoardProgram[];
          let homerPrograms:libBackEnd.HomerProgram[];
          let boards:libBackEnd.Board[];
          let homers:libBackEnd.Homer[];
          [project, collaborators, boardPrograms, homerPrograms, boards, homers] = result;
          this.nameField = project.project_name;
          this.descriptionField = project.project_description;
          this.collaborators = collaborators.map(collaborator => new libBootstrapListGroup.Item(collaborator.id, libBackEnd.composePersonString(collaborator), null));
          this.boardPrograms = boardPrograms.map(program => new libBootstrapListGroup.Item(program.id, program.program_name, program.program_description, ["BoardProgram", {project: this.id, program: program.id}]));
          this.homerPrograms = homerPrograms.map(program => new libBootstrapListGroup.Item(program.programId, program.name, program.programDescription, ["HomerProgram", {project: this.id, program: program.programId}]));
          this.boards = boards.map(board => new SelectableItem(board.id, board.id, board.isActive ? "active" : "inactive"));
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-78
          this.homers = homers.map(homer => new SelectableItem(homer.homer_id, homer.homer_id, "(issue/TYRION-78)"));
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The project ${this.id} cannot be loaded: ${reason}`));
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
            return !projects.find(project => project.id != this.id && project.project_name == this.nameField);
          })
          .catch(reason => {
            this.progress -= 1;
            return Promise.reject(reason);
          });
    };
  }

  onUpdatingSubmit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.updateProject(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The project has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The project cannot be updated: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCollaboratorRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.removeCollaboratorsFromProject([id], this.id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The collaborator has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The collaborator cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onBoardProgramRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.deleteBoardProgram(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onStandaloneProgramRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.deleteStandaloneProgram(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-130
          this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-130"));
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onHomerProgramRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.deleteHomerProgram(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onBoardRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.removeBoardFromProject(id, this.id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The board has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The board cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onBoardUploadingSubmit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    let boards = this.boards.filter(selectable => selectable.selected).map(selectable => selectable.id);
    Promise.all(boards.map(id => this.backEnd.addProgramToBoard(this.boardUploadingProgramField, id)))
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The program has been uploaded."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-128
          this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-128"));
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be uploaded: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onBoardUploadingBinarySubmit():void {
    "use strict";

    this.notifications.shift();
    // TODO: http://youtrack.byzance.cz/youtrack/issue/TYRION-37#comment=109-118
    this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-37"));
    console.log(this.boardUploadingBinaryFileField);
  }

  onHomerRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.removeHomerFromProject(id, this.id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The Homer has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The Homer cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onHomerUploadingSubmit():void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    let homers = this.homers.filter(selectable => selectable.selected).map(selectable => selectable.id);
    Promise.all(homers.map(id => this.backEnd.addProgramToHomer(this.homerUploadingProgramField, id)))
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The program has been uploaded."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-137
          this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-137"));
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be uploaded: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }
}
