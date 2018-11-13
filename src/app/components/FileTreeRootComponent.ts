import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FileTreeNodeObject } from './FileTreeNodeComponent';


interface FileWIthPath {
    path: string;
}

@Component({
    selector: 'bk-file-tree-root',
    template: './FileTreeRootComponent.html'
})

export class FileTreeRootObjectComponent <File extends FileWIthPath > implements OnInit, OnChanges {

    @Input()
    files: File[];

    @Output()
    selectedDirectoryPath: string = null;

    @Output()
    selectedFile: File = null;

    @Output()
    newPathSelected: EventEmitter<string>;

    @Output()
    newFileSelected: EventEmitter<File>;

    rootNode: FileTreeNodeObject<File> = null;

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['files']) {
            this.createNodeHierarchy();
        }
    }

    createNodeHierarchy() {
        this.rootNode = new FileTreeNodeObject<File>('', [], [], []);
        this.files.forEach((file) => {
            this.putFileIntoHierarchy(file, file.path.split('/'), this.rootNode);
        });
    }

    putFileIntoHierarchy(file: File, remainingPath: string[], directory: FileTreeNodeObject<File>) {
        if (remainingPath.length > 1) {
            let nextDirectory = remainingPath[0];
            let foundDirectory = directory.directories.find((node) => { return node.name === nextDirectory; } );
            if (foundDirectory) {
                this.putFileIntoHierarchy(file, remainingPath.slice(1), foundDirectory);
            } else {
                let newDirectory = new FileTreeNodeObject(nextDirectory, [directory.path.toString() , nextDirectory.toString()], [], []);
                directory.directories.push(newDirectory);
                this.putFileIntoHierarchy(file, remainingPath.slice(1), newDirectory);
            }
        } else {
            directory.files.push(file);
        }
    }

    onSelectedFile(file: File) {
        this.selectedFile = file;
        this.newFileSelected.emit(file);
    }


}


