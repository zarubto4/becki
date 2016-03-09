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

  dropdownOpen:boolean;

  removing:boolean;

  constructor(id:string, name:string, description:string, link:any[] = null) {
    "use strict";

    this.id = id;
    this.name = name;
    this.description = description;
    this.link = link;
    this.dropdownOpen = false;
    this.removing = false;
  }
}

@ng.Component({
  selector: "[list-group]",
  templateUrl: "app/lib-patternfly/list-group.html",
  directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  inputs: ["progress"]
})
export class Component {

  @ng.Input("listGroup")
  items:Item[];

  @ng.Input()
  emptyTitle:string;

  @ng.Output()
  addClick:ng.EventEmitter;

  @ng.Output()
  removeClick:ng.EventEmitter;

  router:ngRouter.Router;

  constructor(router:ngRouter.Router) {
    "use strict";

    this.emptyTitle = "No item yet";
    this.addClick = new ng.EventEmitter();
    this.removeClick = new ng.EventEmitter();
    this.router = router;
  }

  onAddClick():void {
    "use strict";

    this.addClick.next(null);
  }

  onDropdownClick(item:Item, event:Event):void {
    "use strict";

    item.dropdownOpen = !item.dropdownOpen;
    event.stopPropagation();
  }

  onEditClick(item:Item):void {
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

  @ng.HostListener("document:click")
  onDocumentClick():void {
    "use strict";

    if (this.items) {
      this.items.forEach(item => item.dropdownOpen = false);
    }
  }
}
