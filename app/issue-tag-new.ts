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

@ng.Component({
  templateUrl: "app/issue-tag-new.html",
  directives: [ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component {

  issueId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  field:string;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.issueId = routeParams.get("issue");
    this.heading = `New Tag (Issue ${this.issueId})`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Issues", ["Issues"]),
      new wrapper.LabeledLink(`Issue ${this.issueId}`, ["Issue", {issue: this.issueId}]),
      new wrapper.LabeledLink("Tags", ["Issue", {issue: this.issueId}]),
      new wrapper.LabeledLink("New Tag", ["NewIssueTag", {issue: this.issueId}])
    ];
    this.field = "";
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onSubmit():void {
    "use strict";

    Promise.all<any>([
          this.backEnd.getIssueTypes(),
          this.backEnd.getIssue(this.issueId)
        ])
        .then(result => {
          this.events.send(result);
          let types:libBackEnd.IssueType[];
          let issue:libBackEnd.Issue;
          [types, issue] = result;
          return Promise.all<any>([
            types,
            issue,
            this.backEnd.request("GET", issue.textOfPost)
          ]);
        })
        .then(result => {
          this.events.send(result);
          let types:libBackEnd.IssueType[];
          let issue:libBackEnd.Issue;
          let body:string;
          [types, issue, body] = result;
          // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-61
          let type = types.filter(type => type.type == issue.type)[0].id;
          return this.backEnd.updateIssue(this.issueId, type, issue.name, body, (issue.hashTags || []).concat(this.field));
        })
        .then(message => {
          this.events.send(message);
          this.router.navigate(["Issue", {issue: this.issueId}]);
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onCancelClick():void {
    "use strict";

    this.router.navigate(["Issue", {issue: this.issueId}]);
  }
}
