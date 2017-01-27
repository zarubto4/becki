/**
 * Created by davidhradek on 03.08.16.
 */

import { Component } from '@angular/core';
import { CurrentParamsService } from './services/CurrentParamsService';

@Component({
    selector: 'bk-app',
    template: '<bk-block-ui></bk-block-ui><bk-modal></bk-modal><router-outlet></router-outlet>'
})
export class AppComponent {
    // need inject CurrentParamsService here for init first in app
    constructor(protected currentParamsService: CurrentParamsService) {
    }
}
