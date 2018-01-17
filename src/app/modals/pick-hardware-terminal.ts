/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { TranslationService } from './../services/TranslationService';
import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption, FormSelectComponent } from '../components/FormSelectComponent';
import { IBoard, IBoardForFastUploadDetail } from '../backend/TyrionAPI';
import { TerminalParameters } from '../views/projects-project-hardware-hardware';
import { ConsoleLogType } from '../components/ConsoleLogComponent';


export class ModalPickHardwareTerminalModel extends ModalModel {
    constructor(public boards: TerminalParameters[], public color: string, public logLevel: ConsoleLogType = 'info', public selectedBoard: TerminalParameters = null) {
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

    logLeveloptions: FormSelectComponentOption[] = [{ value: 'log', label: 'log' }, { value: 'info', label: 'info' }, { value: 'warn', label: 'warn' }, { value: 'error', label: 'error' }];

    form: FormGroup;

    constructor(private backendService: BackendService, private formBuilder: FormBuilder, private translationService: TranslationService) {

        this.form = this.formBuilder.group({
            'board': ['', [Validators.required]],
            'color': ['', [Validators.required]],
            'logLevel': ['info', Validators.required],
        });
    }

    ngOnInit() {
        this.options = this.modalModel.boards.map((b) => {
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
        this.modalModel.logLevel = this.form.controls['logLevel'].value;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
