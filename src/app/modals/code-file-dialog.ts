/**
 * Created by davidhradek on 01.09.16.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { CodeDirectory } from '../components/CodeIDEComponent';
import { FileTreeObject } from '../components/FileTreeComponent';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { TranslationService } from '../services/TranslationService';

export enum ModalsCodeFileDialogType {
    AddFile = 1,
    AddDirectory,
    MoveFile,
    MoveDirectory,
    RenameFile,
    RenameDirectory,
    RemoveFile,
    RemoveFileLibrary,
    RemoveDirectory,
}

export class ModalsCodeFileDialogModel extends ModalModel {
    constructor(
        public type: ModalsCodeFileDialogType,
        public objectName: string = '',
        public directories: CodeDirectory[] = null,
        public selectedDirectory: CodeDirectory = null,
        public objectFullName: string = ''
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-code-file-dialog',
    templateUrl: './code-file-dialog.html'
})
export class ModalsCodeFileDialogComponent implements OnInit {

    @Input()
    modalModel: ModalsCodeFileDialogModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    rootFileTreeObject: FileTreeObject<CodeDirectory>;
    selectedFto: FileTreeObject<CodeDirectory>;

    neededName: boolean = false;
    neededDirectory: boolean = false;

    textTitle: string = '';
    textLabel: string = '';
    textSubmit: string = 'btn_done';
    textCancel: string = 'btn_cancel';

    constructor(private backendService: BackendService, private formBuilder: FormBuilder, private translationService: TranslationService) {
    }

    ngOnInit() {

        switch (this.modalModel.type) {
            case ModalsCodeFileDialogType.AddFile:
                this.neededName = true;
                this.neededDirectory = true;
                this.textTitle = this.translate('text_add_file');
                this.textLabel = this.translate('text_add_file_name');
                this.textSubmit = this.translate('btn_add');
                break;
            case ModalsCodeFileDialogType.AddDirectory:
                this.neededName = true;
                this.neededDirectory = true;
                this.textTitle = this.translate('btn_add_directory');
                this.textLabel = this.translate('text_directory_name');
                this.textSubmit = this.translate('btn_add');
                break;
            case ModalsCodeFileDialogType.MoveFile:
                this.neededName = false;
                this.neededDirectory = true;
                this.textTitle = this.translate('text_move_file', this.modalModel.objectFullName);
                this.textSubmit = this.translate('btn_move');
                break;
            case ModalsCodeFileDialogType.MoveDirectory:
                this.neededName = false;
                this.neededDirectory = true;
                this.textTitle = this.translate('text_move_directory', this.modalModel.objectFullName);
                this.textSubmit = this.translate('btn_move');
                break;
            case ModalsCodeFileDialogType.RenameFile:
                this.neededName = true;
                this.neededDirectory = false;
                this.textTitle = this.translate('text_rename_file', this.modalModel.objectFullName);
                this.textLabel = this.translate('text_file_name');
                this.textSubmit = this.translate('btn_rename');
                break;
            case ModalsCodeFileDialogType.RenameDirectory:
                this.neededName = true;
                this.neededDirectory = false;
                this.textTitle = this.translate('text_rename_directory', this.modalModel.objectFullName);
                this.textLabel = this.translate('text_directory_name');
                this.textSubmit = this.translate('btn_rename');
                break;
            case ModalsCodeFileDialogType.RemoveFile:
                this.neededName = false;
                this.neededDirectory = false;
                this.textTitle = this.translate('text_remove_file', this.modalModel.objectFullName);
                this.textSubmit = this.translate('btn_yes');
                this.textCancel = this.translate('btn_no');
                break;
            case ModalsCodeFileDialogType.RemoveFileLibrary:
                this.neededName = false;
                this.neededDirectory = false;
                this.textTitle = this.translate('text_remove_library', this.modalModel.objectFullName);
                this.textSubmit = this.translate('btn_yes');
                this.textCancel = this.translate('btn_no');
                break;
            case ModalsCodeFileDialogType.RemoveDirectory:
                this.neededName = false;
                this.neededDirectory = false;
                this.textTitle = this.translate('text_remove_directory', this.modalModel.objectFullName);
                this.textSubmit = this.translate('btn_yes');
                this.textCancel = this.translate('btn_no');
                break;
        }

        if (this.neededName) {
            this.form = this.formBuilder.group({
                'objectName': [this.modalModel.objectName, [Validators.required, Validators.minLength(1), BeckiValidators.filename]]
            });
        }

        if (this.neededDirectory) {

            let newRootFileTreeObject = new FileTreeObject<CodeDirectory>('/');
            newRootFileTreeObject.children = []; // make directory
            newRootFileTreeObject.color = '#ffc50d';
            newRootFileTreeObject.open = (this.rootFileTreeObject) ? this.rootFileTreeObject.open : true;

            this.selectedFto = newRootFileTreeObject;

            // initialize directories
            this.modalModel.directories.forEach((dir: CodeDirectory) => {
                let parts = dir.objectFullPath.split('/');
                let parentFto = newRootFileTreeObject;
                for (let i = 0; i < parts.length; i++) {
                    let partName = parts[i];
                    let newFto: FileTreeObject<CodeDirectory> = parentFto.childByName(partName, true);
                    if (!newFto) {
                        newFto = new FileTreeObject<CodeDirectory>(partName);
                        newFto.children = []; // make directory
                        parentFto.children.push(newFto);
                    }
                    parentFto = newFto;
                }
                parentFto.data = dir;
                if (this.modalModel.selectedDirectory === dir) {
                    this.selectedFto = parentFto;
                }
            });

            newRootFileTreeObject.sortChildren();
            this.rootFileTreeObject = newRootFileTreeObject;
            this.rootFileTreeObject.select(this.selectedFto);

        }

    }

    selectFto(fto: FileTreeObject<CodeDirectory>) {
        this.selectedFto = fto;
    }

    translate(key: string, ...args: any[]): string {
        return this.translationService.translate(key, this, null, args);
    }

    onSubmitClick(): void {
        if (this.neededName) {
            this.modalModel.objectName = this.form.controls['objectName'].value;
        }
        if (this.neededDirectory) {
            if (this.selectedFto) {
                this.modalModel.selectedDirectory = this.selectedFto.data;
            } else {
                this.modalModel.selectedDirectory = null;
            }
        }
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
