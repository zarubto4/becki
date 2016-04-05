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

import * as libBackEnd from "./lib-back-end/index";

export abstract class Notification {

  type:string;

  icon:string;

  body:string;

  constructor(type:string, icon:string, body:string, reason?:Object) {
    "use strict";

    this.type = type;
    this.icon = icon;
    this.body = body;
    if (reason instanceof libBackEnd.BugFoundError) {
      this.body += " An unexpected error ";
      if (reason.userMessage) {
        this.body += `with message "${reason.userMessage}" `;
      }
      this.body += `have occurred. Please, report following text to administrators in order to get it fixed: ${JSON.stringify(reason.adminMessage)}`;
    } else if (reason instanceof libBackEnd.PermissionMissingError) {
      if (reason.userMessage) {
        this.body += ` An authorization error with message "${reason.userMessage}" have occurred.`;
      }
      this.body += " Please ask an authorized person to give you the necessary permissions.";
    } else if (reason instanceof libBackEnd.UnauthorizedError) {
      this.body += ` An authorization error with message "${reason.userMessage}" have occurred. Please sign in.`;
    }
  }
}

export class Success extends Notification {

  constructor(body:string) {
    "use strict";

    super("success", "ok", body);
  }
}

export class Info extends Notification {

  constructor(body:string) {
    "use strict";

    super("info", "info", body);
  }
}

export class Warning extends Notification {

  constructor(body:string, reason?:Object) {
    "use strict";

    super("warning", "warning-triangle-o", body, reason);
  }
}

export class Danger extends Notification {

  constructor(body:string, reason?:Object) {
    "use strict";

    super("danger", "error-circle-o", body, reason);
  }
}

export class Service {

  current:Notification[] = [];

  next:Notification[] = [];

  shift():void {
    "use strict";

    this.current.splice(0, this.current.length, ...this.next.splice(0));
  }
}

@ng.Component({
  selector: "[notifications]",
  templateUrl: "app/notifications.html",
  directives: [ng.CORE_DIRECTIVES]
})
export class Component {

  service:Service;

  constructor(service:Service) {
    "use strict";

    this.service = service;
  }

  onCloseClick(notification:Notification):void {
    "use strict";

    this.service.current.splice(this.service.current.indexOf(notification), 1);
  }
}
