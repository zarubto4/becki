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

  newProducerLink:any[];

  libraries:libBootstrapPanelList.Item[];

  newLibraryLink:any[];

  libraryGroups:libBootstrapPanelList.Item[];

  newLibraryGroupLink:any[];

  processors:libBootstrapPanelList.Item[];

  newProcessorLink:any[];

  boardTypes:libBootstrapPanelList.Item[];

  newBoardTypeLink:any[];

  boards:libBootstrapPanelList.Item[];

  newBoardLink:any[];

  homers:libBootstrapPanelList.Item[];

  newHomerLink:any[];

  backEnd:backEnd.Service;

  events:events.Service;

  constructor(backEndService:backEnd.Service, eventsService:events.Service) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Devices", ["Devices"])
    ];
    this.newProducerLink = ["NewProducer"];
    this.newLibraryLink = ["NewLibrary"];
    this.newLibraryGroupLink = ["NewLibraryGroup"];
    this.newProcessorLink = ["NewProcessor"];
    this.newBoardTypeLink = ["NewBoardType"];
    this.boards = [
      new libBootstrapPanelList.Item(null, "(issue/TYRION-20)", "does not work"),
      new libBootstrapPanelList.Item(null, "(issue/TYRION-20)", "does not work"),
      new libBootstrapPanelList.Item(null, "(issue/TYRION-20)", "does not work")
    ];
    this.newBoardLink = ["NewBoard"];
    this.newHomerLink = ["NewHomer"];
    this.backEnd = backEndService;
    this.events = eventsService;
  }

  onInit():void {
    "use strict";

    this.backEnd.getProducers()
        .then(producers => {
          this.events.send(producers);
          this.producers = producers.map(producer => new libBootstrapPanelList.Item(producer.id, producer.name, null));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getLibraries()
        .then(libraries => {
          this.events.send(libraries);
          this.libraries = libraries.map(library => new libBootstrapPanelList.Item(library.id, library.libraryName, library.lastVersion.toString()));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getLibraryGroups()
        .then(groups => {
          this.events.send(groups);
          this.libraryGroups = groups.map(group => new libBootstrapPanelList.Item(group.id, group.groupName, group.description));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getProcessors()
        .then(processors => {
          this.events.send(processors);
          this.processors = processors.map(processor => new libBootstrapPanelList.Item(processor.id, processor.processorName, processor.processorCode));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getBoardTypes()
        .then(boardTypes => {
          this.events.send(boardTypes);
          this.boardTypes = boardTypes.map(type => new libBootstrapPanelList.Item(type.id, type.name, null));
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

  getProducerLink(producer:libBootstrapPanelList.Item):any[] {
    "use strict";

    return ["Producer", {producer: producer.id}];
  }

  getLibraryLink(library:libBootstrapPanelList.Item):any[] {
    "use strict";

    return ["Library", {library: library.id}];
  }

  getLibraryGroupLink(group:libBootstrapPanelList.Item):any {
    "use strict";

    return ["LibraryGroup", {group: group.id}];
  }

  getProcessorLink(processor:libBootstrapPanelList.Item):any {
    "use strict";

    return ["Processor", {processor: processor.id}];
  }

  getBoardTypeLink(type:libBootstrapPanelList.Item):any {
    "use strict";

    return ["BoardType", {type: type.id}];
  }
}
