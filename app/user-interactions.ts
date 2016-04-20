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
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

class InteractionsModeratorItem extends libPatternFlyListView.Item {

  project:string;

  constructor(moderator:libBackEnd.InteractionsModerator, project:string, removable:boolean) {
    "use strict";

    super(moderator.id, moderator.id, moderator.type_of_device, undefined, removable);
    this.project = project;
  }
}

@ng.Component({
  templateUrl: "app/user-interactions.html",
  directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ng.CORE_DIRECTIVES],
})
export class Component implements ng.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  showModerators:boolean;

  schemes:libPatternFlyListView.Item[];

  moderators:InteractionsModeratorItem[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Interactions", ["UserInteractions"])
    ];
    this.showModerators = false;
    this.backEnd = backEnd;
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
            Promise.all([].concat(...projects.map(project => project.b_programs_id)).map(id => this.backEnd.getInteractionsScheme(id))),
            // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-197
            Promise.all([].concat(...projects.map(project => project.homers_id.map(id => [id, project]))).map(pair => Promise.all<any>([this.backEnd.getInteractionsModerator(pair[0]), pair[1]])))
          ]);
        })
        .then(result => {
          let schemes:libBackEnd.InteractionsScheme[];
          let moderators:[libBackEnd.InteractionsModerator, libBackEnd.Project][];
          [schemes, moderators] = result;
          this.schemes = schemes.map(scheme => new libPatternFlyListView.Item(scheme.id, scheme.name, scheme.program_description, ["UserInteractionsScheme", {scheme: scheme.id}], scheme.delete_permission));
          this.moderators = moderators.map(pair => new InteractionsModeratorItem(pair[0], pair[1].id, pair[1].update_permission));
        })
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Interactions cannot be loaded.", reason)));
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
          this.notifications.current.push(new libBeckiNotifications.Success("The scheme has been removed."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-185
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-185"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The scheme cannot be removed.", reason));
        });
  }

  onRemoveModeratorClick(id:string):void {
    "use strict";

    this.notifications.shift();
    let moderator = this.moderators.find(moderator => moderator.id == id);
    this.backEnd.removeInteractionsModeratorFromProject(moderator.id, moderator.project)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The moderator has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The moderator cannot be removed.", reason));
        });
  }
}
