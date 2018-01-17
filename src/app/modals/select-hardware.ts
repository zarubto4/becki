/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { TranslationService } from './../services/TranslationService';
import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { IBoard, IBoardForFastUploadDetail } from '../backend/TyrionAPI';


export class ModalsSelectHardwareModel extends ModalModel {
    constructor(public boards: IBoardForFastUploadDetail[], public selectedBoard: IBoardForFastUploadDetail = null) {
        super();
    }
}

@Component({
    selector: 'bk-modals-select-hardware',
    templateUrl: './select-hardware.html'
})
export class ModalsSelectHardwareComponent implements OnInit {

    @Input()
    modalModel: ModalsSelectHardwareModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options: FormSelectComponentOption[] = null;

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder, private translationService: TranslationService) {

        this.form = this.formBuilder.group({
            'board': ['', [Validators.required]]
        });
    }

    ngOnInit() {
        this.options = this.modalModel.boards.map((b) => {
            let collisionTranslated = this.translationService.translateTable(b.collision, this, 'board_state');
            return {
                value: b.id,
                label: b.id + ' [' + b.name + ']' + (b.collision ? ' (' + collisionTranslated + ')' : '')
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
