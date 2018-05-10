/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface FileTreeObjectInterface {
    color: string;
    icon?: string;
    open: boolean;
    bold: boolean;
    changes: boolean;
}

export class FileTreeObject<T extends FileTreeObjectInterface> {
    name: string = null;
    children: FileTreeObject<T>[] = null;

    data: T = null;

    selected: boolean = false;
    show_icons: boolean = false;

    private _icon: string = null;
    private _color: string = 'silver';

    constructor(name: string, icon: string = null) {
        this.name = name;
        this._icon = icon;
    }

    get icon(): string {
        if (this.data && this.data.icon) {
            return this.data.icon;
        }
        if (this._icon) {
            return this._icon;
        }
        if (this.directory) {
            return 'folder';
        } else {
            return 'file-text';
        }
    }

    get directory(): boolean {
        return Array.isArray(this.children);
    }

    set open(val: boolean) {
        if (this.data) {
            this.data.open = val;
        }
    }

    get open(): boolean {
        if (this.data) {
            return this.data.open;
        }
        return true;
    }

    set color(val: string) {
        this._color = val;
    }

    get color(): string {
        if (this.data) {
            return this.data.color;
        }
        return this._color;
    }

    get bold(): boolean {
        if (this.data) {
            return this.data.bold;
        }
        return false;
    }

    get changes(): boolean {
        if (this.data) {
            return this.data.changes;
        }
        return false;
    }

    public childByName(name: string, directory: boolean): FileTreeObject<T> {
        for (let x = 0; x < this.children.length; x++) {
            if (this.children[x].name === name) {
                if (directory === this.children[x].directory) {
                    return this.children[x];
                }
            }
        }
        return null;
    }

    public sortChildren(directoriesFirst: boolean = true) {
        this.children.sort((a, b) => {
            if (directoriesFirst) {
                if (a.directory && !b.directory) {
                    return -1;
                }
                if (!a.directory && b.directory) {
                    return 1;
                }
            }
            return a.name.localeCompare(b.name);
        });
        this.children.forEach((c) => {
            if (c.directory) {
                c.sortChildren(directoriesFirst);
            }
        });
    }

    public select(fto: FileTreeObject<T>, alsoOpen: boolean = false): boolean {
        let inSelected = false;
        if (this.children) {
            this.children.forEach((f) => {
                if (f.select(fto, alsoOpen)) {
                    inSelected = true;
                }
            });
            if (alsoOpen && inSelected) {
                this.open = true;
            }
        }
        this.selected = (this === fto);
        if (this === fto) {
            inSelected = true;
        }
        return inSelected;
    }
}

/* tslint:disable */
@Component({
    selector: 'bk-file-tree',
    template: `
        <div *ngIf="fileTreeObject">
            
            <!-- Vykresím řádek s hlavičkou  !-->
            <div tabindex="-1"
                  (click)="onCloseList()"
                  [style.font-weight]="fileTreeObject.bold?'800':'normal'"
                  (mouseover)="hoover(fileTreeObject, true)" (mouseleave)="hoover(fileTreeObject, false)">
               
                <!-- Ikonka složky -->
                <bk-icon-file-component [icon]="fileTreeObject.open?'fa-folder':'fa-folder-open'" [color]="fileTreeObject.color"></bk-icon-file-component>
                
                <!-- Název ikonky -->
                {{fileTreeObject.name}}
                
                <!-- Ikonky vpravo !-->
                <div *ngIf="fileTreeObject && fileTreeObject.show_icons" class="pull-right">
                    <bk-icon-component [condition]="!root" [icon]="'fa-trash'" (onClickEvent)="onRemoveClick(fileTreeObject)"></bk-icon-component>
                    <bk-icon-component [condition]="!root" [icon]="'fa-pencil'" (onClickEvent)="onEditClick(fileTreeObject)"></bk-icon-component>
                    <bk-icon-component [condition]="true" [icon]="'fa-file'" (onClickEvent)="onAddFileClick(fileTreeObject)"></bk-icon-component>
                    <bk-icon-component [condition]="true" [icon]="'fa-folder'" (onClickEvent)="onAddFolderClick(fileTreeObject)"></bk-icon-component>
                </div>
            </div>

            
            <!-- Pokud je open !--> 
            <div *ngIf="fileTreeObject.open">
                <div style="padding-left: 20px; list-style-type: none;">
                    <div *ngFor="let child of fileTreeObject.children; let last = last">

                        <!-- Pokud child directory - vykreslím directory !-->
                        <bk-file-tree *ngIf="child.directory" 
                                      [fileTreeObject]="child" 
                                      [last]="last" 
                                      [root]="false" 
                                      (internalObjClicked)="internalObjClick($event)"
                                      (newFolderNewClick)="onAddFolderClick($event)"
                                      (newFileNewClick)="onAddFileClick($event)"
                                      (removeClick)="onEditClick($event)"
                                      (editClick)="toolbarRenameClick($event)"
                                      [onlyDirectiories]="onlyDirectiories">
                        </bk-file-tree>
                        
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
                    </div>
                </div>
            </div>
        </div>
    `,
})
/* tslint:enable */
export class FileTreeComponent {

