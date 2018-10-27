import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CodeFile, CodeDirectory } from './CodeIDEComponent';
import { FileTreeNodeObject } from './FileTreeRootComponent';

@Component({
    selector: 'bk-file-tree-node',
    templateUrl: './FileTreeNodeComponent.html'
})
export class FileTreeNodeComponent  extends Component implements OnInit {
    @Input()
    folder: FileTreeNodeObject;

    isRoot: boolean = false;
    isSelected: boolean = false;
    style: Style = new Style();
    isOpen: boolean = true;
   // selectedPath: string;

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


    ngOnInit(): void {
        this.style.iconColor = '#ffc50d';
        this.refresh();
    }

    onOpenClicked() {
        this.isOpen = !this.isOpen;
        this.refresh();
    }

    onSelected() {
        this.isSelected = !this.isSelected;
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

    refresh() {
        this.style.icon = this.isOpen ? 'folder-open' : 'folder' ;
        this.style.backgroungColor = this.isSelected ? 'blue' : 'white';
    }
}


@Component({
    selector: 'bk-file-tree-file',
    template: `
    <div  (mouseover)="onHover(true)" (mouseleave)="onHover(false)">
        <span tabindex="-1"
            (click)="onSelected()"
            role="button"
            [style.font-weight]="style.bold?'800':'normal'">
            <bk-icon-file-component [name]="name" [icon]="style.icon" [color]="style.iconColor"></bk-icon-file-component>
            {{name}}
        </span>
        <div class="pull-right">
            <bk-icon-component [condition]="style.showSideIcons" [icon]="'fa-trash'" (onClickEvent)="onFileRemoveClicked()"></bk-icon-component>
            <bk-icon-component [condition]="style.showSideIcons" [icon]="'fa-pencil'" (onClickEvent)="onFileRenameClicked()"></bk-icon-component>
        </div>
    </div>
    `
})
export class FileTreeFileComponent extends Comment implements OnInit {

    @Input()
    file: CodeFile;

    name: string;

    isOpen: boolean = false;
    isSelected: boolean = false;
    style = new Style();

    @Output()
    fileRemoveClicked = new EventEmitter<FileTreeFileComponent>();

    @Output()
    fileRenameClicked = new EventEmitter<FileTreeFileComponent>();

    @Output() 
    fileSelected = new EventEmitter<FileTreeFileComponent>();

    ngOnInit(): void {
        this.style.icon = 'file-text';
        this.name = this.file.objectName;
        let separatedName = this.name.split('.');
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

    onHoover(hover: boolean) {
        this.style.showSideIcons = hover;
    }

    onSelected() {
        this.fileSelected.emit(this);
    }

    onFileRemoveClicked() {
        this.fileRemoveClicked.emit(this);
    }

    onFileRenameClicked() {
        this.fileRenameClicked.emit(this);
    }

    onHover(hover: boolean) {
        this.style.showSideIcons = hover;
    }
}

export class Style {
    textColor: string = 'grey';
    backgroungColor: string = 'white';
    icon: string = '';
    iconColor = 'silver';
    bold: boolean = false;
    showSideIcons: boolean = false;
}