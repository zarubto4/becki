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

import * as becki from "./index";
import * as libBootstrapPanelList from "./lib-bootstrap/panel-list";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/devices.html",
  directives: [libBootstrapPanelList.Component, wrapper.Component]
})
export class Component {

  breadcrumbs = [
    becki.HOME,
    new wrapper.LabeledLink("Devices", ["Devices"])
  ];

  items:libBootstrapPanelList.Item[] = [
    new libBootstrapPanelList.Item(null, "(not implemented yet)", "does not work"),
    new libBootstrapPanelList.Item(null, "(not implemented yet)", "does not work"),
    new libBootstrapPanelList.Item(null, "(not implemented yet)", "does not work")
  ];

  newDeviceLink = ["NewDevice"];

  newHomerLink = ["NewHomer"];
}
