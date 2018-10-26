import { CodeFile } from './CodeIDEComponent';
import { FileTreeNodeObject } from './FileTreeNodeComponent';
import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'bk-file-tree-root',
    template: `
        <div>
            <bk-file-tree-node [folder] = "rootNode">
            </bk-file-tree-node>
        </div>
    `
})

export class FileTreeRootObject implements OnInit, OnChanges {
    
    @Input()
    files: CodeFile[];

    @Output()
    newPathSelected: EventEmitter<string>;

    @Output()
    newFileSelected: EventEmitter<CodeFile>;

    selectedPath: string;

    rootNode: FileTreeNodeObject = new FileTreeNodeObject('', [], []);

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['files']) {
            this.createNodeHierarchy();
        }
    }

    createNodeHierarchy() {
        this.rootNode = new FileTreeNodeObject('', [], []);
        this.files.forEach((file) => {
            this.putFileIntoHierarchy(file, file.objectFullPath.split('/'), this.rootNode);
        });
    }

    putFileIntoHierarchy(file: CodeFile, remainingPath: string[], directory: FileTreeNodeObject) {
        if (remainingPath.length > 1) {
            let nextDirectory = remainingPath[0];
            let foundDirectory = directory.directories.find((node) => { return node.name === nextDirectory; } );
            if (foundDirectory) {
                this.putFileIntoHierarchy(file, remainingPath.slice(1), foundDirectory);
            } else {
                let newDirectory = new FileTreeNodeObject(directory.path + '/' + nextDirectory, [], []);
                directory.directories.push(newDirectory);
                this.putFileIntoHierarchy(file, remainingPath.slice(1), newDirectory);
            }
        } else {
            directory.files.push(file);
        }
    }

    onSelectedPath(path: string) {
        this.selectedPath = path;
        this.newPathSelected.emit(path);
    }


}


