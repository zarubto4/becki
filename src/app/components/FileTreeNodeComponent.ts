import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';


class FileTreeNodeComponent<File> {
    name: string;
    path: string[];
    files: File[];
    directories: FileTreeNodeComponent<File>[];
    isRoot: boolean = false;
    isSelected: boolean;
    style: Style = new Style();

    @Input()
    isOpen: boolean = false;

    @Output()
    fileCreateClicked = new EventEmitter<string>();

    @Output()
    fileRemoveClicked = new EventEmitter<File>();

    @Output()
    fileEditClick = new EventEmitter<File>();

    @Output()
    folderCreateClicked = new EventEmitter<string>();

    @Output()
    folderRemoveClick = new EventEmitter<string>();

    @Output()
    folderEditClick = new EventEmitter<string>();

    constructor(name: string, path: string[], files: File[], directories: FileTreeNodeComponent<File>[]) {
        this.name = name;
        this.path = path;
        this.files = files;
        this.directories = directories;
        this.style.icon = 'folder';
        this.style.iconColor = '#ffc50d';
    }

    onOpenClicked() {
        this.isOpen = !this.isOpen;
        this.style.icon = this.isOpen ? 'folder-open' : 'folder' ;
    }

    onSelected() {
        this.isSelected = !this.isSelected;
        this.style.backgroungColor = this.isSelected ? 'blue' : 'white';
    }

    onFileCreateClick() {
        this.fileCreateClicked.emit(this.path.join('/'));
    }

    onFileRemoveClick(file: File) {
        this.fileRemoveClicked.emit(file);
    }

    onFileEditClick(file: File) {
        this.fileEditClick.emit(file);
    }

    onFolderAddClick() {
        this.folderCreateClicked.emit(this.path.join('/'));
    }

    onFolderEditClick() {
        this.folderEditClick.emit(this.path.join('/'));
    }

}

export class FileTreeFileComponent<File> {
    file: File;
    name: string;
    folderPath: string[];
    isOpen: boolean;
    isSelected: boolean;
    style = new Style();
    @Output()
    fileRemoveClicked = new EventEmitter<File>();

    @Output()
    fileRenameClicked = new EventEmitter<File>();

    @Output()
    fileCreateClicked = new EventEmitter<string>();

    constructor(file: File, name: string, folderPath: string[]) {
        this.file = file;
        this.folderPath = folderPath;
        this.name = name;
        this.style.icon = 'file-text';

        let separatedName = name.split('.');
        let extension = separatedName[separatedName.length - 1];
        switch (extension) {
            case 'cpp': {
                this.style.iconColor = '#067084';
                break;
            }
            case 'c': {
                this.style.iconColor = '#782c1f';
                break;
            }
            case 'h': {
                this.style.iconColor = '#013284';
                break;
            }
            default: {
                this.style.iconColor = 'silver';
                break;
            }
        }
    }

    onFileRemoveClicked() {
        this.fileRemoveClicked.emit(this.file);
    }

    onFileRenameClicked() {
        this.fileRenameClicked.emit(this.file);
    }
}

export class Style {
    textColor: string = 'grey';
    backgroungColor: string = 'white';
    icon: string = '';
    iconColor = 'silver';
    bold: boolean = false;
}