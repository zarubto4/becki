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

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldCode from "./lib-becki/field-code";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/standalone-program-new.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldCode.Component,
    libBeckiLayout.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  projectId:string;

  heading:string;

  breadcrumbs:libBeckiLayout.LabeledLink[];

  nameField:string;

  categoryField:string;

  categories:libBackEnd.StandaloneProgramCategory[];

  descriptionField:string;

  codeField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, @ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.projectId = routeParams.get("project");
    this.heading = `New Program (Project ${this.projectId})`;
    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", ["Projects"]),
      new libBeckiLayout.LabeledLink("Projects", ["Projects"]),
      new libBeckiLayout.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new libBeckiLayout.LabeledLink("Standalone Programs", ["Project", {project: this.projectId}]),
      new libBeckiLayout.LabeledLink("New Program", ["NewStandaloneProgram", {project: this.projectId}])
    ];
    this.nameField = "";
    this.categoryField = "";
    this.descriptionField = "";
    this.codeField = "";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getProject(this.projectId)
        .then(project => Promise.all(project.type_of_blocks_id.map(id => this.backEnd.getStandaloneProgramCategory(id))))
        .then(categories => this.categories = categories)
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Categories cannot be loaded.", reason)));
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getStandaloneProgramCategories().then(categories => ![].concat(...categories.map(category => category.blockoBlocks)).find(program => program.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createStandaloneProgram(this.nameField, this.categoryField, this.descriptionField)
        .then(program => {
          return this.backEnd.addVersionToStandaloneProgram("Initial version", "An automatically created version.", this.codeField, program.id);
        })
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The program have been created."));
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-205
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-205"));
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-206
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-206"));
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-207
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-207"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The program cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
