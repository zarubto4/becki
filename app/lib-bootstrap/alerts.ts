/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
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

abstract class Alert {

  TYPE = 'info';

  body:string;

  constructor(body:string) {
    "use strict";

    this.body = body;
  }
}

export class Success extends Alert {

  TYPE = 'success';
}

export class Info extends Alert {

  TYPE = 'info';
}

export class Warning extends Alert {

  TYPE = 'warning';
}

export class Danger extends Alert {

  TYPE = 'danger';
}

export class Service {

  current:Alert[] = [];

  next:Alert[] = [];

  shift():void {
    "use strict";

    this.current.splice(0, this.current.length, ...this.next.splice(0));
  }
}

@ng.Component({
  selector: "[alerts]",
  templateUrl: "app/lib-bootstrap/alerts.html",
  directives: [ng.CORE_DIRECTIVES]
})
export class Component {

  service:Service;

  constructor(service:Service) {
    "use strict";

    this.service = service;
  }

  onCloseClick(alert:Alert):void {
    "use strict";

    this.service.current.splice(this.service.current.indexOf(alert), 1);
  }
}
