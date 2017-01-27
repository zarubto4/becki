/**
 * Created by davidhradek on 04.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';

const BODY_CLASSES = ['login'];

@Component({
    selector: 'bk-layout-not-logged',
    templateUrl: './not-logged.html'
})
export class LayoutNotLoggedComponent implements OnInit, OnDestroy {

    constructor() {

    }

    ngOnInit(): void {
        document.body.classList.add(...BODY_CLASSES);
    }

    ngOnDestroy(): void {
        document.body.classList.remove(...BODY_CLASSES);
    }
}
