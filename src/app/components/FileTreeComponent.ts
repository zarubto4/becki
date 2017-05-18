/**
 * Created by davidhradek on 30.08.16.
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

@Component({
    selector: 'bk-file-tree',
    templateUrl: './FileTreeComponent.html'
})
export class FileTreeComponent {

    @Input()
    fileTreeObject: FileTreeObject<any>;

    @Input()
    last: boolean = true;

    @Input()
    root: boolean = true;

    @Input()
    privateOpen = false;
    _open = true;

    @Input()
    onlyDirectiories = false;

    @Output()
    newSelected = new EventEmitter<FileTreeObject<any>>();

    @Output()
    internalObjClicked = new EventEmitter<FileTreeObject<any>>();

    toggleOpenClick() {
        if (this.privateOpen) {
            this._open = !this._open;
        } else {
            this.fileTreeObject.open = !this.fileTreeObject.open;
        }
    }

    get open(): boolean {
        if (this.privateOpen) {
            return this._open;
        } else {
            return this.fileTreeObject.open;
        }
    }

    internalObjClick(fto: FileTreeObject<any>) {
        this.internalObjClicked.emit(fto);
        this.newSelected.emit(fto);
        if (this.root && this.fileTreeObject) {
            this.fileTreeObject.select(fto);
        }
    }

}
