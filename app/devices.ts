/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
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
import * as libAdminlteInbox from "./lib-adminlte/inbox";
import * as libAdminlteTable from "./lib-adminlte/table";
import * as libAdminlteWrapper from "./lib-adminlte/wrapper";
import * as wrapper from "./wrapper";

@ng.Component({
  templateUrl: "app/devices.html",
  directives: [libAdminlteInbox.Component, wrapper.Component]
})
export class Component {

  breadcrumbs = [
    becki.HOME,
    new libAdminlteWrapper.LabeledLink("Devices", ["Devices"])
  ];

  properties:libAdminlteTable.Property[] = [
    new libAdminlteTable.Property("(not implemented yet)", null)
  ];

  newDeviceLink = ["NewDevice"];

  newHomerLink = ["NewHomer"];
}
