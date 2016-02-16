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
import * as libBootstrapAlerts from "./lib-bootstrap/alerts";
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

  progress:number;

  backEnd:backEnd.Service;

  alerts:libBootstrapAlerts.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, alerts:libBootstrapAlerts.Service, router:ngRouter.Router) {
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
    this.progress = 0;
    this.backEnd = backEndService;
    this.alerts = alerts;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.alerts.shift();
    this.refresh();
  }

  refresh():void {
    "use strict";

    this.progress += 6;
    this.backEnd.getProducers()
        .then(producers => this.producers = producers.map(producer => new libBootstrapPanelList.Item(producer.id, producer.name, null, ["Producer", {producer: producer.id}])))
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Producers cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getLibraries()
        .then(libraries => this.libraries = libraries.map(library => new libBootstrapPanelList.Item(library.id, library.libraryName, library.description, ["Library", {library: library.id}])))
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Libraries cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getLibraryGroups()
        .then(groups => this.libraryGroups = groups.map(group => new libBootstrapPanelList.Item(group.id, group.groupName, group.description, ["LibraryGroup", {group: group.id}])))
        .catch(reason =>this.alerts.current.push(new libBootstrapAlerts.Danger(`Library groups cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getProcessors()
        .then(processors => this.processors = processors.map(processor => new libBootstrapPanelList.Item(processor.id, processor.processorName, processor.processorCode, ["Processor", {processor: processor.id}])))
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Processors cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getBoardTypes()
        .then(boardTypes => this.boardTypes = boardTypes.map(type => new libBootstrapPanelList.Item(type.id, type.name, null, ["BoardType", {type: type.id}])))
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Board types cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
    this.backEnd.getHomers()
        .then(homers => this.homers = homers.map(homer => new libBootstrapPanelList.Item(homer.homerId, homer.homerId, homer.typeOfDevice)))
        .catch(reason => this.alerts.current.push(new libBootstrapAlerts.Danger(`Homers cannot be loaded: ${reason}`)))
        .then(() => this.progress -= 1);
  }

  onProducerAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewProducer"]);
  }

  onProducersRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-87
    this.alerts.current.push(new libBootstrapAlerts.Danger("issue/TYRION-87"));
  }

  onLibraryAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewLibrary"]);
  }

  onLibrariesRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    Promise.all(ids.map(id => this.backEnd.deleteLibrary(id)))
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("Libraries have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`Libraries cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onLibraryGroupAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewLibraryGroup"]);
  }

  onLibraryGroupsRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    Promise.all(ids.map(id => this.backEnd.deleteLibraryGroup(id)))
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("Library groups have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`Library groups cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onProcessorAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewProcessor"]);
  }

  onProcessorsRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    Promise.all(ids.map(id => this.backEnd.deleteProcessor(id)))
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("Processors have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`Processors cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onBoardTypeAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewBoardType"]);
  }

  onBoardTypesRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    this.progress += 1;
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-88
    Promise.all(ids.map(id => this.backEnd.deleteBoardType(id)))
        .then(() => {
          this.alerts.current.push(new libBootstrapAlerts.Success("Board types have been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.alerts.current.push(new libBootstrapAlerts.Danger(`Board types cannot be removed: ${reason}`));
        })
        .then(() => {
          this.progress -= 1;
        });
  }

  onBoardAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewBoard"]);
  }

  onBoardsRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-89
    this.alerts.current.push(new libBootstrapAlerts.Danger("issue/TYRION-89"));
  }

  onHomerAddClick():void {
    "use strict";

    this.alerts.shift();
    this.router.navigate(["NewHomer"]);
  }

  onHomersRemoveClick(ids:string[]):void {
    "use strict";

    this.alerts.shift();
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-90
    this.alerts.current.push(new libBootstrapAlerts.Danger("issue/TYRION-90"));
  }
}
