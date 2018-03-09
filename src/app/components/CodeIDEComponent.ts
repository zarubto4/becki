/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnChanges, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FileTreeObject, FileTreeObjectInterface } from './FileTreeComponent';
import { ModalsCodeFileDialogModel, ModalsCodeFileDialogType } from '../modals/code-file-dialog';
import { ModalService } from '../services/ModalService';
import { ModalsConfirmModel } from '../modals/confirm';
import { TranslationService } from '../services/TranslationService';
import { FormSelectComponentOption } from './FormSelectComponent';
import { AbstractControl } from '@angular/forms';

export abstract class CodeFileSystemObject implements FileTreeObjectInterface {

    originalObjectFullPath: string;
    objectFullPath: string;

    open: boolean = false;

    constructor(objectFullPath: string) {
        this.originalObjectFullPath = objectFullPath;
        this.objectFullPath = objectFullPath;
    }

    get color(): string {
        return this.open ? 'gray' : 'silver';
    }

    get bold(): boolean {
        return false;
    }

    get changes(): boolean {
        return (this.originalObjectFullPath !== this.objectFullPath);
    }

    get objectName(): string {
        let i = this.objectFullPath.lastIndexOf('/');
        if (i > -1) {
            return this.objectFullPath.substr(i + 1);
        }
        return this.objectFullPath;
    }

    get objectPath(): string {
        let i = this.objectFullPath.lastIndexOf('/');
        if (i > -1) {
            return this.objectFullPath.substr(0, i);
        }
        return '';
    }

}

export class CodeFile extends CodeFileSystemObject {

    contentOriginal: string;
    content: string;

    fixedPath: boolean = false;

    library: boolean = false;

    readonly: boolean = false;


    libraryName: string = null;
    libraryId: string = null;
    libraryVersionId: string = null;

    annotations: any[];

    constructor(objectFullPath: string, content: string = null) {
        super(objectFullPath);
        if (content === null) {
            this.originalObjectFullPath = '';
            this.contentOriginal = '';
            this.content = '';
        } else {
            this.contentOriginal = content;
            this.content = content;
        }
    }

    get extension(): string {
        let i = this.objectName.lastIndexOf('.');
        if (i > -1) {
            return this.objectName.substr(i + 1);
        }
        return '';
    }

    get color(): string {
        if (this.library) {
            return '#9A12B3';
        }
        let ext = this.extension.toLowerCase();
        if (ext === 'cpp') {
            return '#067084';
        } else if (ext === 'h') {
            return '#782c1f';
        } else if (ext === 'c') {
            return '#013284';
        }
        return 'silver';
    }

    get icon(): string {
        if (this.library) {
            return 'briefcase';
        }
        return 'file-text';
    }


    get bold(): boolean {
        return this.open;
    }

    get changes(): boolean {
        return ((this.originalObjectFullPath !== this.objectFullPath) || (this.contentOriginal !== this.content));
    }

}

export class CodeDirectory extends CodeFileSystemObject {

    get color(): string {
        return '#ffc50d';
    }

    // for directory is path = fullPath;
    get objectPath(): string {
        return this.objectFullPath;
    }
}

@Component({
    selector: 'bk-code-ide',
    templateUrl: './CodeIDEComponent.html'
})
export class CodeIDEComponent implements OnChanges {

    @Input()
    files: CodeFile[] = null;

    @Input()
    defaultOpenFilename: string = null;

    @Input()
    enableLibraryButtons: boolean = false;

    @Input()
    enableSaveButton: boolean = false;

    @Input()
    enableBuildButton: boolean = false;

    @Input()
    buildInProgress: boolean = false;

    @Output()
    fileContentChange = new EventEmitter<{ fileFullPath: string, content: string }>();

    @Output()
    onAddLibraryClick = new EventEmitter<any>();

    @Output()
    onAddHardwareClick = new EventEmitter<any>();

    @Output()
    onChangeLibraryVersionClick = new EventEmitter<CodeFile>();

    // Compilation version
    @Input()
    compilation_version_library_tag: AbstractControl = null;

    // List of all Version for compilation (for this type_of_board)
    @Input()
    libraryCompilationVersionOptions: FormSelectComponentOption[] = null;

    @Output()
    onSaveClick = new EventEmitter<boolean>();

    @Output()
    onBuildClick = new EventEmitter<boolean>();

    directories: CodeDirectory[] = [];

    openFilesTabIndex: number = 0;

    openFiles: CodeFile[] = [];

