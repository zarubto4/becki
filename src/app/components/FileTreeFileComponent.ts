import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CodeFile, CodeDirectory } from './CodeIDEComponent';
import { Style } from './FileTreeNodeComponent';

@Component({
    selector: 'bk-file-tree-file',
    template: `
    <div  (mouseover) = "onHover(true)" (mouseleave) = "onHover(false)">
        <span tabindex = "-1"
            (click) = "fileSelected.emit(this)"
            role = "button"
            [style.font-weight] = "style.bold ? '800' : 'normal' "
            [style.background-color] = "style.selected ? 'lightblue' : '' " >
            <bk-icon-file-component [icon]="style.icon" [color]="style.iconColor"> </bk-icon-file-component>
            {{name}}
        </span>
        <div *ngIf="showControls && style.showSideIcons" class="pull-right">
            <bk-icon-component [condition]="style.showSideIcons" [icon]="'fa-trash'" (onClickEvent)="fileRemoveClicked.emit(this)"></bk-icon-component>
            <bk-icon-component [condition]="style.showSideIcons" [icon]="'fa-pencil'" (onClickEvent)="fileEditClicked.emit(this)"></bk-icon-component>
        </div>
    </div>
    `
})

export class FileTreeFileComponent implements OnInit {

    @Input()
    file: CodeFile;

    @Input()
    showControls: boolean = false;

    name: string;

    isOpen: boolean = false;
    selected: boolean = false;
    style = new Style();

    @Output()
    fileRemoveClicked = new EventEmitter<FileTreeFileComponent>();

    @Output()
    fileEditClicked = new EventEmitter<FileTreeFileComponent>();

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

    onHover(hover: boolean) {
        this.style.showSideIcons = hover;
    }
}
