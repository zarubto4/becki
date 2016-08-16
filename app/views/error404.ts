/**
 * Created by davidhradek on 09.08.16.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Location} from "@angular/common";

const BODY_CLASSES = ["page-404-full-page"];

@Component({
    selector: "view-error-404",
    templateUrl: "app/views/error404.html",
    directives: [ROUTER_DIRECTIVES]
})
export class Error404Component implements OnInit, OnDestroy {

    constructor(protected location:Location) {}

    onBackClick() {
        this.location.back();
    }

    ngOnInit():void {
        document.body.classList.add(...BODY_CLASSES);
    }

    ngOnDestroy():void {
        document.body.classList.remove(...BODY_CLASSES);
    }

}
