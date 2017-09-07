/**
 * Created by davidhradek on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component } from '@angular/core';
import { ModalModel } from '../services/ModalService';

export class ModalsPublicShareRequestModel extends ModalModel {
    constructor(public name: string, public version_name: string) {
        super();
    }
}

@Component({
    selector: 'bk-modals-public-share-request',
    templateUrl: './public-share-request.html'
})
export class ModalsPublicShareRequestComponent {

    @Input()
    modalModel: ModalsPublicShareRequestModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    constructor() {

    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onYesClick(): void {
        this.modalClose.emit(true);
    }

    onNoClick(): void {
        this.modalClose.emit(false);
    }
}
