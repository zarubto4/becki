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
import * as libPatternFlyListGroup from "./lib-patternfly/list-group";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/projects.html",
  directives: [layout.Component, libPatternFlyListGroup.Component, ngRouter.ROUTER_DIRECTIVES],
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  newLink:any[];

  items:libPatternFlyListGroup.Item[];

  progress:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", ["Projects"]),
      new layout.LabeledLink("Projects", ["Projects"])
    ];
    this.newLink = ["NewProject"];
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
    this.backEnd.getProjects()
        .then(projects => this.items = projects.map(project => new libPatternFlyListGroup.Item(project.id, project.project_name, project.project_description, ["Project", {project: project.id}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Projects cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onAddClick():void {
    "use strict";

    this.router.navigate(this.newLink);
  }

  onRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    this.backEnd.deleteProject(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The project has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The project cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }
}
