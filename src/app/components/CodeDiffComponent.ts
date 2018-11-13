
import {
    Component, OnChanges, Input, Output, SimpleChanges, EventEmitter, OnInit,
    AfterViewInit, QueryList, ViewChildren
} from '@angular/core';
import { FileTreeObject, FileTreeObjectInterface } from './FileTreeComponent';
import { ModalsCodeFileDialogModel, ModalsCodeFileDialogType } from '../modals/code-file-dialog';
import { ModalService } from '../services/ModalService';
import { ModalsConfirmModel } from '../modals/confirm';
import { TranslationService } from '../services/TranslationService';
import { FormSelectComponentOption } from './FormSelectComponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IHardware, ICProgram } from '../backend/TyrionAPI';
import { BlockoViewComponent } from './BlockoViewComponent';
import { Blocks } from 'blocko';
import { CodeFileSystemObject, CodeFile, CodeDirectory } from './CodeIDEComponent';

@Component({
    selector: 'bk-code-diff',
    templateUrl: './CodeDiffComponent.html'
})
export class CodeDiffComponent implements OnChanges {

    @Input()
    codeProgram: ICProgram = null;

    files: CodeFile[] = null;

    @Input()
    defaultOpenFilename: string = 'main.cpp';

    directories: CodeDirectory[] = [];

    openFilesTabIndex: number = 0;

    openFile: CodeFile = null;

    rootFileTreeObject: FileTreeObject<CodeFileSystemObject>;

    selectedFto: FileTreeObject<CodeFileSystemObject>;

    constructor(protected modalService: ModalService, private translationService: TranslationService,  private formBuilder: FormBuilder) {

        this.refreshRootFileTree();
    }

    ngOnChanges(changes: SimpleChanges): void {
        let files = changes['files'];
        if (files) {
            this.files = files.currentValue;
            this.directories = [];
            this.openFilesTabIndex = 0;
            this.refreshRootFileTree();

            // TODO: maybe do it as call method by ViewChild
            if (this.defaultOpenFilename && this.files) {
                let file: CodeFile = null;
                this.files.forEach((f) => {
                    if (f.objectFullPath === this.defaultOpenFilename) {
                        file = f;
                    }
                });
                if (file) {
                    this.openFilesOpenFile(file);
                }
            }
        }
    }

    openFilesOpenFile(file: CodeFile) {
        this.openFile = file;
    }

    generateDirectoriesFromFiles() {
        if (!Array.isArray(this.files)) {
            return;
        }

        this.files.forEach((file) => {
            let path = file.objectPath;

            if (path !== '') {

                let parts = path.split('/');

                let fullPath = '';

                for (let i = 0; i < parts.length; i++) {

                    if (fullPath === '') {
                        fullPath += parts[i];
                    } else {
                        fullPath += '/' + parts[i];
                    }

                    let dir: CodeDirectory = null;
                    for (let x = 0; x < this.directories.length; x++) {
                        if (this.directories[x].objectFullPath === fullPath) {
                            dir = this.directories[x];
                        }
                    }
                    if (!dir) {
                        this.directories.push(new CodeDirectory(fullPath));
                    }

                }

            }

        });
    }

    refreshRootFileTree(selectFileObject: CodeFileSystemObject = null) {
        if (!Array.isArray(this.files)) {
            return;
        }

        // generate missing directories in filesystem
        this.generateDirectoriesFromFiles();


        let selectedData: CodeFileSystemObject = selectFileObject;
        if (!selectedData && this.selectedFto && this.selectedFto.data) {
            selectedData = this.selectedFto.data;
        }

        let newRootFileTreeObject = new FileTreeObject<CodeFileSystemObject>('/');
        newRootFileTreeObject.children = []; // make directory
        newRootFileTreeObject.color = '#ffc50d';
        newRootFileTreeObject.open = (this.rootFileTreeObject) ? this.rootFileTreeObject.open : true;

        let newSelectFto: FileTreeObject<CodeFileSystemObject> = newRootFileTreeObject;

        // initialize directories
        this.directories.forEach((dir: CodeDirectory) => {

            let parts = dir.objectFullPath.split('/');

            let parentFto = newRootFileTreeObject;

            for (let i = 0; i < parts.length; i++) {

                let partName = parts[i];
                let newFto: FileTreeObject<CodeFileSystemObject> = parentFto.childByName(partName, true);
                if (!newFto) {
                    newFto = new FileTreeObject<CodeFileSystemObject>(partName);
                    newFto.children = []; // make directory
                    parentFto.children.push(newFto);
                }

                parentFto = newFto;

            }

            parentFto.data = dir;
            if (dir === selectedData) {
                newSelectFto = parentFto;
            }

        });

        // initialize files
        this.files.forEach((file: CodeFile) => {

            let parts = file.objectFullPath.split('/');

            let parentFto = newRootFileTreeObject;

            for (let i = 0; i < (parts.length - 1); i++) {

                let partName = parts[i];
                let newFto: FileTreeObject<CodeFileSystemObject> = parentFto.childByName(partName, true);
                if (!newFto) {
                 //   throw new Error(this.translate('error_missing_folder' , partName , file.objectFullPath));
                }
                parentFto = newFto;

            }

            let fto = new FileTreeObject<CodeFileSystemObject>(parts[(parts.length - 1)]);
            fto.data = file;
            parentFto.children.push(fto);

            if (file === selectedData) {
                newSelectFto = fto;
            }

        });

        newRootFileTreeObject.sortChildren();
        this.rootFileTreeObject = newRootFileTreeObject;
        this.selectedFto = newSelectFto;
        this.rootFileTreeObject.select(newSelectFto, true);

    }

}