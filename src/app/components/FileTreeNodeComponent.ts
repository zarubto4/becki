import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';


export class FileTreeNodeObject<File> {
    name: string;
    path: string[];
    files: File[];
    directories: FileTreeNodeObject<File>[];
    isRoot: boolean = false;

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

    constructor(name: string, path: string[], files: File[], directories: FileTreeNodeObject<File>[]) {
        this.name = name;
        this.path = path;
        this.files = files;
        this.directories = directories;
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
    folderPath: string[];

    @Output()
    fileRemoveClicked = new EventEmitter<File>();

    @Output()
    fileRenameClicked = new EventEmitter<File>();

    @Output()
    fileCreateClicked = new EventEmitter<string>();

    constructor(file: File, folderPath: string[]) {
        this.file = file;
        this.folderPath = folderPath;
    }

    onFileRemoveClicked() {
        this.fileRemoveClicked.emit(this.file);
    }

    onFileRenameClicked() {
        this.fileRenameClicked.emit(this.file);
    }
}