    @Input()
    fileTreeObject: FileTreeObject<any>;

    @Input()
    last: boolean = true;

    @Input()
    root: boolean = true;

    @Input()
    privateOpen = false;

    @Input()
    onlyDirectiories = false;

    @Output()
    newSelected = new EventEmitter<FileTreeObject<any>>();

    @Output()
    internalObjClicked = new EventEmitter<FileTreeObject<any>>();

    @Output()
    newFolderNewClick = new EventEmitter<FileTreeObject<any>>();

    @Output()
    newFileNewClick = new EventEmitter<FileTreeObject<any>>();

    @Output()
    removeClick = new EventEmitter<FileTreeObject<any>>();

    @Output()
    editClick = new EventEmitter<FileTreeObject<any>>();


    onEditClick(fto: FileTreeObject<any>) {
        this.editClick.emit(fto);
    }

    onRemoveClick(fto: FileTreeObject<any>) {
        this.removeClick.emit(fto);
    }

    onAddFileClick(fto: FileTreeObject<any>) {
        this.newFileNewClick.emit(fto);
    }

    onAddFolderClick(fto: FileTreeObject<any>) {
        this.newFolderNewClick.emit(fto);
    }

    hoover(fileTreeObject: FileTreeObject<any>, show: boolean) {
        fileTreeObject.show_icons = show;
    }

    get open(): boolean {
        return this.fileTreeObject.open;
    }

    onCloseList() {
        this.fileTreeObject.open = !this.fileTreeObject.open;
    }

    internalObjClick(fto: FileTreeObject<any>) {
        this.internalObjClicked.emit(fto);
        this.newSelected.emit(fto);
        if (this.root && this.fileTreeObject) {
            this.fileTreeObject.select(fto);
        }
    }

}


/* tslint:disable */
@Component({
    selector: 'bk-icon-component',
    template: `
        <i *ngIf="condition"  class="fa {{icon}}" (click)="onIconClick()" [class.fa-lg]="_hoover" [class.bold]="_hoover" (mouseover)="hoover(true)" (mouseleave)="hoover(false)"></i>
    `,
})
/* tslint:enable */
export class IconComponent {

    @Input()
    condition = false;

    @Input()
    icon: string = '';

    @Output()
    onClickEvent = new EventEmitter<boolean>();

    _hoover: boolean = false;

    hoover(show: boolean) {
        this._hoover = show;
    }

    onIconClick() {
        this.onClickEvent.emit(true);
    }
}

/* tslint:disable */
@Component({
    selector: 'bk-icon-file-component',
    template: `
        <i *ngIf="icon" class="fa {{icon}}" [style.color]="color"></i>
        <i *ngIf="name" class="fa {{icon}}" [style.color]="color"></i>
    `,
})
/* tslint:enable */
export class IconFileComponent {

    @Input()
    color: string;

    @Input()
    icon: string = null;

    @Input()
    name: string = ''; // File Parser by last file type after dot for Exampme .cpp  .tp .md

    @Input()
    file_name: string = '';

    get_name_icon_type(): string {
        // console.log('FileType: ', name);
        return null;
    }

}
