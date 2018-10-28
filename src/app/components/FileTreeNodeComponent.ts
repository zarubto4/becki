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
        <div *ngIf="style.showSideIcons" class="pull-right">
            <bk-icon-component [condition]="!root" [icon]="'fa-trash'" (onClickEvent)="onFolderRemoveClick()"></bk-icon-component>
            <bk-icon-component [condition]="!root" [icon]="'fa-pencil'" (onClickEvent)="onFolderEditClick()"></bk-icon-component>
            <bk-icon-component [condition]="true" [icon]="'fa-file'" (onClickEvent)="onFileCreateClick()"></bk-icon-component>
            <bk-icon-component [condition]="true" [icon]="'fa-folder'" (onClickEvent)="onFolderAddClick()"></bk-icon-component>
        </div>
    </div>
    <div *ngIf="open">
        <div style="padding-left: 20px; list-style-type: none;">
                <div *ngFor="let subFolder of folder.directories">
                        <bk-file-tree-node
                        [folder] = "subFolder">
                        (elementSelected) = "elementSelected.emit($event)"
                        </bk-file-tree-node>
                </div>
                <div *ngFor="let file of folder.files">
                    <bk-file-tree-file
                    [file] = "file"
                    (fileSelected) = "onFileSelectClick($event)">
                    </bk-file-tree-file>
                </div>
        </div>
    </div>
</div>`
})

export class FileTreeNodeComponent  extends Component implements OnInit, FileTreeElement {
    @Input()
    folder: FileTreeNodeObject;

    root: boolean = false;
    selected: boolean = false;
    style: Style = new Style();
    open: boolean = true;
    path: string = '';

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

    ngOnInit(): void {
        this.style.iconColor = '#ffc50d';
        this.refresh();
    }

    onClicked() {
        this.open = !this.open;
        this.elementSelected.emit(this);
        this.refresh();
    }

    onFileCreateClick() {
        this.fileCreateClicked.emit(this);
    }

    onFileRemoveClick(component: FileTreeFileComponent) {
        this.fileRemoveClicked.emit(component);
    }

    onFileEditClick(component: FileTreeFileComponent) {
        this.fileEditClick.emit(component);
    }

    onFolderAddClick() {
        this.folderCreateClicked.emit(this);
    }

    onFolderEditClick() {
        this.folderEditClick.emit(this);
    }

    onFolderRemoveClick(){
        this.folderRemoveClick.emit(this);
    }

    onHover(hover: boolean) {
        this.style.showSideIcons = hover;
    }

    onFileSelectClick(file: FileTreeFileComponent) {
        this.elementSelected.emit({style: file.style, path: file.file.objectFullPath});
    }

    refresh() {
        this.style.icon = this.open ? 'fa-folder-open' : 'fa-folder' ;
        this.style.backgroungColor = this.selected ? 'blue' : 'white';
    }
}

export class Style {
    textColor: string = 'grey';
    backgroungColor: string = 'white';
    icon: string = '';
    iconColor = 'silver';
    bold: boolean = false;
    showSideIcons: boolean = false;
    selected: boolean = false;
}
