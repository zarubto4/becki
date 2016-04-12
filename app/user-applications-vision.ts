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

import * as libBeckiLayout from "./lib-becki/layout";
import * as libBootstrapDropdown from "./lib-bootstrap/dropdown";

@ng.Component({
  templateUrl: "app/user-applications-vision.html",
  directives: [libBeckiLayout.Component, libBootstrapDropdown.DIRECTIVES]
})
export class Component {

  breadcrumbs:libBeckiLayout.LabeledLink[];

  constructor(@ng.Inject("home") home:libBeckiLayout.LabeledLink) {
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