    rootFileTreeObject: FileTreeObject<CodeFileSystemObject>;

    selectedFto: FileTreeObject<CodeFileSystemObject>;


    private _show_files_portlet: boolean = true;
    private _show_libraries_portlet: boolean = false;
    private _show_integrated_hardware_portlet: boolean = false;
    private _show_blocko_interface_portlet: boolean = false;
    private _show_code_settings_portlet: boolean = false;


    constructor(protected modalService: ModalService, private translationService: TranslationService) {

        this.refreshRootFileTree();

    }

    ngOnChanges(changes: SimpleChanges): void {
        let files = changes['files'];
        if (files) {
            this.files = files.currentValue;
            this.directories = [];
            this.openFiles = [];
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

    translate(key: string, ...args: any[]): string {
        return this.translationService.translate(key, this, null, args);
    }

    showModalError(title: string, text: string) {
        this.modalService.showModal(new ModalsConfirmModel(title, text, true, null, null, [this.translate('btn_ok')]));
    }

    langFromFilename(fileObj: CodeFile) {
        if (fileObj.extension.toLowerCase() === 'md') {
            return 'markdown';
        }
        if (fileObj.library) {
            return 'markdown';
        }
        return 'cpp';
    }

    toolbarAddLibraryClick(e: any) {
        this.onAddLibraryClick.emit(e);
    }

    toolbarAddHardwareClick(e: boolean) {
        this.onAddHardwareClick.emit(true);
    }

    toolbarLibraryChangeVersionClick(e: any) {

        let err = this.translate('label_error_not_selected_library');

        if (!this.selectedFto) {
            this.showModalError(this.translate('modal_label_error'), err);
            return;
        }
        if (!this.selectedFto.data) {
            this.showModalError(this.translate('modal_label_error'), err);
            return;
        }
        let selData = this.selectedFto.data;
        if (selData instanceof CodeFile) {
            if (selData.library) {
                this.onChangeLibraryVersionClick.emit(selData);
                return;
            }
        }

        this.showModalError(this.translate('modal_label_error'), err);
    }

    onCodeChange(code: string, fileObj: CodeFile) {
        fileObj.content = code;
        this.fileContentChange.emit({
            fileFullPath: fileObj.objectFullPath,
            content: code
        });
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
                    throw new Error(this.translate('error_missing_folder' , partName , file.objectFullPath));
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

    selectFto(fto: FileTreeObject<CodeFileSystemObject>) {
        this.selectedFto = fto;

        if (fto.data && fto.data instanceof CodeFile) {
            this.openFilesOpenFile(<CodeFile>fto.data);
        }

    }

    openFilesOpenFile(file: CodeFile) {
        if (this.files.indexOf(file) === -1) {
            return;
        }
        if (this.openFiles.indexOf(file) === -1) {
            this.openFiles.push(file);
            file.open = true;
        }
        this.openFilesTabIndex = this.openFiles.indexOf(file);
    }

    openFilesOpenTab(index: number) {
        this.openFilesTabIndex = index;
    }

    openFilesCloseTab(file: CodeFile) {
        let i = this.openFiles.indexOf(file);
        if (i > -1) {
            this.openFiles.splice(i, 1);
            file.open = false;
            if (this.openFilesTabIndex >= this.openFiles.length) {
                this.openFilesTabIndex = (this.openFiles.length - 1);
            }
        }
    }

    isFileExist(fileFullPath: string) {
        if (!Array.isArray(this.files)) {
            return;
        }

        let exist = false;
        this.files.forEach((f) => {
            if (f.objectFullPath === fileFullPath) {
                exist = true;
            }
        });
        return exist;
    }

    isDirectoryExist(dirFullPath: string) {
        let exist = false;
        this.directories.forEach((f) => {
            if (f.objectFullPath === dirFullPath) {
                exist = true;
            }
        });
        return exist;
    }

    exetrnalAddFile(cf: CodeFile) {
        if (this.isFileExist(cf.objectFullPath)) {
            this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_add_file_at_path', cf.objectFullPath));
        } else {
            this.files.push(cf);
            this.refreshRootFileTree(cf);
        }
    }

    externalRefresh() {
        this.refreshRootFileTree();
    }

    toolbarAddFileClick(fto: FileTreeObject<any>) {

        let selectedDir: CodeDirectory = null;
        if (fto instanceof CodeDirectory) {
            selectedDir = fto.data;
        }
        let model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.AddFile, '', this.directories, selectedDir);
        this.modalService.showModal(model).then((success) => {
            if (success) {

                let newFullPath = (model.selectedDirectory ? model.selectedDirectory.objectFullPath + '/' : '') + model.objectName;

                if (this.isFileExist(newFullPath)) {
                    this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_add_file_at_path', newFullPath ));
                } else {
                    let obj = new CodeFile(newFullPath);
                    this.files.push(obj);
                    this.refreshRootFileTree(obj);
                }

            }
        });
    }

    toolbarAddDirectoryClick(fto: FileTreeObject<any>) {

        let selectedDir: CodeDirectory = null;
        if (fto.data instanceof CodeDirectory) {
            selectedDir = fto.data;
        }
        let model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.AddDirectory, '', this.directories, selectedDir);
        this.modalService.showModal(model).then((success) => {
            if (success) {

                let newFullPath = (model.selectedDirectory ? model.selectedDirectory.objectFullPath + '/' : '') + model.objectName;

                if (this.isDirectoryExist(newFullPath)) {
                    this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_add_directory_at_path', newFullPath ));
                } else {
                    let obj = new CodeDirectory(newFullPath);
                    this.directories.push(obj);
                    this.refreshRootFileTree(obj);
                }

            }
        });
    }

    toolbarMoveClick() {
        if (!this.selectedFto) {
            return;
        }
        if (!this.selectedFto.data) {
            this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_move_base_directory'));
            return;
        }
        let selData = this.selectedFto.data;
        if (selData instanceof CodeFile) {

            if (selData.fixedPath) {
                this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_move_file', selData.objectFullPath) + (selData.library ? this.translate('label_library') : this.translate('label_file')));
                return;
            }

            let model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.MoveFile, selData.objectName, this.directories, null, '/' + selData.objectFullPath);
            this.modalService.showModal(model).then((success) => {
                if (success) {

                    let newFullPath = (model.selectedDirectory ? model.selectedDirectory.objectFullPath + '/' : '') + model.objectName;

                    if (selData.objectFullPath === newFullPath) {
                        return;
                    }

                    if (this.isFileExist(newFullPath)) {
                        this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_move_file_already_exist', newFullPath));
                    } else {
                        selData.objectFullPath = newFullPath;
                        this.refreshRootFileTree();
                    }

                }
            });

        } else if (selData instanceof CodeDirectory) {

            let model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.MoveDirectory, selData.objectName, this.directories, null, '/' + selData.objectFullPath);
            this.modalService.showModal(model).then((success) => {
                if (success) {

                    let newFullPath = (model.selectedDirectory ? model.selectedDirectory.objectFullPath + '/' : '') + model.objectName;

                    if (selData.objectFullPath === newFullPath) {
                        return;
                    }

                    if (this.isDirectoryExist(newFullPath)) {
                        this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_move_directory_at_path' , newFullPath ));
                    } else {
                        let oldFullPathSlash = selData.objectFullPath + '/';
                        let newFullPathSlash = newFullPath + '/';

                        if (newFullPathSlash.indexOf(oldFullPathSlash) === 0) {
                            this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_move_directory_to_childern'));
                            return;
                        }

                        selData.objectFullPath = newFullPath;

                        this.files.forEach((f) => {
                            if (f.objectFullPath.indexOf(oldFullPathSlash) === 0) {
                                f.objectFullPath = newFullPathSlash + f.objectFullPath.substr(oldFullPathSlash.length);
                            }
                        });

                        this.directories.forEach((d) => {
                            if (d.objectFullPath.indexOf(oldFullPathSlash) === 0) {
                                d.objectFullPath = newFullPathSlash + d.objectFullPath.substr(oldFullPathSlash.length);
                            }
                        });

                        this.refreshRootFileTree();
                    }

                }
            });

        }
    }

    toolbarRenameClick(fto: FileTreeObject<any>) {

        if (!fto.data) {
            this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_rename_directory'));
            return;
        }

        let selData = fto.data;
        if (selData instanceof CodeFile) {

            if (selData.fixedPath) {
                this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_rename', selData.objectFullPath) + (selData.library ? this.translate('label_library') : this.translate('label_file')));
                return;
            }

            let model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.RenameFile, selData.objectName, null, null, '/' + selData.objectFullPath);
            this.modalService.showModal(model).then((success) => {
                if (success) {

                    if (model.objectName === selData.objectName) {
                        return;
                    }

                    let newFullPath = (selData.objectPath !== '' ? selData.objectPath + '/' : '') + model.objectName;

                    if (this.isFileExist(newFullPath)) {
                        this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_rename_file_already_exist', newFullPath ));
                    } else {
                        selData.objectFullPath = newFullPath;
                        this.refreshRootFileTree();
                    }

                }
            });
        } else if (selData instanceof CodeDirectory) {

            let model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.RenameDirectory, selData.objectName, null, null, '/' + selData.objectFullPath);
            this.modalService.showModal(model).then((success) => {
                if (success) {

                    if (model.objectName === selData.objectName) {
                        return;
                    }

                    let newFullPath = model.objectName;
                    let i = selData.objectFullPath.lastIndexOf('/');
                    if (i > -1) {
                        newFullPath = selData.objectFullPath.substr(0, i) + '/' + model.objectName;
                    }

                    if (this.isDirectoryExist(newFullPath)) {
                        this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_rename_directory_already_exist', newFullPath ));
                    } else {

                        let oldFullPathSlash = selData.objectFullPath + '/';
                        let newFullPathSlash = newFullPath + '/';

                        selData.objectFullPath = newFullPath;

                        this.files.forEach((f) => {
                            if (f.objectFullPath.indexOf(oldFullPathSlash) === 0) {
                                f.objectFullPath = newFullPathSlash + f.objectFullPath.substr(oldFullPathSlash.length);
                            }
                        });

                        this.directories.forEach((d) => {
                            if (d.objectFullPath.indexOf(oldFullPathSlash) === 0) {
                                d.objectFullPath = newFullPathSlash + d.objectFullPath.substr(oldFullPathSlash.length);
                            }
                        });

                        this.refreshRootFileTree();
                    }

                }
            });

        }
    }

    toolbarRemoveClick(fto: FileTreeObject<any>) {
        if (!fto.data) {
            this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_remove_base_directory'));
            return;
        }
        let selData = fto.data;
        if (selData instanceof CodeFile) {


            if (selData.fixedPath && !selData.library) {
                this.showModalError(this.translate('modal_label_error'), this.translate('modal_label_cant_remove_file', selData.objectFullPath));
                return;
            }

            let model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.RemoveFile, '', null, null, '/' + selData.objectFullPath);
            this.modalService.showModal(model).then((success) => {
                if (success) {

                    this.openFilesCloseTab(<CodeFile>selData);
                    let i = this.files.indexOf(<CodeFile>selData);
                    if (i > -1) {
                        this.files.splice(i, 1);
                    }

                    this.refreshRootFileTree();

                }
            });

        } else if (selData instanceof CodeDirectory) {

            let model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.RemoveDirectory, '', null, null, '/' + selData.objectFullPath);
            this.modalService.showModal(model).then((success) => {
                if (success) {

                    let cd = selData;

                    let deletePath = cd.objectPath + '/';

                    let filesToDelete: CodeFile[] = [];
                    this.files.forEach((f) => {
                        if (f.objectFullPath.indexOf(deletePath) === 0) {
                            filesToDelete.push(f);
                        }
                    });
                    filesToDelete.forEach((f) => {
                        this.openFilesCloseTab(f);
                        let i = this.files.indexOf(f);
                        if (i > -1) {
                            this.files.splice(i, 1);
                        }
                    });

                    let dirsToDelete: CodeDirectory[] = [cd];
                    this.directories.forEach((d) => {
                        if (d.objectFullPath.indexOf(deletePath) === 0) {
                            dirsToDelete.push(d);
                        }
                    });
                    dirsToDelete.forEach((d) => {
                        let i = this.directories.indexOf(d);
                        if (i > -1) {
                            this.directories.splice(i, 1);
                        }
                    });

                    this.refreshRootFileTree();

                }
            });

        }
    }


    onToolBarSaveClick() {
        this.onSaveClick.emit(true);
    }

    onToolBarBuildClick() {
        this.onBuildClick.emit(true);
    }

    show_files_portlet(show: boolean) {
        this._show_files_portlet = show;
    }

    show_libraries_portlet(show: boolean) {
        this._show_libraries_portlet = show;
    }

    show_integrated_hardware_portlet(show: boolean) {
        this._show_integrated_hardware_portlet = show;
    }
    show_blocko_interface_portlet(show: boolean) {
        this._show_blocko_interface_portlet = show;
    }
    show_code_settings_portlet(show: boolean) {
        this._show_code_settings_portlet = show;
    }



}
