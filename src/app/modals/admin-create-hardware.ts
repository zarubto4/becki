/**
 * Created by davidhradek on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { ITypeOfBoard } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';


export class ModalsAdminCreateHardwareModel extends ModalModel {
    constructor(
        public typeOfBoards: ITypeOfBoard[],
        public processorId: string = '',
        public typeOfBoard: string = '',
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-admin-create-hardware',
    templateUrl: './admin-create-hardware.html'
})
export class ModalsAdminCreateHardwareComponent implements OnInit {

    @Input()
    modalModel: ModalsAdminCreateHardwareModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    typeOfBoardOption: FormSelectComponentOption[] = null;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            'processorId': ['', [Validators.required, Validators.minLength(24), Validators.maxLength(24)]],
            'typeOfBoard': ['', [Validators.required]]
        });
    }

    ngOnInit() {

        this.typeOfBoardOption = this.modalModel.typeOfBoards.map((pv) => {
            return {
                label: pv.name,
                value: pv.id
            };
        });

        (<FormControl>(this.form.controls['processorId'])).setValue(this.modalModel.processorId);
        (<FormControl>(this.form.controls['typeOfBoard'])).setValue(this.modalModel.typeOfBoard);
    }

    onSubmitClick(): void {
        this.modalModel.processorId = this.form.controls['processorId'].value;
        this.modalModel.typeOfBoard = this.form.controls['typeOfBoard'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
