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
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";

@ng.Component({
  templateUrl: "app/projects.html",
  directives: [layout.Component, libBootstrapPanelList.Component],
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  items:libBootstrapPanelList.Item[];

  progress:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", ["Projects"]),
      new layout.LabeledLink("Projects", ["Projects"])
    ];
    this.progress += 1;
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
    this.backEnd.getProjects()
        .then(projects => this.items = projects.map(project => new libBootstrapPanelList.Item(project.projectId, project.projectName, project.projectDescription, ["Project", {project: project.projectId}])))
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Projects cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewProject"]);
  }

  onRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    Promise.all(ids.map(id => this.backEnd.deleteProject(id)))
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("The projects have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`The projects cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }
}
