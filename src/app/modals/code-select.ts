/**
 * Created by Alexandr Tylš on 03.01.18.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { TranslationService } from '../services/TranslationService';
import { ICProgramShortDetailForBlocko } from '../backend/TyrionAPI';
import { CProgramVersionSelectorComponent } from '../components/CProgramVersionSelectorComponent';

export class ModalsSelectCodeModel extends ModalModel {
    selectedVersionId: string = null;
    constructor(
        public cPrograms: ICProgramShortDetailForBlocko[] = []
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-code-select',
    templateUrl: './code-select.html'
})
export class ModalsCodeSelectComponent {

    @Input()
    modalModel: ModalsSelectCodeModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    @ViewChild(CProgramVersionSelectorComponent)
    versionSelector: CProgramVersionSelectorComponent;

    errorMessage: string = null;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService) {
    }

    onValueChanged(versionId: string) {
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
