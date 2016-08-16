/**
 * Created by davidhradek on 03.08.16.
 */

import {Component, Injector} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";

@Component({
    selector: "view-dashboard",
    directives: [LayoutMain],
    template: `<layout-main [title]="'Dashboard'">
    <h1 class="title">Megasuper dashboard</h1>
    </layout-main>
  `
})
export class DashboardComponent extends BaseMainComponent {

    constructor(injector:Injector) {super(injector)};

}
