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
import * as libBootstrapDropdown from "./lib-bootstrap/dropdown";

@ng.Component({
  templateUrl: "app/applications-vision.html",
  directives: [layout.Component, libBootstrapDropdown.DIRECTIVES]
})
export class Component {

  breadcrumbs = [
    becki.HOME,
    new layout.LabeledLink("Applications", ["ApplicationsVision"]),
    new layout.LabeledLink("Hello world", ["ApplicationsVision"])
  ];

  onClick():void {
    "use strict";
  }
}
