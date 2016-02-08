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
import * as libBackEnd from "./lib-back-end/index";
import * as wrapper from "./wrapper";

function composeDateString(date:Date):string {
  "use strict";

  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1).toString()).slice(-2);
  let day = ("0" + date.getDate().toString()).slice(-2);
  return `${year}-${month}-${day}`;
}

function composeTimeString(date:Date):string {
  "use strict";

  let hour = ("0" + date.getHours().toString()).slice(-2);
  let minute = ("0" + date.getMinutes().toString()).slice(-2);
  let second = ("0" + date.getSeconds().toString()).slice(-2);
  let fraction = ("00" + date.getMilliseconds().toString()).slice(-3);
  return `${hour}:${minute}:${second}.${fraction}`;
}

function parseDateTimeString(dateString:string, timeString:string):Date {
  "use strict";

  let dateStrings = /^(\d{4,})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!dateStrings) {
    throw "invalid date format";
  }

  let year = parseInt(dateStrings[1]);
  let month = parseInt(dateStrings[2]) - 1;
  let day = parseInt(dateStrings[3]);
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw "date component not a number";
  }

  let timeStrings = /^(\d{2}):(\d{2})(?::(\d{2})(?:.(\d+))?)?$/.exec(timeString);
  if (!timeStrings) {
    throw "invalid time format";
  }

  let hour = parseInt(timeStrings[1]);
  let minute = parseInt(timeStrings[2]);
  let second = timeStrings[3] ? parseInt(timeStrings[3]) : 0;
  let fraction = timeStrings[4] ? parseInt(timeStrings[4]) : 0;
  if (isNaN(hour) || isNaN(minute) || isNaN(second) || isNaN(fraction)) {
    throw "time component not a number";
  }

  let date = new Date(year, month, day, hour, minute, second, fraction);
  if (date.getFullYear() != year || date.getMonth() != month || date.getDate() != day || date.getHours() != hour || date.getMinutes() != minute || date.getSeconds() != second || date.getMilliseconds() != fraction) {
    throw "component out of range";
  }

  return date;
}

@ng.Component({
  templateUrl: "app/project-upload-new.html",
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component implements ng.OnInit {

  projectId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  boards:libBackEnd.Board[];

  homers:libBackEnd.Homer[];

  boardPrograms:any[];

  homerPrograms:libBackEnd.HomerProgram[];

  typeField:string;

  deviceField:string;

  programField:string;

  whenField:string;

  sinceDateField:string;

  sinceTimeField:string;

  untilDateField:string;

  untilTimeField:string;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    let now = new Date();
    this.projectId = routeParams.get("project");
    this.heading = `New Program Upload (Project ${this.projectId})`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("User", ["Projects"]),
      new wrapper.LabeledLink("Projects", ["Projects"]),
      new wrapper.LabeledLink(`Project ${this.projectId}`, ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("Program Uploads", ["Project", {project: this.projectId}]),
      new wrapper.LabeledLink("New Upload", ["NewProjectUpload", {project: this.projectId}])
    ];
    this.typeField = "";
    this.deviceField = "";
    this.programField = "";
    this.whenField = "";
    this.sinceDateField = composeDateString(now);
    this.sinceTimeField = composeTimeString(now);
    this.untilDateField = composeDateString(new Date(new Date(now.getTime()).setDate(now.getDate() + 7)));
    this.untilTimeField = this.sinceTimeField;
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onInit():void {
    "use strict";

    this.backEnd.getProject(this.projectId)
        .then((project) => {
          this.events.send(project);
          return Promise.all<any>([
            this.backEnd.request("GET", project.boards),
            this.backEnd.request("GET", project.homers),
            this.backEnd.request("GET", project.programs)
          ]);
        })
        .then(result => {
          this.events.send(result);
          [this.boards, this.homers, this.homerPrograms] = result;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-47
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-14
          this.boardPrograms = [];
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onSubmit():void {
    "use strict";

    let since:string;
    let until:string;
    let promise:Promise<string>;
    switch (this.typeField) {
      case "Board":
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-15
        return;
      case "Homer":
        switch (this.whenField) {
          case "Immediately":
            promise = this.backEnd.uploadToHomerNow(this.deviceField, this.programField);
            break;
          case "As soon as possible":
            until = parseDateTimeString(this.untilDateField, this.untilTimeField).getTime().toString();
            promise = this.backEnd.uploadToHomerAsap(this.deviceField, this.programField, until);
            break;
          case "Later":
            since = parseDateTimeString(this.sinceDateField, this.sinceTimeField).getTime().toString();
            until = parseDateTimeString(this.untilDateField, this.untilTimeField).getTime().toString();
            promise = this.backEnd.uploadToHomerLater(this.deviceField, this.programField, since, until);
            break;
          default:
            return;
        }
        break;
      default:
        return;
    }
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-43
    promise.then((message) => {
          this.events.send(message);
          this.router.navigate(["Project", {project: this.projectId}]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCancelClick():void {
    "use strict";

    this.router.navigate(["Project", {project: this.projectId}]);
  }
}
