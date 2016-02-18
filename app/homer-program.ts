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
import * as fieldHomerProgram from "./field-homer-program";
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/homer-program.html",
  directives: [
    customValidator.Directive,
    fieldHomerProgram.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES,
    wrapper.Component
  ]
})
export class Component implements ng.OnInit {

  id:string;

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  nameField:string;

  descriptionField:string;

  codeField:string;

  progress:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.id = routeParams.get("program");
    this.projectId = routeParams.get("project");
    this.heading = `Program ${this.id} (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("User", ["Projects"]),
      new wrapper.LabeledLink("Projects", ["Projects"]),
      new wrapper.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("Homer Programs", ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink(`Program ${this.id}`, ["HomerProgram", {
        project: this.projectId,
        program: this.id
      }])
    ];
    this.nameField = "Loading...";
    this.descriptionField = "Loading...";
    this.codeField = `{"blocks":{}}`;
    this.progress = 0;
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.getHomerProgram(this.id)
        .then(program => this.backEnd.request<string>("GET", program.programinJson).then(code => {
          this.nameField = program.programName;
          this.descriptionField = program.programDescription;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-80
          this.codeField = JSON.stringify(code);
        }))
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The program ${this.id} cannot be loaded: ${reason}`));
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
      return this.backEnd.getProject(this.projectId)
          .then(project => {
            return this.backEnd.request<libBackEnd.HomerProgram[]>("GET", project.b_programs);
          })
          .then(programs => {
            this.progress -= 1;
            return !programs.find(program => program.programId != this.id && program.programName == this.nameField);
          })
          .catch(reason => {
            this.progress -= 1;
            return Promise.reject(reason);
          });
    };
  }

  onSubmit():void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    this.backEnd.updateHomerProgram(this.id, this.nameField, this.descriptionField, this.codeField, this.projectId)
        .then(() => {
          this.alerts.next.push(new libBootstrapAlerts.Success("The program has been updated."));
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The program cannot be updated: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onCancelClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
