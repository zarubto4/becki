/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';

const BODY_CLASSES = ['page-404-full-page'];

@Component({
    selector: 'bk-view-error-404',
    templateUrl: './error404.html'
})
export class Error404Component implements OnInit, OnDestroy {

    constructor(protected location: Location) {
    }

    onBackClick() {
        this.location.back();
    }

    ngOnInit(): void {
        document.body.classList.add(...BODY_CLASSES);
    }

    ngOnDestroy(): void {
        document.body.classList.remove(...BODY_CLASSES);
    }

}
