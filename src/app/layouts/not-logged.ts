/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslationService } from '../services/TranslationService';
import { TyrionBackendService } from '../services/BackendService';



const BODY_CLASSES = ['login'];

declare const BECKI_VERSION: string;
declare const BECKI_VERSION_ID: number;
declare const BECKI_VERSION_DATE: string;

@Component({
    selector: 'bk-layout-not-logged',
    templateUrl: './not-logged.html'
})
export class LayoutNotLoggedComponent implements OnInit, OnDestroy {

    private beckiBeta: boolean = false;


    versionString = this.translationService.translate('label_becki_version', this, null, [BECKI_VERSION, BECKI_VERSION_ID, BECKI_VERSION_DATE]);
    constructor(private backendService: TyrionBackendService, private translationService: TranslationService) {
        this.beckiBeta = backendService.getBeckiBeta();
    }

    ngOnInit(): void {
        document.body.classList.add(...BODY_CLASSES);
    }

    ngOnDestroy(): void {
        document.body.classList.remove(...BODY_CLASSES);
    }
}
