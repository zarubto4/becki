/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { ModalModel } from '../services/ModalService';
import { TranslationService } from '../services/TranslationService';
import { ConsoleLogType } from '../components/ConsoleLogComponent';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormSelectComponentOption } from '../components/FormSelectComponent';


export class ModalsLogLevelModel extends ModalModel {
    constructor(public logLevel: ('error' | 'warn' | 'info' | 'log') = 'info') {
        super();
    }
}

@Component({
    selector: 'bk-modals-terminal-loglevel-change',
    templateUrl: './hardware-terminal-logLevel.html'
})
export class ModalsLogLevelComponent implements OnInit {

    @Input()
    modalModel: ModalsLogLevelModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    logLeveloptions: FormSelectComponentOption[] = [{ value: 'log', label: 'log' }, { value: 'info', label: 'info' }, { value: 'warn', label: 'warn' }, { value: 'error', label: 'error' }];


    constructor(private translationService: TranslationService, private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            'logLevel': ['', Validators.required],
        });
    }

    ngOnInit(): void {
        let previousLog = this.logLeveloptions.find(level => level.label === this.modalModel.logLevel).label += ' ' + this.translationService.translate('label_choosen', this);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onOkClick(): void {
        this.modalModel.logLevel = this.form.controls['logLevel'].value;
        this.modalClose.emit(true);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }

}
