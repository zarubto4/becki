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
import * as ngRouter from "angular2/router";

export class Item {

  name:string;

  description:string;

  link:any[];

  constructor(name:string, description:string, link:any[] = null) {
    "use strict";

    this.name = name;
    this.description = description;
    this.link = link;
  }
}

@ng.Component({
  selector: "[panel-list]",
  templateUrl: "app/lib-bootstrap/panel-list.html",
  directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["items: panelList"]
})
export class Component {

  @ng.Output()
  plusClick = new ng.EventEmitter();

  onPlusClick(event:Event):void {
    "use strict";

    this.plusClick.next(event);
  }
}
