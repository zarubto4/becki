import { TranslationService } from './../services/TranslationService';
/**
 * Created by davidhradek on 20.09.16.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { IBoard, IBoardForFastUploadDetail } from '../backend/TyrionAPI';


export class ModalPickHardwareTerminalModel extends ModalModel {
    constructor(public boards: IBoardForFastUploadDetail[], public color: string, public selectedBoard: IBoardForFastUploadDetail = null) {
        super();
    }
}

@Component({
    selector: 'bk-modals-pick-hardware-terminal',
    templateUrl: './pick-hardware-terminal.html'
})
export class ModalPickHardwareTerminalComponent implements OnInit {

    @Input()
    modalModel: ModalPickHardwareTerminalModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    options: FormSelectComponentOption[] = null;

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder, private translationService: TranslationService) {

        this.form = this.formBuilder.group({
            'board': ['', [Validators.required]],
            'color': ['', [Validators.required]],
        });
    }

    ngOnInit() {
        this.options = this.modalModel.boards.map((b) => {
            let collisionTranslated = this.translationService.translateTable(b.collision, this, 'board_state');
            return {
                value: b.id,
                label: b.id + ' [' + b.name + ']',
            };
        });
        this.form.controls['color'].setValue(this.modalModel.color);
        (<FormControl>(this.form.controls['board'])).setValue(this.modalModel.selectedBoard ? this.modalModel.selectedBoard : '');
    }

    onSubmitClick(): void {
        this.modalModel.selectedBoard = this.modalModel.boards.find((b) => (this.form.controls['board'].value === b.id));
        this.modalModel.color = this.form.controls['color'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
