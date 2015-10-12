/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * The controller part of the application.
 */

import * as ng from "angular2/angular2";

/**
 * A "view" directive that renders a view from "src/view.html".
 */
@ng.Component({
  selector: "view"
})
@ng.View({
  templateUrl: "src/view.html"
})
export class Controller {
}
