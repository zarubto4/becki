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
import * as libPatternFlyListView from "./lib-patternfly/list-view";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Component({
  templateUrl: "app/devices.html",
  directives: [layout.Component, libPatternFlyListView.Component, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ng.OnInit {

  breadcrumbs:layout.LabeledLink[];

  producers:libPatternFlyListView.Item[];

  libraries:libPatternFlyListView.Item[];

  libraryGroups:libPatternFlyListView.Item[];

  processors:libPatternFlyListView.Item[];

  boardTypes:libPatternFlyListView.Item[];

  boards:libPatternFlyListView.Item[];

  homers:libPatternFlyListView.Item[];

  backEnd:backEnd.Service;

  notifications:libPatternFlyNotifications.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, notifications:libPatternFlyNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new layout.LabeledLink("Devices", ["Devices"])
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

    this.backEnd.getProducers()
        .then(producers => this.producers = producers.map(producer => new libPatternFlyListView.Item(producer.id, producer.name, null, ["Producer", {producer: producer.id}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Producers cannot be loaded: ${reason}`)));
    this.backEnd.getLibraries()
        .then(libraries => this.libraries = libraries.map(library => new libPatternFlyListView.Item(library.id, library.library_name, library.description, ["Library", {library: library.id}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Libraries cannot be loaded: ${reason}`)));
    this.backEnd.getLibraryGroups()
        .then(groups => this.libraryGroups = groups.map(group => new libPatternFlyListView.Item(group.id, group.group_name, group.description, ["LibraryGroup", {group: group.id}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Library groups cannot be loaded: ${reason}`)));
    this.backEnd.getProcessors()
        .then(processors => this.processors = processors.map(processor => new libPatternFlyListView.Item(processor.id, processor.processor_name, processor.processor_code, ["Processor", {processor: processor.id}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Processors cannot be loaded: ${reason}`)));
    this.backEnd.getBoardTypes()
        .then(boardTypes => this.boardTypes = boardTypes.map(type => new libPatternFlyListView.Item(type.id, type.name, type.description, ["BoardType", {type: type.id}])))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Board types cannot be loaded: ${reason}`)));
    this.backEnd.getBoards()
        // see https://youtrack.byzance.cz/youtrack/issue/TYRION-70
        .then(boards => this.boards = boards.map(board => new libPatternFlyListView.Item(board.id, `${board.id} (issue/TYRION-70)`, board.isActive ? "active" : "inactive")))
        .catch(reason => this.notifications.current.push(new libPatternFlyNotifications.Danger(`Board types cannot be loaded: ${reason}`)));
    this.backEnd.getHomers()
        // see https://youtrack.byzance.cz/youtrack/issue/TYRION-71
        .then(homers => this.homers = homers.map(homer => new libPatternFlyListView.Item(homer.homer_id, `${homer.homer_id} (issue/TYRION-71)`, homer.online ? "online" : "offline")))
        .catch(reason => {
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-155
          this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-155"));
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`Homers cannot be loaded: ${reason}`));
        });
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
          this.notifications.current.push(new libPatternFlyNotifications.Success("The producer has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The producer cannot be removed: ${reason}`));
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
          this.notifications.current.push(new libPatternFlyNotifications.Success("The library has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The library cannot be removed: ${reason}`));
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
          this.notifications.current.push(new libPatternFlyNotifications.Success("The library group has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The library group cannot be removed: ${reason}`));
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
          this.notifications.current.push(new libPatternFlyNotifications.Success("The processor has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The processor cannot be removed: ${reason}`));
        });
  }

  onBoardTypeAddClick():void {
    "use strict";

    this.router.navigate(["NewBoardType"]);
  }

  onBoardTypeRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteBoardType(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The board type has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The board type cannot be removed: ${reason}`));
        });
  }

  onBoardAddClick():void {
    "use strict";

    this.router.navigate(["NewBoard"]);
  }

  onBoardRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    // see https://youtrack.byzance.cz/youtrack/issue/TYRION-89
    this.notifications.current.push(new libPatternFlyNotifications.Danger("issue/TYRION-89"));
  }

  onHomerAddClick():void {
    "use strict";

    this.router.navigate(["NewHomer"]);
  }

  onHomerRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.deleteHomer(id)
        .then(() => {
          this.notifications.current.push(new libPatternFlyNotifications.Success("The Homer has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libPatternFlyNotifications.Danger(`The Homer cannot be removed: ${reason}`));
        });
  }
}
