/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { ModalModel } from '../services/ModalService';
import { ContactFormData } from '../components/ContactFormComponent';

export class ModalsContactModel extends ModalModel {
    constructor(
        public create: boolean = false,
        public allowTypeSelection: boolean = false,
        public contactData: ContactFormData
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-contact',
    templateUrl: './contact.html'
})
export class ModalsContactComponent implements OnInit {

    @Input()
    modalModel: ModalsContactModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    contactData: ContactFormData = null;

    valid = true;

    constructor() {}

    ngOnInit() {
        this.contactData = this.modalModel.contactData;
    }

    onSubmitClick(): void {
        this.modalModel.contactData = this.contactData;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }

    validChanged(val) {
        this.valid = val;
    }
}
