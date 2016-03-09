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

import * as becki from "./index";
import * as layout from "./layout";

@ng.Component({
  templateUrl: "app/applications-vision.html",
  directives: [layout.Component]
})
export class Component {

  breadcrumbs = [
    becki.HOME,
    new layout.LabeledLink("Applications", ["ApplicationsVision"]),
    new layout.LabeledLink("Hello world", ["ApplicationsVision"])
  ];

  verticalDropdownOpen = false;

  vertical1DropdownOpen = false;

  vertical2DropdownOpen = false;

  vertical3DropdownOpen = false;

  horizontalDropdownOpen = false;

  horizontal1DropdownOpen = false;

  onClick():void {
    "use strict";
  }

  onVerticalDropdownClick(event:Event):void {
    "use strict";

    this.verticalDropdownOpen = !this.verticalDropdownOpen;
    event.stopPropagation();
  }

  onVertical1DropdownClick(event:Event):void {
    "use strict";

    this.vertical1DropdownOpen = !this.vertical1DropdownOpen;
    event.stopPropagation();
  }

  onVertical2DropdownClick(event:Event):void {
    "use strict";

    this.vertical2DropdownOpen = !this.vertical2DropdownOpen;
    event.stopPropagation();
  }

  onVertical3DropdownClick(event:Event):void {
    "use strict";

    this.vertical3DropdownOpen = !this.vertical3DropdownOpen;
    event.stopPropagation();
  }

  onHorizontalDropdownClick(event:Event):void {
    "use strict";

    this.horizontalDropdownOpen = !this.horizontalDropdownOpen;
    event.stopPropagation();
  }

  onHorizontal1DropdownClick(event:Event):void {
    "use strict";

    this.horizontal1DropdownOpen = !this.horizontal1DropdownOpen;
    event.stopPropagation();
  }

  @ng.HostListener("document:click")
  onDocumentClick():void {
    "use strict";

    this.verticalDropdownOpen = false;
    this.vertical1DropdownOpen = false;
    this.vertical2DropdownOpen = false;
    this.vertical3DropdownOpen = false;
    this.horizontalDropdownOpen = false;
    this.horizontal1DropdownOpen = false;
  }
}
