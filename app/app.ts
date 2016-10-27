/**
 * Created by davidhradek on 03.08.16.
 */

import {Component} from "@angular/core";
import {CurrentParamsService} from "./services/CurrentParamsService";

@Component({
    selector: 'app',
    template: "<block-ui></block-ui><modal></modal><router-outlet></router-outlet>"
})
export class AppComponent {
    // need inject CurrentParamsService here for init first in app
    constructor(protected currentParamsService: CurrentParamsService) {
    }
}