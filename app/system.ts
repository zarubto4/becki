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
import * as libPatternFlyListView from "./lib-patternfly/list-view";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/system.html",
  directives: [layout.Component, libPatternFlyListView.Component],
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  items:libPatternFlyListView.Item[];

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("System", ["System"])
    ];
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

    this.backEnd.getInteractionsModerators()
        // see https://youtrack.byzance.cz/youtrack/issue/TYRION-71
        .then(moderators => this.items = moderators.map(moderator => new libPatternFlyListView.Item(moderator.homer_id, `${moderator.homer_id} (issue/TYRION-71)`, moderator.online ? "online" : "offline")))
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-155
          this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-155"));
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`Moderators of interactions cannot be loaded: ${reason}`));
        });
  }

  onAddClick():void {
    "use strict";

    this.router.navigate(["NewSystemInteractionsModerator"]);
  }

  onRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteInteractionsModerator(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The moderator of interactions has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The moderator of interactions cannot be removed: ${reason}`));
        });
  }
}
