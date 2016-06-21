/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ngCore.Component({
  templateUrl: "app/user-project.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiLayout.Component,
    libPatternFlyListView.Component,
    ngCommon.CORE_DIRECTIVES,
    ngCommon.FORM_DIRECTIVES,
    ngRouter.ROUTER_DIRECTIVES
  ]
})
export class Component implements ngCore.OnInit {

  id:string;

  name:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  showCollaborators:boolean;

  editing:boolean;

  nameField:string;

  descriptionField:string;

  description:string;

  editProject:boolean;

  addCollaborator:boolean;

  tab:string;

  collaborators:libPatternFlyListView.Item[];
  c_programs:libPatternFlyListView.Item[];
  b_programs:libPatternFlyListView.Item[];
  m_programs:libPatternFlyListView.Item[];

  projectPointer:string//only placeholder for easier debuggging

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("project");
    this.name = "Loading...";
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Projects", ["UserProjects"]),
      new libBeckiLayout.LabeledLink("Loading...", ["UserProject", {project: this.id}])
    ];
    this.projectPointer="1";
    this.tab="details";
    this.editing = false;
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.description = "Loading...";
    this.editProject = false;
    this.addCollaborator = false;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  onTabClick(tab:string):void {
    "use strict";
    this.tab = tab;
  }

  refresh():void {
    "use strict";
    this.editing = false;
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    this.backEnd.getProject(this.id)
        .then(project => {
          return Promise.all<any>([
            project,
            Promise.all(project.owners_id.map(id => this.backEnd.getUser(id)))
          ]);
        })
        .then(result => {
          let project:libBackEnd.Project;
          let collaborators:libBackEnd.User[];
          [project, collaborators] = result;
          this.name = project.project_name;
          this.breadcrumbs[3].label = project.project_name;
          this.nameField = project.project_name;
          this.descriptionField = project.project_description;
          this.description = project.project_description;
          this.editProject = project.edit_permission;
          this.addCollaborator = project.share_permission;
          this.collaborators = collaborators.map(collaborator => new libPatternFlyListView.Item(collaborator.id, libBackEnd.composeUserString(collaborator, true), null, undefined, project.unshare_permission));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`The project ${this.id} cannot be loaded.`, reason));
        });


    this.backEnd.getDeviceProgram(this.projectPointer)
        .then(c_program => this.c_programs =[new libPatternFlyListView.Item(c_program.id, c_program.program_name, c_program.program_description)])
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("c_programs cannot be loaded.", reason)));

    this.backEnd.getApplication(this.projectPointer)
        .then(m_program => this.m_programs =[new libPatternFlyListView.Item(m_program.id, m_program.program_name, m_program.program_description)])
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("m_programs cannot be loaded.", reason)));

    this.backEnd.getInteractionsScheme(this.projectPointer)
        .then(b_program => this.b_programs =[new libPatternFlyListView.Item(b_program.id, b_program.name, b_program.program_description)])
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("b_programs cannot be loaded.", reason)));



  }

  onLayoutActionClick():void {
    "use strict";

    if (this.showCollaborators) {
      this.onCollaboratorAddClick();
    } else {
      this.editing = !this.editing;
    }
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjects().then(projects => !projects.find(project => project.id != this.id && project.project_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.updateProject(this.id, this.nameField, this.descriptionField)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The project has been updated."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The project cannot be updated.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.editing = false;
  }

  onCollaboratorAddClick():void {
    "use strict";

    this.router.navigate(["NewUserProjectCollaborator", {project: this.id}]);
  }

  onCollaboratorRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.removeCollaboratorsFromProject([id], this.id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The collaborator has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The collaborator cannot be removed.", reason));
        });
  }
}
