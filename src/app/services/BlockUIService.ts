/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class BlockUIService {

    private blocked: boolean = false;

    protected blockUITimeout: any = null;
    public blockUIDisplay: boolean = false;
    public blockUIOpen: boolean = false;


    constructor() {
        console.info('BlockUIService init');
    }

    blockUI(): void {
        // console.log('blockUI()');
        if (this.blocked === true) {
            return;
        }
        this.blocked = true;
        clearTimeout(this.blockUITimeout);

        this.blockUIDisplay = true;
        this.blockUIOpen = false;
        this.blockUITimeout = setTimeout(() => {
            this.blockUIOpen = true;
            document.body.classList.add('block-ui-blur');
        }, 5);

    }

    unblockUI(): void {
        // console.log('unblockUI()');
        if (this.blocked === false) {
            return;
        }
        this.blocked = false;
        clearTimeout(this.blockUITimeout);

        this.blockUIOpen = false;
        document.body.classList.remove('block-ui-blur');
        this.blockUITimeout = setTimeout(() => {
            this.blockUIDisplay = false;
        }, 400);
    }

}
