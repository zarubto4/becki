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

@ng.Component({
  templateUrl: "app/system.html",
  directives: [libPatternFlyListView.Component, libBeckiLayout.Component, ng.CORE_DIRECTIVES],
})
export class Component implements ng.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  tab:string;

  addModerator:boolean;

  addDevice:boolean;

  addType:boolean;

  moderators:libPatternFlyListView.Item[];

  devices:libPatternFlyListView.Item[];

  types:libPatternFlyListView.Item[];

  confirmations:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["System"])
    ];
    this.tab = "moderators";
    this.addModerator = false;
    this.addDevice = false;
    this.addType = false;
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

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-192
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-192"));
    this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(permissions => {
          let hasPermission = libBackEnd.containsPermissions(permissions, ["project.owner", "Project_Editor"]);
          this.addModerator = hasPermission;
          this.backEnd.getInteractionsModerators()
              // see https://youtrack.byzance.cz/youtrack/issue/TYRION-71
              .then(moderators => this.moderators = moderators.map(moderator => new libPatternFlyListView.Item(moderator.homer_id, `${moderator.homer_id} (issue/TYRION-71)`, moderator.online ? "online" : "offline", undefined, hasPermission)))
              .catch(reason => {
                // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-155
                this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-155"));
                this.notifications.current.push(new libBeckiNotifications.Danger("Moderators of interactions cannot be loaded.", reason));
              });
          this.addDevice = libBackEnd.containsPermissions(permissions, ["type_of_board.create", "type_of_board.read"]);
          let viewDevice = libBackEnd.containsPermissions(permissions, ["board.read"]);
          if (viewDevice) {
            this.backEnd.getDevices()
                // see https://youtrack.byzance.cz/youtrack/issue/TYRION-70
                .then(devices => this.devices = devices.map(device => new libPatternFlyListView.Item(device.id, `${device.id} (issue/TYRION-70)`, device.isActive ? "active" : "inactive")))
                .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Devices cannot be loaded.", reason)));
          } else {
            this.devices = [];
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view devices."));
          }
          this.addType = hasPermission;
          if (hasPermission) {
            this.backEnd.getIssueTypes()
                .then(types => this.types = types.map(type => new libPatternFlyListView.Item(type.id, type.type, null, hasPermission ? ["SystemIssueType", {type: type.id}] : undefined, hasPermission)))
                .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Issue types cannot be loaded.", reason)));
          } else {
            this.types = [];
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view issue types."));
          }
          this.backEnd.getIssueConfirmations()
              .then(confirmations => this.confirmations = confirmations.map(confirmation => new libPatternFlyListView.Item(confirmation.id, confirmation.type, null, hasPermission ? ["SystemIssueConfirmation", {confirmation: confirmation.id}] : undefined)))
              .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Issue confirmations cannot be loaded.", reason)));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger(`Permissions cannot be loaded.`, reason));
        });
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-186
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-186"));
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
      case "confirmations":
        this.onAddConfirmationClick();
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

  onAddConfirmationClick():void {
    "use strict";

    this.router.navigate(["NewSystemIssueConfirmation"]);
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
          this.notifications.current.push(new libBeckiNotifications.Success("The moderator of interactions has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The moderator of interactions cannot be removed.", reason));
        });
  }

  onRemoveDeviceClick(id:string):void {
    "use strict";

    this.notifications.shift();
    // see https://youtrack.byzance.cz/youtrack/issue/TYRION-89
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-89"));
  }

  onRemoveTypeClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteIssueType(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The issue type has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The issue type cannot be removed.", reason));
        });
  }

  onRemoveConfirmationClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteIssueConfirmation(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The issue confirmation has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The issue confirmation cannot be removed.", reason));
        });
  }
}
