/**
 * Created by davidhradek on 25.08.16.
 */

/**
 * Created by davidhradek on 23.08.16.
 */

import {
    Component, OnDestroy, OnChanges, AfterViewInit, ElementRef, Input, ViewChild, Output,
    EventEmitter, SimpleChanges
} from "@angular/core";
import {AceEditor} from "./AceEditor";
import {FileTree, FileTreeObject, FileTreeObjectInterface} from "./FileTree";
import {ModalsCodeFileDialogModel, ModalsCodeFileDialogType} from "../modals/code-file-dialog";
import {ModalService} from "../services/ModalService";
import {ModalsConfirmModel} from "../modals/confirm";

export abstract class CodeFileSystemObject implements FileTreeObjectInterface {

    originalObjectFullPath:string;
    objectFullPath:string;

    open: boolean = false;

    constructor(objectFullPath:string) {
        this.originalObjectFullPath = objectFullPath;
        this.objectFullPath = objectFullPath;
    }

    get color():string {
        return this.open?"gray":"silver";
    }

    get bold():boolean {
        return false;
    }

    get changes():boolean {
        return (this.originalObjectFullPath != this.objectFullPath);
    }

    get objectName():string {
        var i = this.objectFullPath.lastIndexOf("/");
        if (i > -1) {
            return this.objectFullPath.substr(i+1);
        }
        return this.objectFullPath;
    }

    get objectPath():string {
        var i = this.objectFullPath.lastIndexOf("/");
        if (i > -1) {
            return this.objectFullPath.substr(0, i);
        }
        return "";
    }

}

export class CodeFile extends CodeFileSystemObject {

    contentOriginal:string;
    content:string;

    constructor(objectFullPath:string, content:string = null) {
        super(objectFullPath);
        if (!content) {
            this.originalObjectFullPath = "";
            this.contentOriginal = "";
            this.content = "";
        } else {
            this.contentOriginal = content;
            this.content = content;
        }
    }

    get extension():string {
        var i = this.objectName.lastIndexOf(".");
        if (i > -1) {
            return this.objectName.substr(i+1);
        }
        return "";
    }

    get color():string {
        var ext = this.extension.toLowerCase();
        if (ext == "cpp") {
            return "#067084";
        } else if (ext == "h") {
            return "#782c1f";
        } else if (ext == "c") {
            return "#013284";
        }
        return "silver";
    }


    get bold():boolean {
        return this.open;
    }

    get changes():boolean {
        return ((this.originalObjectFullPath != this.objectFullPath) || (this.contentOriginal != this.content));
    }

}

export class CodeDirectory extends CodeFileSystemObject {

    get color():string {
        return "#ffc50d";
    }

    // for directory is path = fullPath;
    get objectPath():string {
        return this.objectFullPath;
    }
}

/*
 [
 new CodeFile("ahoj.cpp", "Ahoj.cpp"),
 new CodeFile("zlobi.cpp", "Ahoj zoozoz"),
 new CodeFile("zidle/main.txt", "Ahoj"),
 new CodeFile("main.cpp", "Ahoj"),
 new CodeFile("test.h", "Bum"),
 new CodeFile("test.c", "Bum1"),
 new CodeFile("robot/robot.h", "Bum3"),
 new CodeFile("robot/robot.cpp", "Bum3"),
 new CodeFile("robot/hadr/robot.h", "Bum3"),
 new CodeFile("robot/hadr/františek/dobrota/pako.h", "Bum3"),
 ]
 */

@Component({
    selector: "code-ide",
    templateUrl: "app/components/CodeIDE.html",
    directives: [AceEditor, FileTree]
})
export class CodeIDE implements OnChanges {

    @Input()
    files:CodeFile[] = null;

    directories:CodeDirectory[] = [];

    openFilesTabIndex:number = 0;

    openFiles:CodeFile[] = [];

    rootFileTreeObject:FileTreeObject<CodeFileSystemObject>;

    selectedFto:FileTreeObject<CodeFileSystemObject>;

    constructor(protected modalService:ModalService) {

        this.refreshRootFileTree();

    }

    ngOnChanges(changes:SimpleChanges):void {
        let files = changes["files"];
        if (files) {
            this.files = files.currentValue;
            this.directories = [];
            this.openFiles = [];
            this.openFilesTabIndex = 0;
            this.refreshRootFileTree();
        }
    }

