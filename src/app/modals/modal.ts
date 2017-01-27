/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component } from '@angular/core';
import { ModalService } from '../services/ModalService';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bk-modal',
    templateUrl: './modal.html'
})
export class ModalComponent {
    constructor(public modalService: ModalService) {
    }
}


