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
import * as events from "./events";
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/devices.html",
  directives: [libBootstrapPanelList.Component, wrapper.Component]
})
export class Component implements ng.OnInit {

  breadcrumbs:wrapper.LabeledLink[];

  producers:libBootstrapPanelList.Item[];

  libraries:libBootstrapPanelList.Item[];

  libraryGroups:libBootstrapPanelList.Item[];

  processors:libBootstrapPanelList.Item[];

  boardTypes:libBootstrapPanelList.Item[];

  boards:libBootstrapPanelList.Item[];

  homers:libBootstrapPanelList.Item[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Devices", ["Devices"])
    ];
    this.boards = [
      new libBootstrapPanelList.Item(null, "(issue/TYRION-20)", "does not work"),
      new libBootstrapPanelList.Item(null, "(issue/TYRION-20)", "does not work"),
      new libBootstrapPanelList.Item(null, "(issue/TYRION-20)", "does not work")
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.refresh();
  }

  refresh():void {
    "use strict";

    this.backEnd.getProducers()
        .then(producers => {
          this.events.send(producers);
          this.producers = producers.map(producer => new libBootstrapPanelList.Item(producer.id, producer.name, null, ["Producer", {producer: producer.id}]));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getLibraries()
        .then(libraries => {
          this.events.send(libraries);
          this.libraries = libraries.map(library => new libBootstrapPanelList.Item(library.id, library.libraryName, library.description, ["Library", {library: library.id}]));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getLibraryGroups()
        .then(groups => {
          this.events.send(groups);
          this.libraryGroups = groups.map(group => new libBootstrapPanelList.Item(group.id, group.groupName, group.description, ["LibraryGroup", {group: group.id}]));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getProcessors()
        .then(processors => {
          this.events.send(processors);
          this.processors = processors.map(processor => new libBootstrapPanelList.Item(processor.id, processor.processorName, processor.processorCode, ["Processor", {processor: processor.id}]));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getBoardTypes()
        .then(boardTypes => {
          this.events.send(boardTypes);
          this.boardTypes = boardTypes.map(type => new libBootstrapPanelList.Item(type.id, type.name, null, ["BoardType", {type: type.id}]));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getHomers()
        .then(homers => {
          this.events.send(homers);
          this.homers = homers.map(homer => new libBootstrapPanelList.Item(homer.homerId, homer.homerId, homer.typeOfDevice));
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onProducerAddClick():void {
    "use strict";

    this.router.navigate(["NewProducer"]);
  }

  onProducersRemoveClick(ids:string[]):void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-87
    alert("issue/TYRION-87");
  }

  onLibraryAddClick():void {
    "use strict";

    this.router.navigate(["NewLibrary"]);
  }

  onLibrariesRemoveClick(ids:string[]):void {
    "use strict";

    Promise.all(ids.map(id => this.backEnd.deleteLibrary(id)))
        .then(messages => {
          this.events.send(messages);
          this.refresh();
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onLibraryGroupAddClick():void {
    "use strict";

    this.router.navigate(["NewLibraryGroup"]);
  }

  onLibraryGroupsRemoveClick(ids:string[]):void {
    "use strict";

    Promise.all(ids.map(id => this.backEnd.deleteLibraryGroup(id)))
        .then(messages => {
          this.events.send(messages);
          this.refresh();
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onProcessorAddClick():void {
    "use strict";

    this.router.navigate(["NewProcessor"]);
  }

  onBoardTypeAddClick():void {
    "use strict";

    this.router.navigate(["NewBoardType"]);
  }

  onBoardAddClick():void {
    "use strict";

    this.router.navigate(["NewBoard"]);
  }

  onHomerAddClick():void {
    "use strict";

    this.router.navigate(["NewHomer"]);
  }
}
