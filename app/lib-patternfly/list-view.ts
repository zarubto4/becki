/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngCommon from "@angular/common";
import * as ngCore from "@angular/core";
import * as ngRouter from "@angular/router";

import * as libBootstrapDropdown from "../lib-bootstrap/dropdown";
import * as libBootstrapModal from "../lib-bootstrap/modal";

export class Item {

  id:string;

  name:string;

  description:string;

  link:any[];

  removable:boolean;

  constructor(id:string, name:string, description:string, link:any[] = null, removable = true) {
    "use strict";

    this.id = id;
    this.name = name;
    this.description = description;
    this.link = link;
    this.removable = removable;
  }
}

@ngCore.Component({
  selector: "[listView]",
  templateUrl: "app/lib-patternfly/list-view.html",
  directives: [libBootstrapDropdown.DIRECTIVES, ngCommon.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES]
})
export class Component {

  @ngCore.Input("listView")
  items:Item[];

  @ngCore.Input()
  emptyTitle:string;

  @ngCore.Input()
  addable:boolean;

  @ngCore.Output()
  addClick:ngCore.EventEmitter<void>;

  @ngCore.Output()
  removeClick:ngCore.EventEmitter<string>;

  router:ngRouter.Router;

  modal:libBootstrapModal.Component;

  constructor(router:ngRouter.Router, modal:libBootstrapModal.Component) {
    "use strict";

    this.emptyTitle = "No item yet";
    this.addable = true;
    this.addClick = new ngCore.EventEmitter<void>();
    this.removeClick = new ngCore.EventEmitter<string>();
    this.router = router;
    this.modal = modal;
  }

  onAddClick():void {
    "use strict";

    this.addClick.emit(null);
  }

  onViewClick(item:Item):void {
    "use strict";

    this.router.navigate(item.link);
  }

  onRemoveClick(item:Item):void {
    "use strict";

    this.modal.showModal(new libBootstrapModal.RemovalModel(item.name)).then(remove => {
      if (remove) {
        this.removeClick.emit(item.id);
      }
    });
  }
}
