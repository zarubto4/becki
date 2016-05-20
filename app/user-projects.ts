/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ngCore.Component({
  templateUrl: "app/user-projects.html",
  directives: [libBeckiLayout.Component, libPatternFlyListView.Component],
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  items:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Projects", ["UserProjects"])
    ];
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.backEnd.getProjects()
        .then(projects => this.items = projects.map(project => new libPatternFlyListView.Item(project.id, project.project_name, project.project_description, ["UserProject", {project: project.id}], project.delete_permission)))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Projects cannot be loaded.", reason)));
  }

  onAddClick():void {
    "use strict";

    this.router.navigate(["NewUserProject"]);
  }

  onRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteProject(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The project has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The project cannot be removed.", reason));
        });
  }
}
