/**
 * Created by davidhradek on 03.08.16.
 */

import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {CORE_DIRECTIVES} from "@angular/common";
import {REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {ModalComponent} from "./modals/modal";
import {CurrentParamsService} from "./services/CurrentParamsService";

@Component({
    selector: 'app',
    template: "<modal></modal><router-outlet></router-outlet>",
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, ModalComponent]
})
export class AppComponent {
    // need inject CurrentParamsService here for init first in app
    constructor(protected currentParamsService:CurrentParamsService) {}
}