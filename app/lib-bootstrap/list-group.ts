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

  id:string;

  name:string;

  description:string;

  link:any[];

  constructor(id:string, name:string, description:string, link:any[] = null) {
    "use strict";

    this.id = id;
    this.name = name;
    this.description = description;
    this.link = link;
  }
}

@ng.Component({
  selector: "[list-group]",
  templateUrl: "app/lib-bootstrap/list-group.html",
  directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["progress"]
})
export class Component {

  @ng.Input("listGroup")
  items:Item[] = [];

  @ng.Output()
  removeClick = new ng.EventEmitter();

  onRemoveClick(item:Item):void {
    "use strict";

    this.removeClick.next(item.id);
  }
}
