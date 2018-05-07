/**
 * Created by Alexandr Tylš on 03.01.18.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, ViewChild, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { TranslationService } from '../services/TranslationService';
import { IBProgramVersion, ICProgram, ICProgramList, ICProgramVersion } from '../backend/TyrionAPI';
import { ProgramVersionSelectorComponent } from '../components/VersionSelectorComponent';
import { FlashMessageError } from '../services/NotificationService';

export class ModalsSelectCodeModel extends ModalModel {
    public selectedCProgramVersionId: string = null;
    public selectedCProgramId: string = null;

    constructor(public project_id: string = null, public hardware_type_id: string = null) {
        super();
        this.modalLarge = true;
    }
}

@Component({
    selector: 'bk-modals-code-select',
    templateUrl: './code-select.html'
})
export class ModalsCodeSelectComponent implements OnInit {

    @Input()
    modalModel: ModalsSelectCodeModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    @ViewChild(ProgramVersionSelectorComponent)
    versionSelector: ProgramVersionSelectorComponent;

    errorMessage: string = null;

    selected_c_program: ICProgram = null;
    programs: ICProgramList = null;

    // Filter parameters
    hardware_type_ids: string [] = null;
    public_programs: boolean = false;

    constructor(private tyrionBackendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService) {
    }

    ngOnInit(): void {
        if(this.modalModel.hardware_type_id != null) {
            this.hardware_type_ids = [];
            this.hardware_type_ids.push(this.modalModel.hardware_type_id)
        }

        // Expression has changed after it was checked -  setTimeout is protection
        setTimeout(() => {
            this.onFilterPrograms(0);
        });
    }


    onSubmitClick(): void {
        if (!this.modalModel.selectedCProgramVersionId) {
            this.errorMessage = this.translationService.translate('label_no_version_selected', this) ; //There is no version selected. ;
        } else {
            this.modalClose.emit(true);
        }
    }

    onSelectProgramClick(cprogram: ICProgram): void {
        this.selected_c_program = cprogram;
    }

    onBack(cprogram: ICProgram): void {
        this.selected_c_program = null;
    }

    onDrobDownEmiter(action: string, object: any): void {
        if (action === 'label_select_code') {
            this.onSelectProgramClick(object);
        }
    }

    onFilterPrograms(page: number = 0): void {

        this.tyrionBackendService.cProgramGetListByFilter(page, {
            project_id: this.modalModel.project_id,
            public_programs: this.public_programs,
            hardware_type_ids: this.hardware_type_ids,
            count_on_page: 10
        })
            .then((iCProgramList) => {
                this.programs = iCProgramList;
            })
            .catch(reason => {

            });
    }

    onValueChanged(versionId: string) {
        this.modalModel.selectedCProgramVersionId = versionId;
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
