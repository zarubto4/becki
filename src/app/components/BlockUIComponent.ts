    /**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component } from '@angular/core';
import { BlockUIService } from '../services/BlockUIService';

@Component({
    selector: 'bk-block-ui',
    templateUrl: './BlockUIComponent.html'
})
export class BlockUIComponent {
    constructor(public blockUIService: BlockUIService) {
    }
}


