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
import * as fieldInteractionsScheme from "./field-interactions-scheme";
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as notifications from "./notifications";

@ng.Component({
  templateUrl: "app/user-interactions-scheme-new.html",
  directives: [
    customValidator.Directive,
    fieldInteractionsScheme.Component,
    layout.Component,
    ng.CORE_DIRECTIVES,
    ng.FORM_DIRECTIVES
  ]
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  projectField:string;

  projects:libBackEnd.Project[];

  nameField:string;

  descriptionField:string;

  showGroups:boolean;

  groupField:string;

  groups:libBackEnd.ApplicationGroup[];

  schemeField:string;

  backEnd:backEnd.Service;

  notifications:notifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notificationsService:notifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", becki.HOME.link),
      new layout.LabeledLink("New Scheme of Interactions", ["NewUserInteractionsScheme"])
    ];
    this.projectField = "";
    this.nameField = "";
    this.descriptionField = "";
    this.showGroups = false;
    this.groupField = "";
    this.schemeField = `{"blocks":{}}`;
    this.backEnd = backEndService;
    this.notifications = notificationsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getProjects()
        .then(projects => {
          this.projects = projects;
          this.loadFromProject();
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("Projects cannot be loaded.", reason));
        });
  }

  getProject():string {
    "use strict";

    return becki.getAdvancedField(this.projectField, this.projects.map(project => project.id));
  }

  loadFromProject():void {
    "use strict";

    this.showGroups = false;
    this.groups = [];
    if (this.getProject()) {
      this.backEnd.getProjectApplicationGroups(this.getProject())
          .then(groups => {
            this.showGroups = groups.length > 1 || (groups.length == 1 && !groups[0].m_programs.length);
            this.groups = groups;
          })
          .catch(reason => {
            this.notifications.current.push(new notifications.Danger("Application groups cannot be loaded.", reason));
          });
    }
  }

  onProjectChange():void {
    "use strict";

    this.loadFromProject();
  }

  validateNameField():()=>Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-98
    return () => this.backEnd.getProjects()
        .then(projects => Promise.all(projects.map(project => this.backEnd.getProjectInteractionsSchemes(project.id))))
        .then(schemes => ![].concat(...schemes).find(scheme => scheme.name == this.nameField));
  }

  onSubmit():void {
    "use strict";

    this.notifications.shift();
    Promise.resolve(
            this.getProject() || this.backEnd.createDefaultProject().then(project => {
              this.projects = [project];
              this.projectField = project.id;
              return project.id;
            })
        )
        .then(project => {
          return this.backEnd.createInteractionsScheme(this.nameField, this.descriptionField, project);
        })
        .then(scheme => {
          return this.backEnd.addVersionToInteractionsScheme("Initial version", "", this.schemeField, scheme.b_program_id);
        })
        .then(version => {
          return this.groupField ? this.backEnd.addApplicationGroupToInteractionsScheme(this.groupField, version.id, false) : null;
        })
        .then(() => {
          this.notifications.next.push(new notifications.Success("The scheme have been created."));
          this.router.navigate(["UserInteractions"]);
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-174
          this.notifications.current.push(new notifications.Danger("issue/TYRION-174"));
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-179
          this.notifications.current.push(new notifications.Warning("issue/TYRION-179"));
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-180
          this.notifications.current.push(new notifications.Warning("issue/TYRION-180"));
          this.notifications.current.push(new notifications.Danger("The scheme cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["UserInteractions"]);
  }
}
