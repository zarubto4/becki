/**
 * Created by davidhradek on 30.08.16.
 */
/**
 * Created by davidhradek on 23.08.16.
 */

import {
    Component, OnDestroy, OnChanges, AfterViewInit, ElementRef, Input, ViewChild, Output,
    EventEmitter, SimpleChanges, DoCheck, AfterContentChecked, ChangeDetectionStrategy, forwardRef
} from "@angular/core";

export class FileTreeObject {
    name:string = "";
    icon:string = "";
    children:FileTreeObject[] = null;

    get directory():boolean {
        return Array.isArray(this.children);
    }
}

@Component({
    selector: "file-tree",
    templateUrl: "app/components/FileTree.html",
    directives: [forwardRef(function() { return FileTree; })]
})
export class FileTree {

    open:boolean = false;

    @Input()
    fileTreeObject:FileTreeObject;

    @Input()
    last:boolean = true;

    @Input()
    root:boolean = true;

    toggleOpenClick() {
        this.open = !this.open;
    }

}
