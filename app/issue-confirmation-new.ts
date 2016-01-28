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
import * as libBackEnd from "./lib-back-end/index";
import * as libBootstrapFields from "./lib-bootstrap/fields";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/wrapper-form.html",
  directives: [form.Component, wrapper.Component]
})
export class Component {

  issueId:string;

  heading:string;

  breadcrumbs:wrapper.LabeledLink[];

  fields:libBootstrapFields.Field[];

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(routeParams:ngRouter.RouteParams, backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.issueId = routeParams.get("issue");
    this.heading = `New Confirmation (Issue ${this.issueId})`;
    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Issues", ["Issues"]),
      new wrapper.LabeledLink(`Issue ${this.issueId}`, ["Issue", {issue: this.issueId}]),
      new wrapper.LabeledLink("Confirmations", ["Issue", {issue: this.issueId}]),
      new wrapper.LabeledLink("New Confirmation", ["NewIssueConfirmation", {issue: this.issueId}])
    ];
    this.fields = [new libBootstrapFields.Field("Text", "")];
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onFieldChange():void {
    "use strict";
  }

  onSubmit():void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-31
    this.backEnd.addConfirmationToPost(this.issueId, this.fields[0].model)
        .then((message) => {
          this.events.send(message);
          this.router.navigate(["Issue", {issue: this.issueId}]);
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onCancel():void {
    "use strict";

    this.router.navigate(["Issue", {issue: this.issueId}]);
  }
}
