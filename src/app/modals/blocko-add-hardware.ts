/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { IHardware } from '../backend/TyrionAPI';


export class ModalsBlockoAddHardwareModel extends ModalModel {
    constructor(public boards: IHardware[], public selectedBoard: IHardware = null) {
        super();
    }
}

@Component({
    selector: 'bk-modals-blocko-add-hardware',
    templateUrl: './blocko-add-hardware.html'
})
export class ModalsBlockoAddHardwareComponent implements OnInit {

    @Input()
    modalModel: ModalsBlockoAddHardwareModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options: FormSelectComponentOption[] = null;

    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'board': ['', [Validators.required]]
        });
    }

    ngOnInit() {
        this.options = this.modalModel.boards.map((b) => {
            return {
                value: b.id,
                label: b.name ? b.name + ' (' + b.id + ')' : b.id
            };
        });
        (<FormControl>(this.form.controls['board'])).setValue(this.modalModel.selectedBoard ? this.modalModel.selectedBoard : '');
    }

    onSubmitClick(): void {
        this.modalModel.selectedBoard = this.modalModel.boards.find((b) => (this.form.controls['board'].value === b.id));
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
