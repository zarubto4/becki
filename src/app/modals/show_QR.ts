/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component } from '@angular/core';
import { ModalModel } from '../services/ModalService';

export class ModalsShowQRModel extends ModalModel {
    constructor(public link: string) {
        super();
    }
}

@Component({
    selector: 'bk-modals-show-qr',
    templateUrl: './show_QR.html'
})
export class ModalsShowQRComponent {

    @Input()
    modalModel: ModalsShowQRModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    constructor() {

    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }
}
