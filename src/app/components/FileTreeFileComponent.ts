import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CodeFile, CodeDirectory } from './CodeIDEComponent';
import { Style } from './FileTreeNodeComponent';
import { FileTreeElement } from './FileTreeRootComponent';

@Component({
    selector: 'bk-file-tree-file',
    template: `
    <div  (mouseover) = "onHover(true)" (mouseleave) = "onHover(false)">
        <span tabindex = "-1"
            (click) = "onClicked()"
            role = "button"
            [style.font-weight] = "style.bold ? '800' : 'normal' "
            [style.background-color] = "style.selected ? 'lightblue' : '' " >
            <bk-icon-file-component [icon]="style.icon" [color]="style.iconColor"> </bk-icon-file-component>
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
    selected: boolean = false;
    style = new Style();

    @Output()
    fileRemoveClicked = new EventEmitter<FileTreeFileComponent>();

    @Output()
    fileRenameClicked = new EventEmitter<FileTreeFileComponent>();

    @Output()
    fileSelected = new EventEmitter<FileTreeFileComponent>();

    ngOnInit(): void {
        this.style.icon = 'fa-file-text';
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

    onClicked() {
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
