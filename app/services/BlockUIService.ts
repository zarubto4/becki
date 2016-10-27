/**
 * Created by davidhradek on 27.10.16.
 */

import {Injectable, NgZone} from "@angular/core";

@Injectable()
export class BlockUIService {

    private blocked:boolean = false;

    protected blockUITimeout:any = null;
    protected blockUIDisplay:boolean = false;
    protected blockUIOpen:boolean = false;


    constructor() {
        console.log("BlockUIService init");
    }

    blockUI():void {
        console.log("blockUI()");
        if (this.blocked == true) return;
        this.blocked = true;
        clearTimeout(this.blockUITimeout);

        this.blockUIDisplay = true;
        this.blockUIOpen = false;
        this.blockUITimeout = setTimeout(() => {
            this.blockUIOpen = true;
        }, 5);

    }

    unblockUI():void {
        console.log("unblockUI()");
        if (this.blocked == false) return;
        this.blocked = false;
        clearTimeout(this.blockUITimeout);

        this.blockUIOpen = false;
        this.blockUITimeout = setTimeout(() => {
            this.blockUIDisplay = false;
        }, 400);
    }

}