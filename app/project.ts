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
import * as libPatternFlyListView from "./lib-patternfly/list-view";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

class SelectableItem extends libPatternFlyListView.Item {

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
    libPatternFlyListView.Component,
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

  collaborators:libPatternFlyListView.Item[];

  boardPrograms:libPatternFlyListView.Item[];

  standalonePrograms:libPatternFlyListView.Item[];

  homerPrograms:libPatternFlyListView.Item[];

  boards:SelectableItem[];

  boardUploadingProgramField:string;

  @ng.ViewChild("boardUploadingBinaryFileField")
  boardUploadingBinaryFileField:ng.ElementRef;

  homers:SelectableItem[];

  homerUploadingProgramField:string;

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
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-160
    this.standalonePrograms = [
      new libPatternFlyListView.Item(null, "(issue/TYRION-160)", "does not work")
    ];
    this.boardUploadingProgramField = "";
    this.homerUploadingProgramField = "";
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
          this.collaborators = collaborators.map(collaborator => new libPatternFlyListView.Item(collaborator.id, libBackEnd.composePersonString(collaborator), null));
          this.boardPrograms = boardPrograms.map(program => new libPatternFlyListView.Item(program.id, program.program_name, program.program_description, ["BoardProgram", {project: this.id, program: program.id}]));
          this.homerPrograms = homerPrograms.map(program => new libPatternFlyListView.Item(program.b_program_id, program.name, program.program_description, ["HomerProgram", {project: this.id, program: program.b_program_id}]));
          this.boards = boards.map(board => new SelectableItem(board.id, board.id, board.isActive ? "active" : "inactive"));
          this.homers = homers.map(homer => new SelectableItem(homer.homer_id, homer.homer_id, homer.online ? "online" : "offline"));
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The project ${this.id} cannot be loaded: ${reason}`));
        });
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjects().then(projects => !projects.find(project => project.id != this.id && project.project_name == this.nameField));
  }

  onUpdatingSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateProject(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The project has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The project cannot be updated: ${reason}`));
        });
  }

  onCollaboratorAddClick():void {
    "use strict";

    this.router.navigate(["NewProjectCollaborator", {project: this.id}]);
  }

  onCollaboratorRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.removeCollaboratorsFromProject([id], this.id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The collaborator has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The collaborator cannot be removed: ${reason}`));
        });
  }

  onBoardProgramAddClick():void {
    "use strict";

    this.router.navigate(["NewBoardProgram", {project: this.id}]);
  }

  onBoardProgramRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteBoardProgram(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be removed: ${reason}`));
        });
  }

  onStandaloneProgramAddClick():void {
    "use strict";

    this.router.navigate(["NewStandaloneProgram", {project: this.id}]);
  }

  onStandaloneProgramRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteStandaloneProgram(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be removed: ${reason}`));
        });
  }

  onHomerProgramAddClick():void {
    "use strict";

    this.router.navigate(["NewHomerProgram", {project: this.id}]);
  }

  onHomerProgramRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteHomerProgram(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The program has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be removed: ${reason}`));
        });
  }

  onBoardAddClick():void {
    "use strict";

    this.router.navigate(["NewProjectBoard", {project: this.id}]);
  }

  onBoardRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.removeBoardFromProject(id, this.id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The board has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The board cannot be removed: ${reason}`));
        });
  }

  onBoardUploadingSubmit():void {
    "use strict";

    this.notifications.shift();
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
        });
  }

  onBoardUploadingBinarySubmit():void {
    "use strict";

    this.notifications.shift();
    // TODO: http://youtrack.byzance.cz/youtrack/issue/TYRION-37#comment=109-118
    this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-37"));
    console.log(this.boardUploadingBinaryFileField);
  }

  onHomerAddClick():void {
    "use strict";

    this.router.navigate(["NewProjectHomer", {project: this.id}]);
  }

  onHomerRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.removeHomerFromProject(id, this.id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The Homer has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The Homer cannot be removed: ${reason}`));
        });
  }

  onHomerUploadingSubmit():void {
    "use strict";

    this.notifications.shift();
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
        });
  }
}
