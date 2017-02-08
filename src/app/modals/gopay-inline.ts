/**
 * Created by dominikKrisztof on 1.2.17.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { ModalModel } from '../services/ModalService';


export class ModalsGopayInlineModel extends ModalModel {
    constructor(public name: string = '', public gopayUrl: string = '') {
        super();
    }
}

@Component({
    selector: 'bk-modals-gopay-inline',
    templateUrl: './gopay-inline.html'
})
export class ModalsGopayInlineComponent implements OnInit {

    @Input()
    modalModel: ModalsGopayInlineModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit() {
    }

    onSubmitClick(): void {
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
