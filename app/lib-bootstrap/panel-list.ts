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

  selected:boolean;

  constructor(id:string, name:string, description:string, link:any[] = null) {
    "use strict";

    this.id = id;
    this.name = name;
    this.description = description;
    this.link = link;
    this.selected = false;
  }
}

@ng.Component({
  selector: "[panel-list]",
  templateUrl: "app/lib-bootstrap/panel-list.html",
  directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["progress"]
})
export class Component {

  @ng.Input("panelList")
  items:Item[] = [];

  @ng.Output()
  plusClick = new ng.EventEmitter();

  @ng.Output()
  minusClick = new ng.EventEmitter();

  getSelectedIds():string[] {
    "use strict";

    return this.items ? this.items.filter(item => item.selected).map(item => item.id) : [];
  }

  onItemClick(item:Item):void {
    "use strict";

    item.selected = !item.selected;
  }

  onPlusClick(event:Event):void {
    "use strict";

    this.plusClick.next(event);
  }

  onMinusClick():void {
    "use strict";

    this.minusClick.next(this.getSelectedIds());
  }
}
