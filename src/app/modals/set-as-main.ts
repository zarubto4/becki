/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component } from '@angular/core';
import { ModalModel } from '../services/ModalService';
export class ModalsSetAsMainModel extends ModalModel {
    constructor(public type: string, public name: string) {
        super();
    }
}

@Component({
    selector: 'bk-modals-set-as-main',
    templateUrl: './set-as-main.html'
})
export class ModalsSetAsMainComponent {

    @Input()
    modalModel: ModalsSetAsMainModel;

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
