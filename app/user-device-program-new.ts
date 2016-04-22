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
import * as libBecki from "./lib-becki/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldCode from "./lib-becki/field-code";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/user-device-program-new.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldCode.Component,
    libBeckiLayout.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  projectField:string;

  projects:libBackEnd.Project[];

  nameField:string;

  descriptionField:string;

  codeField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", ["Projects"]),
      new libBeckiLayout.LabeledLink("New Device Program", ["NewUserDeviceProgram"])
    ];
    this.projectField = "";
    this.nameField = "";
    this.descriptionField = "";
    this.codeField = "";
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getProjects()
        .then(projects => this.projects = projects.filter(project => project.update_permission))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger(`Projects cannot be loaded: ${reason}`)));
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjects()
        .then(projects => Promise.all([].concat(...projects.map(project => this.backEnd.getDevicePrograms(project.id)))))
        .then(programs => !programs.find(program => program.program_name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    Promise.resolve(
            libBecki.getAdvancedField(this.projectField, this.projects.map(project => project.id)) || this.backEnd.createDefaultProject().then(project => {
              this.projects = [project];
              this.projectField = project.id;
              return project.id;
            })
        )
        .then(project => {
          return this.backEnd.createDeviceProgram(this.nameField, this.descriptionField, project);
        })
        .then(program => {
          return this.backEnd.addVersionToDeviceProgram("Initial version", "", this.codeField, program.id);
        })
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The program has been created."));
          this.router.navigate(["Projects"]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-203
          this.notifications.current.push(new libBeckiNotifications.Warning("TYRION-203"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The program cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["Projects"]);
  }
}
