/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';


export class ModalsBlockoAddGridEmptyModel extends ModalModel {
    constructor() {
        super();
    }
}

@Component({
    selector: 'bk-modals-blocko-add-grid-empty',
    templateUrl: './blocko-add-grid-empty.html'
})
export class ModalsBlockoAddGridEmptyComponent {

    @Input()
    modalModel: ModalsBlockoAddGridEmptyModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options: FormSelectComponentOption[] = null;

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'grid': ['', [Validators.required]]
        });
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
