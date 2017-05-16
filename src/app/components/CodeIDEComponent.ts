/**
 * Created by davidhradek on 25.08.16.
 */

import { Component, OnChanges, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FileTreeObject, FileTreeObjectInterface } from './FileTreeComponent';
import { ModalsCodeFileDialogModel, ModalsCodeFileDialogType } from '../modals/code-file-dialog';
import { ModalService } from '../services/ModalService';
import { ModalsConfirmModel } from '../modals/confirm';

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

    annotations: any[];

    constructor(objectFullPath: string, content: string = null) {
        super(objectFullPath);
        if (!content) {
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

    @Output()
    fileContentChange = new EventEmitter<{fileFullPath: string, content: string}>();

    directories: CodeDirectory[] = [];

    openFilesTabIndex: number = 0;

    openFiles: CodeFile[] = [];

    rootFileTreeObject: FileTreeObject<CodeFileSystemObject>;

    selectedFto: FileTreeObject<CodeFileSystemObject>;

    constructor(protected modalService: ModalService) {

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

    showModalError(title: string, text: string) {
        this.modalService.showModal(new ModalsConfirmModel(title, text, true, 'OK', null));
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
                    throw new Error('Missing folder ' + partName + ' in path ' + file.objectFullPath);
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


    toolbarAddFileClick() {
        let selectedDir: CodeDirectory = null;
        if (this.selectedFto && this.selectedFto.data instanceof CodeDirectory) {
            selectedDir = this.selectedFto.data;
        }
        let model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.AddFile, '', this.directories, selectedDir);
        this.modalService.showModal(model).then((success) => {
            if (success) {

                let newFullPath = (model.selectedDirectory ? model.selectedDirectory.objectFullPath + '/' : '') + model.objectName;

                if (this.isFileExist(newFullPath)) {
                    this.showModalError('Error', 'Cannot add, file at path <b>/' + newFullPath + '</b> already exist.');
                } else {
                    let obj = new CodeFile(newFullPath);
                    this.files.push(obj);
                    this.refreshRootFileTree(obj);
                }

            }
        });
    }

    toolbarAddDirectoryClick() {
        let selectedDir: CodeDirectory = null;
        if (this.selectedFto && this.selectedFto.data instanceof CodeDirectory) {
            selectedDir = this.selectedFto.data;
        }
        let model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.AddDirectory, '', this.directories, selectedDir);
        this.modalService.showModal(model).then((success) => {
            if (success) {

                let newFullPath = (model.selectedDirectory ? model.selectedDirectory.objectFullPath + '/' : '') + model.objectName;

                if (this.isDirectoryExist(newFullPath)) {
                    this.showModalError('Error', 'Cannot add, directory at path <b>/' + newFullPath + '</b> already exist.');
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
            this.showModalError('Error', 'Cannot move <b>/</b> directory.');
            return;
        }
        let selData = this.selectedFto.data;
        if (selData instanceof CodeFile) {

            if (selData.fixedPath) {
                this.showModalError('Error', 'Cannot move <b>/' + selData.objectFullPath + '</b> file.');
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
                        this.showModalError('Error', 'Cannot move, file at path <b>/' + newFullPath + '</b> already exist.');
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
                        this.showModalError('Error', 'Cannot move, directory at path <b>/' + newFullPath + '</b> already exist.');
                    } else {
                        let oldFullPathSlash = selData.objectFullPath + '/';
                        let newFullPathSlash = newFullPath + '/';

                        if (newFullPathSlash.indexOf(oldFullPathSlash) === 0) {
                            this.showModalError('Error', 'Cannot move directory to it\'s <b>children</b>. ');
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

    toolbarRenameClick() {
        if (!this.selectedFto) {
            return;
        }
        if (!this.selectedFto.data) {
            this.showModalError('Error', 'Cannot rename <b>/</b> directory.');
            return;
        }
        let selData = this.selectedFto.data;
        if (selData instanceof CodeFile) {

            if (selData.fixedPath) {
                this.showModalError('Error', 'Cannot rename <b>/' + selData.objectFullPath + '</b> file.');
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
                        this.showModalError('Error', 'Cannot rename, file at path <b>/' + newFullPath + '</b> already exist.');
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
                        this.showModalError('Error', 'Cannot rename, directory at path <b>/' + newFullPath + '</b> already exist.');
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

    toolbarRemoveClick() {
        if (!this.selectedFto) {
            return;
        }
        if (!this.selectedFto.data) {
            this.showModalError('Error', 'Cannot remove <b>/</b> directory.');
            return;
        }
        let selData = this.selectedFto.data;
        if (selData instanceof CodeFile) {


            if (selData.fixedPath) {
                this.showModalError('Error', 'Cannot remove <b>/' + selData.objectFullPath + '</b> file.');
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

}
