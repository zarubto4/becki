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
import * as layout from "./layout";
import * as libBackEnd from "./lib-back-end/index";
import * as libPatternFlyListView from "./lib-patternfly/list-view";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

class InteractionsModeratorItem extends libPatternFlyListView.Item {

  project:string;

  constructor(moderator:libBackEnd.InteractionsModerator, project:string) {
    "use strict";

    super(moderator.homer_id, moderator.homer_id, moderator.online ? "online" : "offline");
    this.project = project;
  }
}

@ng.Component({
  templateUrl: "app/user-interactions.html",
  directives: [layout.Component, libPatternFlyListView.Component, ng.CORE_DIRECTIVES],
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  showModerators:boolean;

  schemes:libPatternFlyListView.Item[];

  moderators:InteractionsModeratorItem[];

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("User", becki.HOME.link),
      new layout.LabeledLink("Interactions", ["UserInteractions"])
    ];
    this.showModerators = false;
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

    this.backEnd.getProjects()
        .then(projects => {
          return Promise.all<any>([
            Promise.all(projects.map(project => this.backEnd.getProjectInteractionsSchemes(project.id))),
            Promise.all(projects.map(project => Promise.all<any>([this.backEnd.getProjectInteractionsModerators(project.id), project])))
          ]);
        })
        .then(result => {
          let schemes:libBackEnd.InteractionsScheme[][];
          let moderators:[libBackEnd.InteractionsModerator[], libBackEnd.Project][];
          [schemes, moderators] = result;
          this.schemes = [].concat(...schemes).map(scheme => new libPatternFlyListView.Item(scheme.b_program_id, scheme.name, scheme.program_description, ["UserInteractionsScheme", {scheme: scheme.b_program_id}]));
          this.moderators = [].concat(...moderators.map(pair => pair[0].map(moderator => new InteractionsModeratorItem(moderator, pair[1].id))));
        })
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Interactions cannot be loaded: ${reason}`)));
  }

  onAddClick():void {
    "use strict";

    if (this.showModerators) {
      this.onAddModeratorClick();
    } else {
      this.onAddSchemeClick();
    }
  }

  onAddSchemeClick():void {
    "use strict";

    this.router.navigate(["NewUserInteractionsScheme"]);
  }

  onAddModeratorClick():void {
    "use strict";

    this.router.navigate(["NewUserInteractionsModerator"]);
  }

  onSchemesClick():void {
    "use strict";

    this.showModerators = false;
  }

  onModeratorsClick():void {
    "use strict";

    this.showModerators = true;
  }

  onRemoveSchemeClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteInteractionsScheme(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The scheme has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The scheme cannot be removed: ${reason}`));
        });
  }

  onRemoveModeratorClick(id:string):void {
    "use strict";

    this.notifications.shift();
    let moderator = this.moderators.find(moderator => moderator.id == id);
    this.backEnd.removeInteractionsModeratorFromProject(moderator.id, moderator.project)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The moderator has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The moderator cannot be removed: ${reason}`));
        });
  }
}
