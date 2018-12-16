import { CodeFile } from './CodeIDEComponent';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Style } from './FileTreeNodeComponent';

export class FileTreeNodeObject {
    path: string;
    files: CodeFile[] = [];
    directories: FileTreeNodeObject[] = [];
    root: boolean;

    name: string;

    constructor(path: string, root = false) {
        this.path = path;
        this.root = root;
        let slicedPath = this.path.split('/');
        this.name = slicedPath[slicedPath.length - 1];
    }
}

export interface FileTreeElement {
    style: Style;
    path: string;
}

@Component({
    selector: 'bk-file-tree-root',
    template: `
        <div>
            <bk-file-tree-node
            [folder] = "rootNode"
            [showControls]="showControls"
            (elementSelected) = "onElementSelected($event)" >
            </bk-file-tree-node>
        </div>
    `
})

export class FileTreeRootComponent implements OnInit, OnChanges {

    @Input()
    files: CodeFile[];

    @Input()
    showControls = false;

    @Output()
    newPathSelected = new EventEmitter<string>();

    @Output()
    fileAddAtPath = new EventEmitter<string>();

    @Output()
    folderRemoveAtPath = new EventEmitter<string>();

    @Output()
    folderAddAtPath = new EventEmitter<string>();

    @Output()
    folderEditAtPath = new EventEmitter<string>();

    @Output()
    fileEdit = new EventEmitter<CodeFile>();

    @Output()
    fileRemove = new EventEmitter<CodeFile>();

    selectedPath: string;

    rootNode: FileTreeNodeObject = new FileTreeNodeObject('');

    private selectedElement: FileTreeElement;
    justRoot: FileTreeNodeObject;
    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['files']) {
            this.createNodeHierarchy();
        }
    }

    createNodeHierarchy() {
        this.rootNode = new FileTreeNodeObject('extraRoot', true);
        this.justRoot = new FileTreeNodeObject('root');
        this.rootNode.directories.push(this.justRoot);
        this.files.forEach((file) => {
            this.putFileIntoHierarchy(file, file.objectFullPath.split('/'), this.justRoot);
        });
    }

    putFileIntoHierarchy(file: CodeFile, remainingPath: string[], directory: FileTreeNodeObject) {
        if (remainingPath.length > 1) {
            let nextDirectory = remainingPath[0];
            let foundDirectory = directory.directories.find((node) => { return node.name === nextDirectory; } );
            if (foundDirectory) {
                this.putFileIntoHierarchy(file, remainingPath.slice(1), foundDirectory);
            } else {
                let newDirectory = new FileTreeNodeObject(directory.path + '/' + nextDirectory);
                directory.directories.push(newDirectory);
                this.putFileIntoHierarchy(file, remainingPath.slice(1), newDirectory);
            }
        } else {
            directory.files.push(file);
        }
    }

    onElementSelected(element: FileTreeElement) {
        if (this.selectedElement) {
            this.selectedElement.style.selected = false;
        }
        this.selectedElement = element;
        this.selectedPath = element.path;
        this.selectedElement.style.selected = true;
        this.newPathSelected.emit(element.path);
    }
}


