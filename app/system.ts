/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ngCore.Component({
  templateUrl: "app/system.html",
  directives: [libPatternFlyListView.Component, libBeckiLayout.Component, ngCommon.CORE_DIRECTIVES],
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  tab:string[];

  moderators:libPatternFlyListView.Item[];

  interactionsServers:libPatternFlyListView.Item[];

  devices:libPatternFlyListView.Item[];

  deviceTypes:libPatternFlyListView.Item[];

  processors:libPatternFlyListView.Item[];

  libraryGroups:libPatternFlyListView.Item[];

  libraries:libPatternFlyListView.Item[];

  producers:libPatternFlyListView.Item[];

  compilationServers:libPatternFlyListView.Item[];

  issueTypes:libPatternFlyListView.Item[];

  issueConfirmations:libPatternFlyListView.Item[];

  users:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("System", ["System"])
    ];
    this.tab = ['interactions', 'moderators'];
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.notifications.shift();
    this.refresh();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-246
    this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-246"));
  }

  refresh():void {
    "use strict";

    // see https://youtrack.byzance.cz/youtrack/issue/TYRION-71
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-155
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-155"));
    this.moderators = [];
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    this.backEnd.getInteractionsServers()
        .then(servers => this.interactionsServers = servers.map(server =>
            new libPatternFlyListView.Item(server.id, server.server_name, server.destination_address, null, server.delete_permission)))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Interactions servers cannot be loaded.", reason)));
    this.backEnd.getDevices(1)
        // see https://youtrack.byzance.cz/youtrack/issue/TYRION-70
        .then(devices => this.devices = devices.map(device => new libPatternFlyListView.Item(device.id, `${device.id} (issue/TYRION-70)`, device.isActive ? "active" : "inactive")))
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-253
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-253"));
          this.notifications.current.push(new libBeckiNotifications.Danger("Devices cannot be loaded.", reason));
        });
    this.backEnd.getDeviceTypes()
        .then(deviceTypes => this.deviceTypes = deviceTypes.map(type => new libPatternFlyListView.Item(type.id, type.name, type.description, ["SystemDeviceType", {type: type.id}])))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Device types cannot be loaded.", reason)));
    this.backEnd.getProcessors()
        .then(processors => this.processors = processors.map(processor => new libPatternFlyListView.Item(processor.id, processor.processor_name, processor.processor_code, ["SystemProcessor", {processor: processor.id}])))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Processors cannot be loaded.", reason)));
    this.backEnd.getLibraryGroups()
        .then(groups => this.libraryGroups = groups.map(group => new libPatternFlyListView.Item(group.id, group.group_name, group.description, ["SystemLibraryGroup", {group: group.id}])))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Library groups cannot be loaded.", reason)));
    this.backEnd.getLibraries()
        .then(libraries => this.libraries = libraries.map(library => new libPatternFlyListView.Item(library.id, library.library_name, library.description, ["SystemLibrary", {library: library.id}])))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Libraries cannot be loaded.", reason)));
    this.backEnd.getProducers()
        .then(producers => this.producers = producers.map(producer => new libPatternFlyListView.Item(producer.id, producer.name, producer.description, ["SystemProducer", {producer: producer.id}])))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Producers cannot be loaded.", reason)));
    this.backEnd.getCompilationServers()
        .then(servers => this.compilationServers = servers.map(server =>
            new libPatternFlyListView.Item(server.id, server.server_name, server.destination_address)))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Compilation servers cannot be loaded.", reason)));
    this.backEnd.getIssueTypes()
        .then(types => this.issueTypes = types.map(type => new libPatternFlyListView.Item(type.id, type.type, null, ["SystemIssueType", {type: type.id}])))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Issue types cannot be loaded.", reason)));
    this.backEnd.getIssueConfirmations()
        .then(confirmations => this.issueConfirmations = confirmations.map(confirmation => new libPatternFlyListView.Item(confirmation.id, confirmation.type, null, ["SystemIssueConfirmation", {confirmation: confirmation.id}])))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Issue confirmations cannot be loaded.", reason)));
    this.backEnd.getUsers()
        .then(users => this.users = users.map(user => new libPatternFlyListView.Item(user.id, libBackEnd.composeUserString(user), "", ["User", {user: user.id}])))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Device types cannot be loaded.", reason)));
  }

  onAddClick():void {
    "use strict";

    switch (this.tab[0]) {
      case "interactions":
        switch (this.tab[1]) {
          case "moderators":
            this.onAddModeratorClick();
            break;
        }
        break;
      case "devices":
        switch (this.tab[1]) {
          case "devices":
            this.onAddDeviceClick();
            break;
          case "types":
            this.onAddDeviceTypeClick();
            break;
          case "processors":
            this.onAddProcessorClick();
            break;
          case "groups":
            this.onAddLibraryGroupClick();
            break;
          case "libraries":
            this.onAddLibraryClick();
            break;
          case "producers":
            this.onAddProducerClick();
            break;
          case "servers":
            this.onAddCompilationServerClick();
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

  onAddDeviceTypeClick():void {
    "use strict";

    this.router.navigate(["NewSystemDeviceType"]);
  }

  onAddProcessorClick():void {
    "use strict";

    this.router.navigate(["NewSystemProcessor"]);
  }

  onAddLibraryGroupClick():void {
    "use strict";

    this.router.navigate(["NewSystemLibraryGroup"]);
  }

  onAddLibraryClick():void {
    "use strict";

    this.router.navigate(["NewSystemLibrary"]);
  }

  onAddProducerClick():void {
    "use strict";

    this.router.navigate(["NewSystemProducer"]);
  }

  onAddCompilationServerClick():void {
    "use strict";
    this.router.navigate(["NewSystemCompilationServer"]);
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

  onRemoveInteractionsServerClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteInteractionsServer(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The interactions server has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The interactions server cannot be removed.", reason));
        });
  }

  onRemoveDeviceClick(id:string):void {
    "use strict";

    this.notifications.shift();
    // see https://youtrack.byzance.cz/youtrack/issue/TYRION-89
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-89"));
  }

  onRemoveDeviceTypeClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteDeviceType(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The device type has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The device type cannot be removed.", reason));
        });
  }

  onRemoveProcessorClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteProcessor(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The processor has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The processor cannot be removed.", reason));
        });
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

  onRemoveProducerClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteProducer(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The producer has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The producer cannot be removed.", reason));
        });
  }

  onRemoveCompilationServerClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteCompilationServer(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The compilation server has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The compilation server cannot be removed.", reason));
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
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-229
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-229"));
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
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-227
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-227"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The issue confirmation cannot be removed.", reason));
        });
  }

  onRemoveUserClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteUser(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The user has been removed."));
          this.refresh();
        })
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-248
          this.notifications.current.push(new libBeckiNotifications.Warning("issue/TYRION-248"));
          this.notifications.current.push(new libBeckiNotifications.Danger("The user cannot be removed.", reason));
        });
  }
}
