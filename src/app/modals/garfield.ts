/**
 * Created by davidhradek on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IProducer, ITypeOfBoard } from '../backend/TyrionAPI';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { BackendService } from '../services/BackendService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { ModalModel } from '../services/ModalService';

export class ModalsGarfieldModel extends ModalModel {
    constructor(
        public producers: IProducer[],
        public typeOfBoards: ITypeOfBoard[],
        public name: string = '',
        public description: string = '',
        public print_label_id_1: number = 0,
        public print_label_id_2: number = 0,
        public print_sticker_id: number = 0,
        public hardware_tester_id: string = '',
        public edit: boolean = false,
        public producer: string = '',
        public typeOfBoard: string = ''
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-garfield',
    templateUrl: './garfield.html'
})
export class ModalsGarfieldComponent implements OnInit {

    @Input()
    modalModel: ModalsGarfieldModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    producer_options: FormSelectComponentOption[] = null;
    typeOfBoard_options: FormSelectComponentOption[] = null;

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'description': ['', [Validators.required, Validators.minLength(4)]],
            'name': ['', [Validators.required, Validators.minLength(4)]],
            'print_label_id_1': ['', [Validators.required, Validators.minLength(5)]],
            'print_label_id_2': ['', [Validators.required, Validators.minLength(5)]],
            'print_sticker_id': ['', [Validators.required, Validators.minLength(5)]],
            'hardware_tester_id': ['', [Validators.required, Validators.minLength(5)]],
            'typeOfBoard': ['', [Validators.required]],
            'producer': ['', [Validators.required]]
        });
    }

    ngOnInit() {

        if (!this.modalModel.edit) {
            this.typeOfBoard_options = this.modalModel.typeOfBoards.map((pv) => {
                return {
                    label: pv.name,
                    value: pv.id
                };
            });

            this.producer_options = this.modalModel.producers.map((pv) => {
                return {
                    label: pv.name,
                    value: pv.id
                };
            });
        }

        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['print_label_id_1'])).setValue(this.modalModel.print_label_id_1);
        (<FormControl>(this.form.controls['print_label_id_2'])).setValue(this.modalModel.print_label_id_2);
        (<FormControl>(this.form.controls['print_sticker_id'])).setValue(this.modalModel.print_sticker_id);
        (<FormControl>(this.form.controls['hardware_tester_id'])).setValue(this.modalModel.hardware_tester_id);
        (<FormControl>(this.form.controls['typeOfBoard'])).setValue(this.modalModel.typeOfBoard);
        (<FormControl>(this.form.controls['producer'])).setValue(this.modalModel.producer);
    }

    onSubmitClick(): void {
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.print_label_id_1 = this.form.controls['print_label_id_1'].value;
        this.modalModel.print_label_id_2 = this.form.controls['print_label_id_2'].value;
        this.modalModel.print_sticker_id = this.form.controls['print_sticker_id'].value;
        this.modalModel.hardware_tester_id = this.form.controls['hardware_tester_id'].value;
        this.modalModel.producer = this.form.controls['producer'].value;
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
