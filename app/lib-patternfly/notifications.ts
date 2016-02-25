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

abstract class Notification {

  TYPE = "info";

  ICON = "info";

  body:string;

  constructor(body:string) {
    "use strict";

    this.body = body;
  }
}

export class Success extends Notification {

  TYPE = "success";

  ICON = "ok";
}

export class Info extends Notification {

  TYPE = "info";

  ICON = "info";
}

export class Warning extends Notification {

  TYPE = "warning";

  ICON = "warning-triangle-o";
}

export class Danger extends Notification {

  TYPE = "danger";

  ICON = "error-circle-o";
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
  templateUrl: "app/lib-patternfly/notifications.html",
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
