/**
 * Created by Alexandr Tylš on 08.03.18.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponent, FormSelectComponentOption } from '../components/FormSelectComponent';

export class ModalsSelectProgramVersionModel extends ModalModel {
    selectedProgramId: string = null;
    selectedVersionId: string = null;
    programs = [];
    program_options: FormSelectComponentOption[] = [];
    constructor(programs = []) {
        super();

        this.programs = programs;

        this.program_options = this.programs.map((program) => {
            return {
                label: program.name,
                value: program.id
            };
        });
    }
}

@Component({
    selector: 'bk-modals-program-version-select',
    templateUrl: './program-version-select.html'
})
export class ModalsProgramVersionSelectComponent implements OnInit {

    @Input()
    modalModel: ModalsSelectProgramVersionModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    @ViewChild(FormSelectComponent)
    selector: FormSelectComponent;

    errorMessage: string = null;

    form: FormGroup;

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            id: ['', [Validators.required]]
        });
    }

    constructor(private formBuilder: FormBuilder) {
    }

    onProgramValueChanged(programId: string) {
        this.modalModel.selectedProgramId = programId;
    }

    onVersionValueChanged(versionId: string) {
        this.modalModel.selectedVersionId = versionId;
    }

    onSubmitClick(): void {
        if (!this.modalModel.selectedVersionId) {
            this.errorMessage = 'There is no version selected.'; // this.translationService.translate('label_no_version_selected', this);
        } else {
            this.modalClose.emit(true);
        }
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
