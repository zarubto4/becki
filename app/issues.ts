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
import * as libAdminlteFields from "./lib-adminlte/fields";
import * as libAdminlteInbox from "./lib-adminlte/inbox";
import * as libAdminlteTable from "./lib-adminlte/table";
import * as libAdminlteTableWithActions from "./lib-adminlte/table-with-actions";
import * as libAdminlteWrapper from "./lib-adminlte/wrapper";
import * as libBackEnd from "./lib-back-end/index";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/issues.html",
  directives: [libAdminlteInbox.Component, libAdminlteTableWithActions.Component, wrapper.Component],
})
export class Component implements ng.OnInit {

  breadcrumbs:libAdminlteWrapper.LabeledLink[];

  types:libBackEnd.IssueType[];

  typeProperties:libAdminlteTable.Property[];

  typeFields:libAdminlteFields.Field[];

  issues:libBackEnd.Issue[];

  issueProperties:libAdminlteTable.Property[];

  newLink:any[];

  backEnd:backEnd.Service;

  events:events.Service;

  constructor(backEndService:backEnd.Service, eventsService:events.Service) {
    "use strict";

    this.breadcrumbs = [
      becki.HOME,
      new libAdminlteWrapper.LabeledLink("Issues", ["Issues"])
    ];
    this.typeProperties = [
      new libAdminlteTable.Property("Name", "type")
    ];
    this.typeFields = [
      new libAdminlteFields.Field("Name:", "")
    ];
    this.issueProperties = [
      new libAdminlteTable.Property("Name", "name"),
      new libAdminlteTable.Property("Type", "type")
    ];
    this.newLink = ["NewIssue"];
    this.backEnd = backEndService;
    this.events = eventsService;
  }

  onInit():void {
    "use strict";

    this.refresh();
  }

  refresh():void {
    "use strict";

    this.backEnd.getIssueTypes()
        .then(types => {
          this.events.send(types);
          this.types = types;
        })
        .catch((reason) => {
          this.events.send(reason);
        });
    // TODO: http://byzance.myjetbrains.com/youtrack/issue/TBE-27
    this.backEnd.getIssues()
        .then(issues => {
          this.events.send(issues);
          this.issues = issues;
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  onTypeAdditionSubmit():void {
    "use strict";

    this.backEnd.createIssueType(this.typeFields[0].model)
        .then((message) => {
          this.events.send(message);
          this.refresh();
        })
        .catch((reason) => {
          this.events.send(reason);
        });
  }

  getLink(issue:libBackEnd.Issue):any[] {
    "use strict";

    return ["Issue", {issue: issue.postId}];
  }
}