    showModalError(title:string, text:string) {
        this.modalService.showModal(new ModalsConfirmModel(title, text, true, "OK", null));
    }

    generateDirectoriesFromFiles() {
        if (!Array.isArray(this.files)) return;

        this.files.forEach((file) => {
            var path = file.objectPath;

            if (path != "") {

                var parts = path.split("/");

                var fullPath = "";

                for (var i = 0; i < parts.length; i++) {

                    if (fullPath == "") {
                        fullPath += parts[i];
                    } else {
                        fullPath += "/"+parts[i];
                    }

                    var dir:CodeDirectory = null;
                    for (var x = 0; x < this.directories.length; x++) {
                        if (this.directories[x].objectFullPath == fullPath) {
                            dir = this.directories[x];
                        }
                    }
                    if (!dir) {
                        this.directories.push(new CodeDirectory(fullPath));
                    }

                }

            }

        })
    }

    refreshRootFileTree(selectFileObject:CodeFileSystemObject = null) {
        if (!Array.isArray(this.files)) return;

        // generate missing directories in filesystem
        this.generateDirectoriesFromFiles();


        var selectedData:CodeFileSystemObject = selectFileObject;
        if (!selectedData && this.selectedFto && this.selectedFto.data) {
            selectedData = this.selectedFto.data;
        }

        var newRootFileTreeObject = new FileTreeObject<CodeFileSystemObject>("/");
        newRootFileTreeObject.children = []; // make directory
        newRootFileTreeObject.color = "#ffc50d";
        newRootFileTreeObject.open = (this.rootFileTreeObject)?this.rootFileTreeObject.open:true;

        var newSelectFto:FileTreeObject<CodeFileSystemObject> = newRootFileTreeObject;

        // initialize directories
        this.directories.forEach((dir:CodeDirectory) => {

            var parts = dir.objectFullPath.split("/");

            var parentFto = newRootFileTreeObject;

            for (var i = 0; i < parts.length; i++) {

                var partName = parts[i];
                var newFto:FileTreeObject<CodeFileSystemObject> = parentFto.childByName(partName, true);
                if (!newFto) {
                    newFto = new FileTreeObject<CodeFileSystemObject>(partName);
                    newFto.children = []; // make directory
                    parentFto.children.push(newFto);
                }

                parentFto = newFto;

            }

            parentFto.data = dir;
            if (dir == selectedData) {
                newSelectFto = parentFto;
            }

        });

        // initialize files
        this.files.forEach((file:CodeFile) => {

            var parts = file.objectFullPath.split("/");

            var parentFto = newRootFileTreeObject;

            for (var i = 0; i < (parts.length-1); i++) {

                var partName = parts[i];
                var newFto:FileTreeObject<CodeFileSystemObject> = parentFto.childByName(partName, true);
                if (!newFto) {
                    throw "Missing folder "+partName+" in path "+file.objectFullPath;
                }
                parentFto = newFto;

            }

            var fto = new FileTreeObject<CodeFileSystemObject>(parts[(parts.length-1)]);
            fto.data = file;
            parentFto.children.push(fto);

            if (file == selectedData) {
                newSelectFto = fto;
            }

        });

        newRootFileTreeObject.sortChildren();
        this.rootFileTreeObject = newRootFileTreeObject;
        this.selectedFto = newSelectFto;
        this.rootFileTreeObject.select(newSelectFto, true);

    }

    selectFto(fto:FileTreeObject<CodeFileSystemObject>) {
        this.selectedFto = fto;

        if (fto.data && fto.data instanceof CodeFile) {
            var cf = <CodeFile>fto.data;
            if (this.openFiles.indexOf(cf) == -1) {
                this.openFiles.push(cf);
                cf.open = true;
            }
            this.openFilesTabIndex = this.openFiles.indexOf(cf);
        }

    }

    openFilesOpenTab(index:number) {
        this.openFilesTabIndex = index;
    }

    openFilesCloseTab(file:CodeFile) {
        var i = this.openFiles.indexOf(file);
        if (i > -1) {
            this.openFiles.splice(i, 1);
            file.open = false;
            if (this.openFilesTabIndex >= this.openFiles.length) {
                this.openFilesTabIndex = (this.openFiles.length-1);
            }
        }
    }

