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
import {
    IBProgramVersion, ICProgram, ICProgramList, ICProgramVersion, IGridProject,
    IGridProjectList
} from '../backend/TyrionAPI';
import { ProgramVersionSelectorComponent } from '../components/VersionSelectorComponent';
import {FlashMessageError} from "../services/NotificationService";

export class ModalsSelectGridProjectModel extends ModalModel {
    public selected_grid_project: string = null;

    constructor(public project_id: string = null) {
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

    selected_grid_project: IGridProject = null;
    projects: IGridProjectList = null;

    // Filter parameters

    constructor(private tyrionBackendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService) {
    }

    ngOnInit(): void {
        // Expression has changed after it was checked -  setTimeout is protection
        setTimeout(() => {
            this.onFilterProjects(0);
        });
    }


    onSubmitClick(): void {
        if (!this.modalModel.selected_grid_project) {
            this.errorMessage = this.translationService.translate('label_no_project_selected', this) ; //There is no version selected. ;
        } else {
            this.modalClose.emit(true);
        }
    }

    onSelectProjectClick(project: IGridProject): void {
        this.selected_grid_project = project;
    }

    onBack(): void {
        this.selected_grid_project = null;
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
            .catch(reason => {

            });
    }

    onValueChanged(versionId: string) {

    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
