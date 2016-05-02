/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ng from "angular2/angular2";
import * as ngRouter from "angular2/router";

import * as libBootstrapDropdown from "../lib-bootstrap/dropdown";

export class Item {

  id:string;

  name:string;

  description:string;

  link:any[];

  removing:boolean;

  removable:boolean;

  constructor(id:string, name:string, description:string, link:any[] = null, removable = true) {
    "use strict";

    this.id = id;
    this.name = name;
    this.description = description;
    this.link = link;
    this.removing = false;
    this.removable = removable;
  }
}

@ng.Component({
  selector: "[list-view]",
  templateUrl: "app/lib-patternfly/list-view.html",
  directives: [libBootstrapDropdown.DIRECTIVES, ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES]
})
export class Component {

  @ng.Input("listView")
  items:Item[];

  @ng.Input()
  emptyTitle:string;

  @ng.Input()
  addable:boolean;

  @ng.Output()
  addClick:ng.EventEmitter;

  @ng.Output()
  removeClick:ng.EventEmitter;

  router:ngRouter.Router;

  constructor(router:ngRouter.Router) {
    "use strict";

    this.emptyTitle = "No item yet";
    this.addable = true;
    this.addClick = new ng.EventEmitter();
    this.removeClick = new ng.EventEmitter();
    this.router = router;
  }

  onAddClick():void {
    "use strict";

    this.addClick.next(null);
  }

  onViewClick(item:Item):void {
    "use strict";

    this.router.navigate(item.link);
  }

  onRemoveClick(item:Item):void {
    "use strict";

    item.removing = true;
  }

  onConfirmationYesClick(item:Item):void {
    "use strict";

    item.removing = false;
    this.removeClick.next(item.id);
  }

  onConfirmationNoClick(item:Item):void {
    "use strict";

    item.removing = false;
  }
}
