/**
 * Created by davidhradek on 27.10.16.
 *
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component } from '@angular/core';
import { BlockUIService } from '../services/BlockUIService';

@Component({
    selector: 'bk-block-ui',
    template: `
    <div class="block-ui-overlay" [style.display]="blockUIService.blockUIDisplay?'block':'none'" [class.open]="blockUIService.blockUIOpen"></div>
    <div class="block-ui-msg-wrapper" [style.display]="blockUIService.blockUIDisplay?'block':'none'" [class.open]="blockUIService.blockUIOpen">
        <div class="block-ui-msg">
            <div class="byzance-logo-spinner-black"></div>
            <span>&nbsp;&nbsp;LOADING...</span>
        </div>
    </div>
`
})
export class BlockUIComponent {
    constructor(public blockUIService: BlockUIService) {
    }
}


