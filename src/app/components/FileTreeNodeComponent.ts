import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CodeFile, CodeDirectory } from './CodeIDEComponent';

@Component({
    selector: 'bk-file-tree-node',
    template: './FileTreeNodeComponent.html'
})


export class FileTreeNodeComponent  extends Component implements OnInit {
    @Input()
    folder: CodeDirectory;
    
    isRoot: boolean = false;
    isSelected: boolean = false;
    style: Style = new Style();
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

    onFolderRemoveClick(){
        this.folderRemoveClick.emit(this.path.join('/'));
    }

    refresh() {
        this.style.icon = this.isOpen ? 'folder-open' : 'folder' ;
        this.style.backgroungColor = this.isSelected ? 'blue' : 'white';
    }
}


@Component({
    selector: 'bk-file-tree-file',
    template: `
    <div *ngIf="!child.directory" (mouseover)="hoover(child, true)" (mouseleave)="hoover(child, false)">
        <i class=""></i>
        <span tabindex="-1"
            (click)="internalObjClick(child)"
            role="button"
            [style.font-weight]="child.bold?'800':'normal'">
            <bk-icon-file-component [name]="child.name" [icon]="child.icon" [color]="child.color"></bk-icon-file-component>
            {{child.name}}
        </span>
        <div class="pull-right">
            <bk-icon-component [condition]="child && child.show_icons" [icon]="'fa-trash'" (onClickEvent)="onRemoveClick(child)"></bk-icon-component>
            <bk-icon-component [condition]="child && child.show_icons" [icon]="'fa-pencil'" (onClickEvent)="onEditClick(child)"></bk-icon-component>
        </div>
    </div>
    `
})


export class FileTreeFileComponent<File> extends Comment implements OnInit {
    
    @Input()
    file: File;
    
    @Input()
    name: string;
    
    @Input()
    folderPath: string[];
    
    isOpen: boolean = false;
    isSelected: boolean = false;
    style = new Style();

    @Output()
    fileRemoveClicked = new EventEmitter<FileTreeFileComponent<File>>();

    @Output()
    fileRenameClicked = new EventEmitter<FileTreeFileComponent<File>>();

    ngOnInit(): void {
        this.style.icon = 'file-text';

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



    onFileRemoveClicked() {
        this.fileRemoveClicked.emit(this);
    }

    onFileRenameClicked() {
        this.fileRenameClicked.emit(this);
    }
}

export class Style {
    textColor: string = 'grey';
    backgroungColor: string = 'white';
    icon: string = '';
    iconColor = 'silver';
    bold: boolean = false;
}