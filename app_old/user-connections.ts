/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBackEnd from "./lib-back-end/index";
import * as libBecki from "./lib-becki/index";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiLayout from "./lib-becki/layout";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libPatternFlyListView from "./lib-patternfly/list-view";

function composeConnectionDescription(connection:libBackEnd.Connection):string {
  "use strict";

  let description = connection.user_agent;
  if (connection.notification_subscriber) {
    description += " (notifications)";
  }
  return description;
}

@ngCore.Component({
  templateUrl: "app/user-connections.html",
  directives: [libBeckiLayout.Component, libPatternFlyListView.Component, ngRouter.ROUTER_DIRECTIVES]
})
export class Component implements ngCore.OnInit {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  items:libPatternFlyListView.Item[];

  backEnd:libBeckiBackEnd.Service;

  notifications:libBeckiNotifications.Service;

  router:ngRouter.Router;

  constructor(@ngCore.Inject("home") home:string, backEnd:libBeckiBackEnd.Service, notifications:libBeckiNotifications.Service, router:ngRouter.Router) {
    "use strict";

    this.breadcrumbs = [
      new libBeckiLayout.LabeledLink(home, ["/"]),
      new libBeckiLayout.LabeledLink("User", ["/user"]),
      new libBeckiLayout.LabeledLink("Connections", ["/user/connections"])
    ];
    this.backEnd = backEnd;
    this.notifications = notifications;
    this.router = router;
  }

  ngOnInit():void {
    "use strict";

    this.refresh();
  }

  refresh():void {
    "use strict";

    this.notifications.shift();
    Promise.all<any>([
          this.backEnd.getConnections(),
          this.backEnd.getSignedUser()
        ])
        .then(result => {
          let connections:libBackEnd.Connection[];
          let user:libBackEnd.User;
          [connections, user] = result;
          this.items = connections.map(connection => new libPatternFlyListView.Item(connection.connection_id, libBecki.timestampToString(connection.created), composeConnectionDescription(connection), null, connection.delete_permission));
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("Connections cannot be loaded.", reason));
        });
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-217
    this.notifications.current.push(new libBeckiNotifications.Danger("issue/TYRION-217"));
  }

  onRemoveClick(id:string):void {
    "use strict";

    this.notifications.shift();
    this.backEnd.removeConnection(id)
        .then(() => {
          this.notifications.current.push(new libBeckiNotifications.Success("The connection has been removed."));
          this.refresh();
        })
        .catch(reason => {
          this.notifications.current.push(new libBeckiNotifications.Danger("The connection cannot be removed.", reason));
        });
  }
}