    isFileExist(fileFullPath:string) {
        if (!Array.isArray(this.files)) return;

        var exist = false;
        this.files.forEach((f)=> {
            if (f.objectFullPath == fileFullPath) {
                exist = true;
            }
        });
        return exist;
    }

    isDirectoryExist(dirFullPath:string) {
        var exist = false;
        this.directories.forEach((f)=> {
            if (f.objectFullPath == dirFullPath) {
                exist = true;
            }
        });
        return exist;
    }

    remove() {

    }

    toolbarAddFileClick() {
        var selectedDir:CodeDirectory = null;
        if (this.selectedFto && this.selectedFto.data instanceof CodeDirectory) {
            selectedDir = this.selectedFto.data;
        }
        var model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.AddFile, "", this.directories, selectedDir);
        this.modalService.showModal(model).then((success) => {
            if (success) {

                var newFullPath = (model.selectedDirectory?model.selectedDirectory.objectFullPath+"/":"")+model.objectName;

                if (this.isFileExist(newFullPath)) {
                    this.showModalError("Error", "Cannot add, file at path <b>/"+newFullPath+"</b> already exist.");
                } else {
                    var obj = new CodeFile(newFullPath);
                    this.files.push(obj);
                    this.refreshRootFileTree(obj);
                }

            }
        });
    }

    toolbarAddDirectoryClick() {
        var selectedDir:CodeDirectory = null;
        if (this.selectedFto && this.selectedFto.data instanceof CodeDirectory) {
            selectedDir = this.selectedFto.data;
        }
        var model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.AddDirectory, "", this.directories, selectedDir);
        this.modalService.showModal(model).then((success) => {
            if (success) {

                var newFullPath = (model.selectedDirectory?model.selectedDirectory.objectFullPath+"/":"")+model.objectName;

                if (this.isDirectoryExist(newFullPath)) {
                    this.showModalError("Error", "Cannot add, directory at path <b>/"+newFullPath+"</b> already exist.");
                } else {
                    var obj = new CodeDirectory(newFullPath)
                    this.directories.push(obj);
                    this.refreshRootFileTree(obj);
                }

            }
        });
    }

    toolbarMoveClick() {
        if (!this.selectedFto) return;
        if (!this.selectedFto.data) {
            this.showModalError("Error", "Cannot move <b>/</b> directory.");
            return;
        }
        var selData = this.selectedFto.data;
        if (selData instanceof CodeFile) {

            var model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.MoveFile, selData.objectName, this.directories, null, "/"+selData.objectFullPath);
            this.modalService.showModal(model).then((success) => {
                if (success) {

                    var newFullPath = (model.selectedDirectory?model.selectedDirectory.objectFullPath+"/":"")+model.objectName;

                    if (selData.objectFullPath == newFullPath) return;

                    if (this.isFileExist(newFullPath)) {
                        this.showModalError("Error", "Cannot move, file at path <b>/"+newFullPath+"</b> already exist.");
                    } else {
                        selData.objectFullPath = newFullPath;
                        this.refreshRootFileTree();
                    }

                }
            });

        } else if (selData instanceof CodeDirectory) {

            var model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.MoveDirectory, selData.objectName, this.directories, null, "/"+selData.objectFullPath);
            this.modalService.showModal(model).then((success) => {
                if (success) {

                    var newFullPath = (model.selectedDirectory?model.selectedDirectory.objectFullPath+"/":"")+model.objectName;

                    if (selData.objectFullPath == newFullPath) return;

                    if (this.isDirectoryExist(newFullPath)) {
                        this.showModalError("Error", "Cannot move, directory at path <b>/"+newFullPath+"</b> already exist.");
                    } else {
                        var oldFullPathSlash = selData.objectFullPath+"/";
                        var newFullPathSlash = newFullPath+"/";

                        if (newFullPathSlash.indexOf(oldFullPathSlash) == 0) {
                            this.showModalError("Error", "Cannot move directory to it's <b>children</b>. ");
                            return
                        }

                        selData.objectFullPath = newFullPath;

                        this.files.forEach((f) => {
                            if (f.objectFullPath.indexOf(oldFullPathSlash) == 0) {
                                f.objectFullPath = newFullPathSlash + f.objectFullPath.substr(oldFullPathSlash.length);
                            }
                        });

                        this.directories.forEach((d) => {
                            if (d.objectFullPath.indexOf(oldFullPathSlash) == 0) {
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
        if (!this.selectedFto) return;
        if (!this.selectedFto.data) {
            this.showModalError("Error", "Cannot rename <b>/</b> directory.");
            return;
        }
        var selData = this.selectedFto.data;
        if (selData instanceof CodeFile) {

            var model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.RenameFile, selData.objectName, null, null, "/"+selData.objectFullPath);
            this.modalService.showModal(model).then((success) => {
                if (success) {

                    if (model.objectName == selData.objectName) return;

                    var newFullPath = (selData.objectPath!=""?selData.objectPath+"/":"")+model.objectName;

                    if (this.isFileExist(newFullPath)) {
                        this.showModalError("Error", "Cannot rename, file at path <b>/"+newFullPath+"</b> already exist.");
                    } else {
                        selData.objectFullPath = newFullPath;
                        this.refreshRootFileTree();
                    }

                }
            });
        } else if (selData instanceof CodeDirectory) {

            var model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.RenameDirectory, selData.objectName, null, null, "/"+selData.objectFullPath);
            this.modalService.showModal(model).then((success) => {
                if (success) {

                    if (model.objectName == selData.objectName) return;

                    var newFullPath = model.objectName;
                    var i = selData.objectFullPath.lastIndexOf("/");
                    if (i > -1) {
                        newFullPath = selData.objectFullPath.substr(0, i)+"/"+model.objectName;
                    }

                    if (this.isDirectoryExist(newFullPath)) {
                        this.showModalError("Error", "Cannot rename, directory at path <b>/"+newFullPath+"</b> already exist.");
                    } else {

                        var oldFullPathSlash = selData.objectFullPath+"/";
                        var newFullPathSlash = newFullPath+"/";

                        selData.objectFullPath = newFullPath;

                        this.files.forEach((f) => {
                            if (f.objectFullPath.indexOf(oldFullPathSlash) == 0) {
                                f.objectFullPath = newFullPathSlash + f.objectFullPath.substr(oldFullPathSlash.length);
                            }
                        });

                        this.directories.forEach((d) => {
                            if (d.objectFullPath.indexOf(oldFullPathSlash) == 0) {
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
        if (!this.selectedFto) return;
        if (!this.selectedFto.data) {
            this.showModalError("Error", "Cannot remove <b>/</b> directory.");
            return;
        }
        var selData = this.selectedFto.data;
        if (selData instanceof CodeFile) {

            var model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.RemoveFile, "", null, null, "/"+selData.objectFullPath);
            this.modalService.showModal(model).then((success) => {
                if (success) {

                    this.openFilesCloseTab(selData);
                    var i = this.files.indexOf(selData);
                    if (i > -1) {
                        this.files.splice(i, 1);
                    }

                    this.refreshRootFileTree();

                }
            });

        } else if (selData instanceof CodeDirectory) {

            var model = new ModalsCodeFileDialogModel(ModalsCodeFileDialogType.RemoveDirectory, "", null, null, "/"+selData.objectFullPath);
            this.modalService.showModal(model).then((success) => {
                if (success) {

                    var cd = selData;

                    var deletePath = cd.objectPath+"/";

                    var filesToDelete:CodeFile[] = [];
                    this.files.forEach((f)=>{
                        if (f.objectFullPath.indexOf(deletePath) == 0) filesToDelete.push(f);
                    });
                    filesToDelete.forEach((f)=>{
                        this.openFilesCloseTab(f);
                        var i = this.files.indexOf(f);
                        if (i > -1) {
                            this.files.splice(i, 1);
                        }
                    });

                    var dirsToDelete:CodeDirectory[] = [cd];
                    this.directories.forEach((d)=>{
                        if (d.objectFullPath.indexOf(deletePath) == 0) dirsToDelete.push(d);
                    });
                    dirsToDelete.forEach((d)=>{
                        var i = this.directories.indexOf(d);
                        if (i > -1) {
                            this.directories.splice(i, 1);
                        }
                    });

                    this.refreshRootFileTree();

                }
            });

        }
    }

    debug_logFiles() {
        console.log(this.files);
    }
}
