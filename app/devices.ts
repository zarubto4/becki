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

import * as libBackEnd from "./lib-back-end/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

@ng.Component({
  templateUrl: "app/devices.html",
  directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ng.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  addProducer:boolean;

  producers:libPatternFlyListView.Item[];

  addLibrary:boolean;

  libraries:libPatternFlyListView.Item[];

  addLibraryGroup:boolean;

  libraryGroups:libPatternFlyListView.Item[];

  addProcessor:boolean;

  processors:libPatternFlyListView.Item[];

  addDeviceType:boolean;

  deviceTypes:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("Devices", ["Devices"])
    ];
    this.addProducer = false;
    this.addLibrary = false;
    this.addLibraryGroup = false;
    this.addProcessor = false;
    this.addDeviceType = false;
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

    this.backEnd.getUserRolesAndPermissionsCurrent()
        .then(currentPermissions => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-192
          this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-192"));
          this.addProducer = libBackEnd.containsPermissions(currentPermissions, ["producer.create"]);
          let viewProducers = libBackEnd.containsPermissions(currentPermissions, ["producer.edit"]);
          let hasProducerPermission = libBackEnd.containsPermissions(currentPermissions, ["producer.read"]);
          if (hasProducerPermission) {
            this.backEnd.getProducers()
                .then(producers => this.producers = producers.map(producer => new libPatternFlyListView.Item(producer.id, producer.name, null, hasProducerPermission ? ["Producer", {producer: producer.id}] : undefined, hasProducerPermission)))
                .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Producers cannot be loaded.", reason)));
          } else {
            this.producers = [];
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view producers."));
          }
          this.addLibrary = libBackEnd.containsPermissions(currentPermissions, ["library.create"]);
          let viewLibraries = libBackEnd.containsPermissions(currentPermissions, ["libraryGroup.read"]);
          let viewLibrary = libBackEnd.containsPermissions(currentPermissions, ["library.read"]);
          let deleteLibrary = libBackEnd.containsPermissions(currentPermissions, ["library.delete"]);
          if (viewLibraries) {
            this.backEnd.getLibraries()
                .then(libraries => this.libraries = libraries.map(library => new libPatternFlyListView.Item(library.id, library.library_name, library.description, viewLibrary ? ["Library", {library: library.id}] : undefined, deleteLibrary)))
                .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Libraries cannot be loaded.", reason)));
          } else {
            this.libraries = [];
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view libraries."));
          }
          this.addLibraryGroup = libBackEnd.containsPermissions(currentPermissions, ["libraryGroup.create"]);
          let viewLibraryGroup = libBackEnd.containsPermissions(currentPermissions, ["libraryGroup.read"]);
          let deleteLibraryGroup = libBackEnd.containsPermissions(currentPermissions, ["libraryGroup.delete"]);
          if (viewLibraryGroup) {
            this.backEnd.getLibraryGroups()
                .then(groups => this.libraryGroups = groups.map(group => new libPatternFlyListView.Item(group.id, group.group_name, group.description, viewLibraryGroup ? ["LibraryGroup", {group: group.id}] : undefined, deleteLibraryGroup)))
                .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Library groups cannot be loaded.", reason)));
          } else {
            this.libraryGroups = [];
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view library groups."));
          }
          this.addProcessor = libBackEnd.containsPermissions(currentPermissions, ["processor.create"]);
          let hasProcessorPermission = libBackEnd.containsPermissions(currentPermissions, ["processor.read"]);
          if (hasProcessorPermission) {
            this.backEnd.getProcessors()
                .then(processors => this.processors = processors.map(processor => new libPatternFlyListView.Item(processor.id, processor.processor_name, processor.processor_code, hasProcessorPermission ? ["Processor", {processor: processor.id}] : undefined, hasProcessorPermission)))
                .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Processors cannot be loaded.", reason)));
          } else {
            this.processors = [];
            this.notifications.current.push(new libBeckiNotifications.Danger("You are not allowed to view processors."));
          }
          this.addDeviceType = libBackEnd.containsPermissions(currentPermissions, ["type_of_board.create"]);
        })
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger(`Permissions cannot be loaded.`, reason)));
    this.backEnd.getDeviceTypes()
        .then(deviceTypes => this.deviceTypes = deviceTypes.map(type => new libPatternFlyListView.Item(type.id, type.name, type.description, ["DeviceType", {type: type.id}])))
        .catch(reason => this.notifications.current.push(new libBeckiNotifications.Danger("Device types cannot be loaded.", reason)));
  }

  onProducerAddClick():void {
    "use strict";

    this.router.navigate(["NewProducer"]);
  }

  onProducerRemoveClick(id:string):void {
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

  onLibraryAddClick():void {
    "use strict";

    this.router.navigate(["NewLibrary"]);
  }

  onLibraryRemoveClick(id:string):void {
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

  onLibraryGroupAddClick():void {
    "use strict";

    this.router.navigate(["NewLibraryGroup"]);
  }

  onLibraryGroupRemoveClick(id:string):void {
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

  onProcessorAddClick():void {
    "use strict";

    this.router.navigate(["NewProcessor"]);
  }

  onProcessorRemoveClick(id:string):void {
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

  onDeviceTypeAddClick():void {
    "use strict";

    this.router.navigate(["NewDeviceType"]);
  }

  onDeviceTypeRemoveClick(id:string):void {
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
}
