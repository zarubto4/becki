/**
 * Created by davidhradek on 04.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Component, OnInit, OnDestroy} from "@angular/core";

const BODY_CLASSES = ["login"];

@Component({
    selector: "layout-not-logged",
    templateUrl: "app/layouts/not-logged.html"
})
export class LayoutNotLogged implements OnInit, OnDestroy {

    constructor() {

    }

    ngOnInit(): void {
        document.body.classList.add(...BODY_CLASSES);
    }

    ngOnDestroy(): void {
        document.body.classList.remove(...BODY_CLASSES);
    }
}
