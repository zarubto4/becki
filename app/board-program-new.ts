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
import * as events from "./events";
import * as form from "./form";
import * as libBackEnd from "./lib-back-end";
import * as libBootstrapFieldSelect from "./lib-bootstrap/field-select";
import * as libBootstrapFields from "./lib-bootstrap/fields";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/wrapper-form.html",
  directives: [form.Component, wrapper.Component]
})
export class Component implements ng.OnInit {

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  fields:libBootstrapFields.Field[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.projectId = routeParams.get("project");
    this.heading = `New Board Program (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("User", ["Projects"]),
      new wrapper.LabeledLink("Projects", ["Projects"]),
      new wrapper.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("Board Programs", ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("New Board Program", ["NewBoardProgram", {project: this.projectId}])
    ];
    this.fields = [
      new libBootstrapFields.Field("Libraries", "", "select", "glyphicon-book", [], true),
      new libBootstrapFields.Field("Groups of libraries", "", "select", "glyphicon-book", [], true),
      new libBootstrapFields.Field("Code", "", "c", "glyphicon-console"),
      new libBootstrapFields.Field("Board", "", "select", "glyphicon-list")
    ];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getLibraries()
        .then(libraries => {
          this.events.send(libraries);
          this.fields[0].options = libraries.map(library => new libBootstrapFieldSelect.Option(`${library.libraryName} ${library.lastVersion}`, JSON.stringify({libraryId: library.id, libraryVersion: library.lastVersion.toString()})));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getLibraryGroups()
        .then(groups => {
          this.events.send(groups);
          this.fields[1].options = groups.map(group => new libBootstrapFieldSelect.Option(`${group.groupName} ${group.lastVersion}`, JSON.stringify({groupId: group.id, libraryVersion: group.lastVersion.toString()})));
        })
        .catch(reason => {
          this.events.send(reason);
        });
    this.backEnd.getProject(this.projectId)
        .then(project => {
          this.events.send(project);
          return this.backEnd.request<libBackEnd.Board[]>("GET", project.boards);
        })
        .then(boards => {
          this.events.send(boards);
          this.fields[3].options = boards.map(board => new libBootstrapFieldSelect.Option(board.id, board.id));
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onFieldChange():void {
    "use strict";
  }

  onSubmit():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-47
    // TODO: https://github.com/angular/angular/issues/4427
    let libraries = this.fields[0].options.filter(option => option.selected).map(option => JSON.parse(option.value));
    let libraryGroups = this.fields[1].options.filter(option => option.selected).map(option => JSON.parse(option.value));
    this.backEnd.createBoardProgram(libraries, libraryGroups, this.fields[2].model, this.fields[3].model)
        .then((message) => {
          this.events.send(message);
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCancel():void {
    "use strict";

    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
