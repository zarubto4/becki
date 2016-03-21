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
import * as customValidator from "./custom-validator";
import * as fieldCode from "./field-code";
import * as layout from "./layout";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/standalone-program-new.html",
  directives: [
    customValidator.Directive,
    fieldCode.Component,
    layout.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  projectId:string;

  heading:string;

  breadcrumbs:layout.LabeledLink[];

  nameField:string;

  categoryField:string;

  descriptionField:string;

  codeField:string;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.projectId = routeParams.get("project");
    this.heading = `New Program (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", ["Projects"]),
      new layout.LabeledLink("Projects", ["Projects"]),
      new layout.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new layout.LabeledLink("Standalone Programs", ["Project", {project: this.projectId}]),
      new layout.LabeledLink("New Program", ["NewStandaloneProgram", {project: this.projectId}])
    ];
    this.nameField = "";
    this.categoryField = "";
    this.descriptionField = "";
    this.codeField = "";
    this.backEnd = backEndService;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getStandaloneProgramCategories()
        .then(categories => Promise.all(categories.map(category => this.backEnd.getStandalonePrograms(category.id))))
        .then(programs => ![].concat(...programs).find(program => program.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.createStandaloneProgram(this.nameField, this.categoryField, this.descriptionField)
        .then(program => {
          return this.backEnd.addVersionToStandaloneProgram("Initial version", "", this.codeField, program.id);
        })
        .then(() => {
          this.notifications.next.push(new libPatternFlyNotifications.Success("The program have been created."));
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The program cannot be created: ${reason}`));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
