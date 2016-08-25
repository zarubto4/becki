/**
 * Created by davidhradek on 25.08.16.
 */

/**
 * Created by davidhradek on 23.08.16.
 */

import {
    Component, OnDestroy, OnChanges, AfterViewInit, ElementRef, Input, ViewChild, Output,
    EventEmitter, SimpleChanges
} from "@angular/core";
import {AceEditor} from "./AceEditor";

export class CodeFile {

    filePath:string;
    fileName:string;

    content:string;

    constructor(filePath:string, fileName:string, contnet:string) {
        this.filePath = filePath;
        this.fileName = fileName;
        this.content = contnet;
    }

}


@Component({
    selector: "code-ide",
    templateUrl: "app/components/CodeIDE.html",
    directives: [AceEditor]
})
export class CodeIDE {

    openFilesTabIndex:number = 0;

    openFiles:CodeFile[] = [
        new CodeFile("", "test.txt", "Ahoj"),
        new CodeFile("", "test2.txt", "Bum"),
    ];

    openFilesOpenTab(index:number) {
            this.openFilesTabIndex = index;
    }

    debug_addFile() {
        this.openFiles.push(new CodeFile("", "nextOne", "Testík2"));
    }

    debug_logFiles() {
        console.log(this.openFiles);
    }
}
