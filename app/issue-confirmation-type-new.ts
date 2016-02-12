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
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/issue-confirmation-type-new.html",
  directives: [ng.FORM_DIRECTIVES, wrapper.Component]
})
export class Component {

  breadcrumbs:wrapper.LabeledLink[];

  nameField:string;

  colorField:string;

  sizeField:number;

  backEnd:backEnd.Service;

  events:events.Service;

  router:ngRouter.Router;

  constructor(backEndService:backEnd.Service, eventsService:events.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new wrapper.LabeledLink("Issues", ["Issues"]),
      new wrapper.LabeledLink("Confirmations", ["Issues"]),
      new wrapper.LabeledLink("New Confirmation", ["NewIssueConfirmationType"]),
    ];
    this.nameField = "";
    this.colorField = "#ffffff";
    this.sizeField = 12;
    this.backEnd = backEndService;
    this.events = eventsService;
    this.router = router;
  }

  onSubmit():void {
    "use strict";

    this.backEnd.createIssueConfirmation(this.nameField, this.colorField, this.sizeField)
        .then(message => {
          this.events.send(message);
          this.router.navigate(["Issues"]);
        })
        .catch(reason => {
          this.events.send(reason);
        });
  }

  onCancelClick():void {
    "use strict";

    this.router.navigate(["Issues"]);
  }
}
