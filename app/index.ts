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

import * as layout from "./layout";

export const HOME = new layout.LabeledLink("No Name", ["Applications"]);

export const NAVIGATION = [
  new layout.LabeledLink("Interactions", ["Interactions"], "link"),
  new layout.LabeledLink("Applications", ["Applications"], "mobile"),
  new layout.LabeledLink("Applications (Vision)", ["ApplicationsVision"], "mobile"),
  new layout.LabeledLink("Devices (TODO)", ["Devices"], "tachometer"),
  new layout.LabeledLink("Projects (TODO)", ["Projects"], "book"),
  new layout.LabeledLink("Issues (TODO)", ["Issues"], "bug")
];

export function getAdvancedField(field:string, options:string[]):string {
  "use strict";

  if (field) {
    return field;
  } else if (options.length == 1) {
    return options[0];
  } else {
    return null;
  }
}
