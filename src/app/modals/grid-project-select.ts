/**
 * Created by Alexandr Tylš on 03.01.18.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { TranslationService } from '../services/TranslationService';
import { IGridProgram, IGridProgramVersion, IGridProject, IGridProjectList } from '../backend/TyrionAPI';
import { NotificationService } from '../services/NotificationService';
import { IError } from '../services/_backend_class/Responses';

export class ModalsSelectGridProjectModel extends ModalModel {
    public selected_grid_project: IGridProject = null;
    public selectedGridProgramVersions: { [program_id: string]: {
        m_program: IGridProgram
        version: IGridProgramVersion
    } } = {};

    constructor(public project_id: string = null, public already_selected_project_for_version_change: {
        grid_project_id: string,
    } = null) {
        super();
        this.modalLarge = true;
    }
}

@Component({
    selector: 'bk-modals-grid-project-select',
    templateUrl: './grid-project-select.html'
})
export class ModalsGridProjectSelectComponent implements OnInit {

    @Input()
    modalModel: ModalsSelectGridProjectModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    errorMessage: string = null;

    projects: IGridProjectList = null;

    // Filter parameters

    constructor(private tyrionBackendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService, protected notificationService: NotificationService, ) {
    }

    ngOnInit(): void {
        if (!this.modalModel.already_selected_project_for_version_change) {
            this.onFilterProjects(0);
        } else {
            this.tyrionBackendService.gridProjectGet(this.modalModel.already_selected_project_for_version_change.grid_project_id)
                .then((project) => {
                    this.onSelectProjectClick(project);
                })
                .catch((reason: IError) => {
                    this.notificationService.fmError(reason);
                });
        }
    }


    onSubmitClick(): void {
        if (!this.modalModel.selected_grid_project) {
            this.errorMessage = this.translationService.translate('label_no_project_selected', this) ; // There is no version selected.
        } else {
            this.modalClose.emit(true);
        }
    }

    onSelectProjectClick(project: IGridProject): void {
        this.modalModel.selected_grid_project = project;
    }

    onBack(): void {
        this.modalModel.selected_grid_project = null;
    }

    onDrobDownEmiter(action: string, object: any): void {
        if (action === 'label_select_project') {
            this.onSelectProjectClick(object);
        }
    }

    onFilterProjects(page: number = 0): void {

        this.tyrionBackendService.gridProjectGetByFilter(page, {
            project_id: this.modalModel.project_id,
            count_on_page: 10
        })
            .then((projects) => {
                this.projects = projects;
            })
            .catch((reason: IError) => {
                this.notificationService.fmError(reason);
            });
    }

    onValueChanged(m_program_version: IGridProgramVersion, m_program: IGridProgram) {
        this.modalModel.selectedGridProgramVersions[m_program.id] = {
            version: m_program_version,
            m_program: m_program
        };
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
