/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ng from "angular2/angular2";

@ng.Directive({
  selector: ".dropdown-toggle",
  host: {"(click)": "onClick($event)"}
})
class Toggle {

  click = new ng.EventEmitter();

  onClick(event:Event):void {
    "use strict";

    this.click.next(null);
    event.stopPropagation();
  }
}

@ng.Directive({
  selector: ".dropdown",
  host: {"[class.open]": "open"}
})
class Dropdown implements ng.AfterViewInit {

  open:boolean;

  toggles:ng.QueryList<Toggle>;

  constructor(@ng.Query(Toggle) toggles:ng.QueryList<Toggle>) {
    "use strict";

    this.open = false;
    this.toggles = toggles;
  }

  afterViewInit():void {
    "use strict";

    // TODO: https://github.com/angular/angular/issues/6314
    this.toggles.map(toggle => toggle.click.toRx().subscribe(() => this.open = !this.open));
  }

  @ng.HostListener("document:click")
  onDocumentClick():void {
    "use strict";

    this.open = false;
  }
}

export const DIRECTIVES = [Dropdown, Toggle];
