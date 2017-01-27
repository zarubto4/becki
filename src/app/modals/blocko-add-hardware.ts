/**
 * Created by davidhradek on 20.09.16.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { IBoard, IBoardShortDetail } from '../backend/TyrionAPI';


export class ModalsBlockoAddHardwareModel extends ModalModel {
    constructor(public boards: IBoardShortDetail[], public selectedBoard: IBoardShortDetail = null) {
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

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'board': ['', [Validators.required]]
        });
    }

    ngOnInit() {
        this.options = this.modalModel.boards.map((b) => {
            return {
                value: b.id,
                label: b.personal_description ? b.personal_description + ' (' + b.id + ')' : b.id
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
