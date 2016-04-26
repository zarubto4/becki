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

  tab:string[];

  moderators:libPatternFlyListView.Item[];

  devices:libPatternFlyListView.Item[];

  libraryGroups:libPatternFlyListView.Item[];

  libraries:libPatternFlyListView.Item[];

  issueTypes:libPatternFlyListView.Item[];

  issueConfirmations:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["System"])
    ];
    this.tab = ["moderators"];
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

    this.backEnd.getInteractionsModerators()
        // see https://youtrack.byzance.cz/youtrack/issue/TYRION-71
        .then(moderators => this.moderators = moderators.map(moderator => new libPatternFlyListView.Item(moderator.id, `${moderator.id} (issue/TYRION-71)`, moderator.type_of_device, undefined, moderator.delete_permission)))
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-155
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-155"));
          this.notifications.current.push(new libBeckiNotifications.Danger("Moderators of interactions cannot be loaded.", reason));
        });
    this.backEnd.getDevices()
        // see https://youtrack.byzance.cz/youtrack/issue/TYRION-70
        .then(devices => this.devices = devices.map(device => new libPatternFlyListView.Item(device.id, `${device.id} (issue/TYRION-70)`, device.type_of_board.name, undefined, device.delete_permission)))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Devices cannot be loaded.", reason)));
    this.backEnd.getLibraryGroups()
        .then(groups => this.libraryGroups = groups.map(group => new libPatternFlyListView.Item(group.id, group.group_name, group.description, ["SystemLibraryGroup", {group: group.id}])))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Library groups cannot be loaded.", reason)));
    this.backEnd.getLibraries()
        .then(libraries => this.libraries = libraries.map(library => new libPatternFlyListView.Item(library.id, library.library_name, library.description, ["SystemLibrary", {library: library.id}])))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Libraries cannot be loaded.", reason)));
    this.backEnd.getIssueTypes()
        .then(types => this.issueTypes = types.map(type => new libPatternFlyListView.Item(type.id, type.type, null, ["SystemIssueType", {type: type.id}])))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Issue types cannot be loaded.", reason)));
    this.backEnd.getIssueConfirmations()
        .then(confirmations => this.issueConfirmations = confirmations.map(confirmation => new libPatternFlyListView.Item(confirmation.id, confirmation.type, null, ["SystemIssueConfirmation", {confirmation: confirmation.id}], confirmation.delete_permission)))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Issue confirmations cannot be loaded.", reason)));
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-186
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-186"));
  }

  onAddClick():void {
    "use strict";

    switch (this.tab[0]) {
      case "moderators":
        this.onAddModeratorClick();
        break;
      case "devices":
        switch (this.tab[1]) {
          case "devices":
            this.onAddDeviceClick();
            break;
          case "groups":
            this.onAddLibraryGroupClick();
            break;
          case "libraries":
            this.onAddLibraryClick();
            break;
        }
        break;
      case "issues":
        switch (this.tab[1]) {
          case "types":
            this.onAddIssueTypeClick();
            break;
          case "confirmations":
            this.onAddIssueConfirmationClick();
            break;
        }
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

  onAddLibraryGroupClick():void {
    "use strict";

    this.router.navigate(["NewSystemLibraryGroup"]);
  }

  onAddLibraryClick():void {
    "use strict";

    this.router.navigate(["NewSystemLibrary"]);
  }

  onAddIssueTypeClick():void {
    "use strict";

    this.router.navigate(["NewSystemIssueType"]);
  }

  onAddIssueConfirmationClick():void {
    "use strict";

    this.router.navigate(["NewSystemIssueConfirmation"]);
  }

  onTabClick(tab:string[]):void {
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

  onRemoveLibraryGroupClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteLibraryGroup(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The library group has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The library group cannot be removed.", reason));
        });
  }

  onRemoveLibraryClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteLibrary(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The library has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The library cannot be removed.", reason));
        });
  }

  onRemoveIssueTypeClick(id:string):void {
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

  onRemoveIssueConfirmationClick(id:string):void {
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
