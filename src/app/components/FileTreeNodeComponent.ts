import { FileTreeComponent } from './FileTreeComponent';
import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CodeFile, CodeDirectory } from './CodeIDEComponent';
import { FileTreeNodeObject, FileTreeElement } from './FileTreeRootComponent';
import { FileTreeFileComponent } from './FileTreeFileComponent';

@Component({
    selector: 'bk-file-tree-node',
    template: `<div>
    <div tabindex = "-1"
          (click) = "onClicked()"
          [style.background-color] = "style.selected ? 'lightblue' : '' "
          [style.font-weight] = "style.bold ? '800' : 'normal'"
          (mouseover) = "onHover(true)"
          (mouseleave) = "onHover(false)">

        <!-- Ikonka složky -->
        <bk-icon-file-component [icon]="style.icon" [color]="style.iconColor"></bk-icon-file-component>

        <!-- Název ikonky -->
        {{folder.name}}

        <!-- Ikonky vpravo !-->
        <div *ngIf="showControls && style.showSideIcons" class="pull-right">
            <bk-icon-component [condition]="!folder.root" [icon]="'fa-trash'" (onClickEvent)="folderRemoveClick.emit(this)"></bk-icon-component>
            <bk-icon-component [condition]="!folder.root" [icon]="'fa-pencil'" (onClickEvent)="folderEditClick.emit(this)"></bk-icon-component>
            <bk-icon-component [condition]="true" [icon]="'fa-file'" (onClickEvent)="fileCreateClicked.emit(this)"></bk-icon-component>
            <bk-icon-component [condition]="true" [icon]="'fa-folder'" (onClickEvent)="folderCreateClicked.emit(this)"></bk-icon-component>
        </div>
    </div>
    <div *ngIf="open">
        <div style="padding-left: 20px; list-style-type: none;">
                <div *ngFor="let subFolder of folder.directories">
                        <bk-file-tree-node
                        [folder] = "subFolder"
                        (elementSelected) = "elementSelected.emit($event)"
                        (fileCreateClicked)="fileCreateClicked.emit($event)"
                        (fileRemoveClicked)="fileRemoveClicked.emit($event)"
                        (fileEditClick)="fileEditClick.emit($event)"
                        (folderCreateClicked)="folderCreateClicked.emit($event)"
                        (folderEditClick)="folderEditClick.emit($event)"
                        (folderRemoveClick)="folderRemoveClick.emit($event)">
                        </bk-file-tree-node>
                </div>
                <div *ngFor="let file of folder.files">
                    <bk-file-tree-file
                    [file] = "file"
                    (fileSelected) = "onFileSelectClick($event)"
                    (fileRemoveClicked)="fileRemoveClicked.emit($event)"
                    (fileEditClicked)="fileEditClick.emit($event)">
                    </bk-file-tree-file>
                </div>
        </div>
    </div>
</div>`
})

export class FileTreeNodeComponent  extends Component implements OnInit, FileTreeElement {
    @Input()
    folder: FileTreeNodeObject;

    @Input()
    showControls = false;

    @Output()
    fileCreateClicked = new EventEmitter<FileTreeNodeComponent>();

    @Output()
    fileRemoveClicked = new EventEmitter<FileTreeFileComponent>();

    @Output()
    fileEditClick = new EventEmitter<FileTreeFileComponent>();

    @Output()
    folderCreateClicked = new EventEmitter<FileTreeNodeComponent>();

    @Output()
    folderRemoveClick = new EventEmitter<FileTreeNodeComponent>();

    @Output()
    folderEditClick = new EventEmitter<FileTreeNodeComponent>();

    @Output()
    elementSelected = new EventEmitter<FileTreeElement>();

    root: boolean = false;
    selected: boolean = false;
    style: Style = new Style();
    open: boolean = true;
    path: string = '';

    ngOnInit(): void {
        this.style.iconColor = '#ffc50d';
        this.refresh();
    }

    onClicked() {
        this.open = !this.open;
        this.elementSelected.emit(this);
        this.refresh();
    }

    onHover(hover: boolean) {
        this.style.showSideIcons = hover;
    }

    onFileSelectClick(file: FileTreeFileComponent) {
        this.elementSelected.emit({style: file.style, path: file.file.objectFullPath});
    }

    refresh() {
        this.style.icon = this.open ? 'fa-folder-open' : 'fa-folder' ;
        this.style.backgroungColor = this.selected ? 'blue' : '';
    }
}

export class Style {
    textColor: string = 'grey';
    backgroungColor: string = '';
    icon: string = '';
    iconColor = 'silver';
    bold: boolean = false;
    showSideIcons: boolean = false;
    selected: boolean = false;
}
