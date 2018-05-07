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
    IBlock, IBlockList, IBlockVersion, IBProgramVersion, ICProgram, ICProgramList,
    ICProgramVersion
} from '../backend/TyrionAPI';
import { ProgramVersionSelectorComponent } from '../components/VersionSelectorComponent';
import { FlashMessageError } from '../services/NotificationService';

export class ModalsSelectBlockModel extends ModalModel {
    public selectedBlockVersion: IBlockVersion = null;
    public selectedBlock: IBlock = null;

    constructor(public project_id: string = null) {
        super();
        this.modalLarge = true;
    }
}

@Component({
    selector: 'bk-modals-block-select',
    templateUrl: './block-select.html'
})
export class ModalsBlockSelectComponent implements OnInit {

    @Input()
    modalModel: ModalsSelectBlockModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    @ViewChild(ProgramVersionSelectorComponent)
    versionSelector: ProgramVersionSelectorComponent;

    errorMessage: string = null;

    blocks: IBlockList = null;

    // Filter parameters
    public_programs: boolean = false;

    constructor(private tyrionBackendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService) {
    }

    ngOnInit(): void {
        // Expression has changed after it was checked -  setTimeout is protection
        setTimeout(() => {
            this.onFilterBlocks(0);
        });
    }


    onSubmitClick(): void {
        if (!this.modalModel.selectedBlockVersion) {
            this.errorMessage = this.translationService.translate('label_no_version_selected', this) ; //There is no version selected. ;
        } else {
            this.modalClose.emit(true);
        }
    }

    onSelectBlockClick(block: IBlock): void {
        this.modalModel.selectedBlock = block;
    }

    onBack(): void {
        this.modalModel.selectedBlock = null;
    }

    onDrobDownEmiter(action: string, object: any): void {
        if (action === 'label_select_block') {
            this.onSelectBlockClick(object);
        }
    }

    onFilterBlocks(page: number = 0): void {

        this.tyrionBackendService.blockGetByFilter(page, {
            project_id: this.modalModel.project_id,
            public_programs: this.public_programs,
            count_on_page: 10
        })
            .then((list) => {
                this.blocks = list;
            })
            .catch(reason => {

            });
    }

    onValueChanged(version: IBlockVersion) {
        this.modalModel.selectedBlockVersion = version;
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
