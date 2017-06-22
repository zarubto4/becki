/**
 * Created by davidhradek on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component } from '@angular/core';
import { ModalModel } from '../services/ModalService';

export class ModalsDeactivateModel extends ModalModel {

    // Model can be used for deactivation Modal window or activation Modal
    constructor(public name: string, public activation_or_deactivation: boolean, public message: string) {
        super();
    }
}

@Component({
    selector: 'bk-modals-deactivate',
    templateUrl: './deactivate.html'
})
export class ModalsDeactivateComponent {

    @Input()
    modalModel: ModalsDeactivateModel;

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
