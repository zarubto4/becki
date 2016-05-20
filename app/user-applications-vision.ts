/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import * as ngCore from "@angular/core";

import * as libBeckiLayout from "./lib-becki/layout";
import * as libBootstrapDropdown from "./lib-bootstrap/dropdown";

@ngCore.Component({
  templateUrl: "app/user-applications-vision.html",
  directives: [libBeckiLayout.Component, libBootstrapDropdown.DIRECTIVES]
})
export class Component {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  constructor(@ngCore.Inject("home") home:libBeckiLayout.LabeledLink) {
    "use strict";

    this.breadcrumbs = [
      home,
      new libBeckiLayout.LabeledLink("User", home.link),
      new libBeckiLayout.LabeledLink("Applications", ["UserApplicationsVision"]),
      new libBeckiLayout.LabeledLink("Hello world", ["UserApplicationsVision"])
    ];
  }

  onClick():void {
    "use strict";
  }
}
