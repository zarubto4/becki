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
import * as notifications from "./notifications";

@ng.Component({
  templateUrl: "app/system.html",
  directives: [layout.Component, libPatternFlyListView.Component, ng.CORE_DIRECTIVES],
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  tab:string;

  moderators:libPatternFlyListView.Item[];

  devices:libPatternFlyListView.Item[];

  types:libPatternFlyListView.Item[];

  backEnd:backEnd.Service;

  notifications:notifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notificationsService:notifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("System", ["System"])
    ];
    this.tab = "moderators";
    this.backEnd = backEndService;
    this.notifications = notificationsService;
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
        .then(moderators => this.moderators = moderators.map(moderator => new libPatternFlyListView.Item(moderator.homer_id, `${moderator.homer_id} (issue/TYRION-71)`, moderator.online ? "online" : "offline")))
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-155
          this.notifications.current.push(new notifications.Danger("issue/TYRION-155"));
          this.notifications.current.push(new notifications.Danger("Moderators of interactions cannot be loaded.", reason));
        });
    this.backEnd.getDevices()
        // see https://youtrack.byzance.cz/youtrack/issue/TYRION-70
        .then(devices => this.devices = devices.map(device => new libPatternFlyListView.Item(device.id, `${device.id} (issue/TYRION-70)`, device.isActive ? "active" : "inactive")))
        .catch(reason => this.notifications.current.push(new notifications.Danger("Devices cannot be loaded.", reason)));
    this.backEnd.getIssueTypes()
        .then(types => this.types = types.map(type => new libPatternFlyListView.Item(type.id, type.type, null, ["SystemIssueType", {type: type.id}])))
        .catch(reason => this.notifications.current.push(new notifications.Danger("Issue types cannot be loaded.", reason)));
  }

  onAddClick():void {
    "use strict";

    switch (this.tab) {
      case "moderators":
        this.onAddModeratorClick();
        break;
      case "devices":
        this.onAddDeviceClick();
        break;
      case "types":
        this.onAddTypeClick();
        break;
    }
  }

  onAddModeratorClick():void {
    "use strict";

    this.router.navigate(["NewSystemInteractionsModerator"]);
  }

  onAddDeviceClick():void {
    "use strict";

    this.router.navigate(["NewSystemDevice"]);
  }

  onAddTypeClick():void {
    "use strict";

    this.router.navigate(["NewSystemIssueType"]);
  }

  onTabClick(tab:string):void {
    "use strict";

    this.tab = tab;
  }

  onRemoveModeratorClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteInteractionsModerator(id)
        .then(() => {
          this.notifications.current.push(new notifications.Success("The moderator of interactions has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("The moderator of interactions cannot be removed.", reason));
        });
  }

  onRemoveDeviceClick(id:string):void {
    "use strict";

    this.notifications.shift();
    // see https://youtrack.byzance.cz/youtrack/issue/TYRION-89
    this.notifications.current.push(new notifications.Danger("issue/TYRION-89"));
  }

  onRemoveTypeClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteIssueType(id)
        .then(() => {
          this.notifications.current.push(new notifications.Success("The issue type has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new notifications.Danger("The issue type cannot be removed.", reason));
        });
  }
}
