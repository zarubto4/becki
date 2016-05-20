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

    this.click.next(null);
    event.stopPropagation();
  }
}

@ngCore.Directive({
  selector: ".dropdown",
  host: {"[class.open]": "open"}
})
class Dropdown implements ngCore.AfterViewInit {

  open:boolean;

  toggles:ngCore.QueryList<Toggle>;

  constructor(@ngCore.Query(Toggle) toggles:ngCore.QueryList<Toggle>) {
    "use strict";

    this.open = false;
    this.toggles = toggles;
  }

  ngAfterViewInit():void {
    "use strict";

    // TODO: https://github.com/angular/angular/issues/6314
    this.toggles.map(toggle => toggle.click.subscribe(() => this.open = !this.open));
  }

  @ngCore.HostListener("document:click")
  onDocumentClick():void {
    "use strict";

    this.open = false;
  }
}

export const DIRECTIVES = [Dropdown, Toggle];
