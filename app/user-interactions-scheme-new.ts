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

import * as libBackEnd from "./lib-back-end/index";
import * as libBecki from "./lib-becki/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiCustomValidator from "./lib-becki/custom-validator";
import * as libBeckiFieldInteractionsScheme from "./lib-becki/field-interactions-scheme";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";

@ng.Component({
  templateUrl: "app/user-interactions-scheme-new.html",
  directives: [
    libBeckiCustomValidator.Directive,
    libBeckiFieldInteractionsScheme.Component,
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

  showGroups:boolean;

  groupField:string;

  groups:libBackEnd.ApplicationGroup[];

  schemeField:string;

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("New Scheme of Interactions", ["NewUserInteractionsScheme"])
    ];
    this.projectField = "";
    this.nameField = "";
    this.descriptionField = "";
    this.showGroups = false;
    this.groupField = "";
    this.schemeField = `{"blocks":{}}`;
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.notifications.shift();
    this.backEnd.getProjects()
        .then(projects => {
          this.projects = projects.filter(project => project.update_permission);
          this.loadFromProject();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("Projects cannot be loaded.", reason));
        });
  }

  getProject():string {
    "use strict";

    return libBecki.getAdvancedField(this.projectField, this.projects.map(project => project.id));
  }

  loadFromProject():void {
    "use strict";

    this.showGroups = false;
    this.groups = [];
    if (this.getProject()) {
      this.backEnd.getProject(this.getProject())
          .then(project => {
            return Promise.all(project.m_projects_id.map(id => this.backEnd.getApplicationGroup(id)));
          })
          .then(groups => {
            this.showGroups = groups.length > 1 || (groups.length == 1 && !groups[0].m_programs.length);
            this.groups = groups;
          })
          .catch(reason => {
            this.notifications.current.push(new libBeckiNotifications.Danger("Application groups cannot be loaded.", reason));
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
        .then(projects => Promise.all([].concat(...projects.map(project => project.b_programs_id)).map(id => this.backEnd.getInteractionsScheme(id))))
        .then(schemes => !schemes.find(scheme => scheme.name == this.nameField));
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
          return this.backEnd.addVersionToInteractionsScheme("Initial version", "", this.schemeField, scheme.id);
        })
        .then(version => {
          return this.groupField ? this.backEnd.addApplicationGroupToInteractionsScheme(this.groupField, version.id, false) : null;
        })
        .then(() => {
          this.notifications.next.push(new libBeckiNotifications.Success("The scheme have been created."));
          this.router.navigate(["UserInteractions"]);
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be created.", reason));
        });
  }

  onCancelClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["UserInteractions"]);
  }
}
