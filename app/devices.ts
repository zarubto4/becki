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
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/devices.html",
  directives: [layout.Component, libBootstrapPanelList.Component]
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  producers:libBootstrapPanelList.Item[];

  libraries:libBootstrapPanelList.Item[];

  libraryGroups:libBootstrapPanelList.Item[];

  processors:libBootstrapPanelList.Item[];

  boardTypes:libBootstrapPanelList.Item[];

  boards:libBootstrapPanelList.Item[];

  homers:libBootstrapPanelList.Item[];

  progress:number;

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Devices", ["Devices"])
    ];
    this.boards = [
      new libBootstrapPanelList.Item(null, "(issue/TYRION-20)", "does not work"),
      new libBootstrapPanelList.Item(null, "(issue/TYRION-20)", "does not work"),
      new libBootstrapPanelList.Item(null, "(issue/TYRION-20)", "does not work")
    ];
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

    this.progress += 6;
    this.backEnd.getProducers()
        .then(producers => this.producers = producers.map(producer => new libBootstrapPanelList.Item(producer.id, producer.name, null, ["Producer", {producer: producer.id}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Producers cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getLibraries()
        .then(libraries => this.libraries = libraries.map(library => new libBootstrapPanelList.Item(library.id, library.libraryName, library.description, ["Library", {library: library.id}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Libraries cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getLibraryGroups()
        .then(groups => this.libraryGroups = groups.map(group => new libBootstrapPanelList.Item(group.id, group.groupName, group.description, ["LibraryGroup", {group: group.id}])))
        .catch(reason =>this.notifications.current.push(new libPatternFlyNotifications.Danger(`Library groups cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getProcessors()
        .then(processors => this.processors = processors.map(processor => new libBootstrapPanelList.Item(processor.id, processor.processorName, processor.processorCode, ["Processor", {processor: processor.id}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Processors cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getBoardTypes()
        .then(boardTypes => this.boardTypes = boardTypes.map(type => new libBootstrapPanelList.Item(type.id, type.name, null, ["BoardType", {type: type.id}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Board types cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getHomers()
        .then(homers => this.homers = homers.map(homer => new libBootstrapPanelList.Item(homer.homerId, homer.homerId, homer.typeOfDevice)))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Homers cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onProducerAddClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["NewProducer"]);
  }

  onProducersRemoveClick(ids:string[]):void {
    "use strict";

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-87
    this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-87"));
  }

  onLibraryAddClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["NewLibrary"]);
  }

  onLibrariesRemoveClick(ids:string[]):void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    Promise.all(ids.map(id => this.backEnd.deleteLibrary(id)))
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("Libraries have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`Libraries cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onLibraryGroupAddClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["NewLibraryGroup"]);
  }

  onLibraryGroupsRemoveClick(ids:string[]):void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    Promise.all(ids.map(id => this.backEnd.deleteLibraryGroup(id)))
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("Library groups have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`Library groups cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onProcessorAddClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["NewProcessor"]);
  }

  onProcessorsRemoveClick(ids:string[]):void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    Promise.all(ids.map(id => this.backEnd.deleteProcessor(id)))
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("Processors have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`Processors cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onBoardTypeAddClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["NewBoardType"]);
  }

  onBoardTypesRemoveClick(ids:string[]):void {
    "use strict";

    this.notifications.shift();
    this.progress += 1;
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-88
    Promise.all(ids.map(id => this.backEnd.deleteBoardType(id)))
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("Board types have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`Board types cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onBoardAddClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["NewBoard"]);
  }

  onBoardsRemoveClick(ids:string[]):void {
    "use strict";

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-89
    this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-89"));
  }

  onHomerAddClick():void {
    "use strict";

    this.notifications.shift();
    this.router.navigate(["NewHomer"]);
  }

  onHomersRemoveClick(ids:string[]):void {
    "use strict";

    this.notifications.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-90
    this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-90"));
  }
}
