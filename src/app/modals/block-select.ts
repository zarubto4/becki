/**
 * Created by Alexandr Tylš on 03.01.18.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { TranslationService } from '../services/TranslationService';
import { IBlock, IBlockList, IBlockVersion } from '../backend/TyrionAPI';
import { ProgramVersionSelectorComponent } from '../components/VersionSelectorComponent';
import { FlashMessageError, NotificationService } from '../services/NotificationService';


export interface BlockInterface {
    name: string;
    description: string;
    blockoName: string;
    backgroundColor: string;
}

export class ModalsSelectBlockModel extends ModalModel {
    public selectedBlockVersion: IBlockVersion = null;
    public selectedBlock: IBlock = null;
    public selectedSpecialBlock: BlockInterface = null;

    constructor(public project_id: string = null, public already_selected_code_for_version_change: {
        block_id: string,
        block_version_id: string
    } = null) {
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

    tab: string = 'filter_blocks';

    blocks: IBlockList = null;
    logic_blocks: BlockInterface[] = [
        {
            name: 'NOT',
            description: 'Boolean Algebra (negation) - DIGITAL',
            blockoName: 'not',
            backgroundColor: 'rgb(161, 136, 127)'
        },
        {
            name: 'AND',
            description: 'Boolean Algebra (Conjunction) - DIGITAL',
            blockoName: 'and',
            backgroundColor: 'rgb(161, 136, 127)'
        },
        {
            name: 'OR',
            description: 'Boolean Algebra (Disjunction) - DIGITAL',
            blockoName: 'or',
            backgroundColor: 'rgb(161, 136, 127)'
        },
        {
            name: 'XOR',
            description: 'Boolean Algebra (Exclusive-or) - DIGITAL',
            blockoName: 'xor',
            backgroundColor: 'rgb(161, 136, 127)'
        }
    ];

    debug_blocks: BlockInterface[] = [
        {
            name: 'Switch',
            description: 'Interactive simulations of Switch Button',
            blockoName: 'switch',
            backgroundColor: 'rgb(204, 204, 255)'
        },
        {
            name: 'Push button',
            description: 'Interactive simulations of Classic Button',
            blockoName: 'pushButton',
            backgroundColor: 'rgb(204, 204, 255)'
        },
        {
            name: 'Digital output',
            description: 'Interactive simulations ',
            blockoName: 'light',
            backgroundColor: 'rgb(204, 204, 255)'
        },
        {
            name: 'Analog input',
            description: 'Interactive simulations of Inputs',
            blockoName: 'analogInput',
            backgroundColor: 'rgb(204, 255, 204)'
        },
        {
            name: 'Analog output',
            description: 'Interactive simulations of Outputs',
            blockoName: 'analogOutput',
            backgroundColor: 'rgb(204, 255, 204)'
        },
        {
            name: 'WebHook',
            description: '',
            blockoName: 'webHook',
            backgroundColor: 'rgb(204, 255, 204)'
        },
        {
            name: 'Database',
            description: '',
            blockoName: 'databaseBlock',
            backgroundColor: 'rgb(204, 255, 204)'
        }
    ];

    // Filter parameters
    public_block: boolean = false;
    private_block: boolean = true;
    page: number = 0;

    constructor(private tyrionBackendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService,  protected notificationService: NotificationService, ) {
    }

    ngOnInit(): void {
        // Expression has changed after it was checked -  setTimeout is protection TODO it is not protection, it is temporary hack, use ChangeDetectorRef instead
        if (!this.modalModel.already_selected_code_for_version_change) {
            this.onFilterBlocks(0);
        } else {
            this.tyrionBackendService.blockGet(this.modalModel.already_selected_code_for_version_change.block_id)
                .then((block) => {
                    this.onSelectBlockClick(block);
                }).catch(reason => {
                    this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                    this.errorMessage = reason.message;
                });
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onSubmitClick(): void {
        console.info('onSubmitClick::selectedBlockVersion', this.modalModel.selectedBlockVersion);
        console.info('onSubmitClick::label_no_version_selected', this.modalModel.selectedSpecialBlock);
        if (!this.modalModel.selectedBlockVersion && !this.modalModel.selectedSpecialBlock) {
            this.errorMessage = this.translationService.translate('label_no_version_selected', this) ; // There is no version selected. ;
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

    onSelectSpecialBlockClick(block: BlockInterface): void {
        this.modalModel.selectedSpecialBlock = block;
        this.onSubmitClick();
    }

    onDrobDownEmiter(action: string, object: any): void {
        if (action === 'label_select_block') {
            this.onSelectBlockClick(object);
        }
        if (action === 'label_select_debug_block') {
            this.onSelectSpecialBlockClick(object);
        }
    }

    onFilterChange(filter: {key: string, value: any}) {
        console.info('onFilterChange: Key', filter.key, 'value', filter.value);

        if (filter.key === 'public_block') {
            this.public_block = filter.value;
        }

        if (filter.key === 'private_block') {
            this.private_block = filter.value;
        }

        this.onFilterBlocks();
    }

    onFilterBlocks(page?: number): void {

        if (page != null) {
            this.page = page;
        }

        this.blocks = null;

        this.tyrionBackendService.blockGetListByFilter(this.page , {
            project_id: this.private_block ? this.modalModel.project_id : null,
            public_programs: this.public_block,
            count_on_page: 10
        })
            .then((list) => {
                this.blocks = list;
            })
            .catch(reason => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
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
