/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCore from "@angular/core";

@ngCore.Directive({
  selector: ".dropdown-toggle",
  host: {"(click)": "onClick($event)"}
})
class Toggle {

  click = new ngCore.EventEmitter<void>();

  onClick(event:Event):void {
    "use strict";

    this.click.emit(null);
    event.stopPropagation();
  }
}

@ngCore.Directive({
  selector: ".dropdown",
  host: {"[class.open]": "open"}
})
class Dropdown implements ngCore.AfterContentInit {

  open = false;

  @ngCore.ContentChildren(Toggle) toggles:ngCore.QueryList<Toggle>;

  ngAfterContentInit():void {
    "use strict";

    this.toggles.forEach(toggle => toggle.click.subscribe(() => this.open = !this.open));
  }

  @ngCore.HostListener("document:click")
  onDocumentClick():void {
    "use strict";

    this.open = false;
  }
}

export const DIRECTIVES = [Dropdown, Toggle];
