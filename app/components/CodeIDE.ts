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
import {FileTree, FileTreeObject} from "./FileTree";

export class CodeFile {

    filePath:string;

    content:string;

    constructor(filePath:string, contnet:string) {
        this.filePath = filePath;
        this.content = contnet;
    }

    get fileName():string {
        var i = this.filePath.lastIndexOf("/");
        if (i > -1) {
            return this.filePath.substr(this.filePath.lastIndexOf("/")+1);
        }
        return this.filePath;
    }


}


@Component({
    selector: "code-ide",
    templateUrl: "app/components/CodeIDE.html",
    directives: [AceEditor, FileTree]
})
export class CodeIDE {

    openFilesTabIndex:number = 0;

    openFiles:CodeFile[] = [
        new CodeFile("main.cpp", "Ahoj"),
        new CodeFile("test.h", "Bum"),
        new CodeFile("test.cpp", "Bum1"),
        new CodeFile("robot/robot.h", "Bum3"),
    ];

    testFiles:FileTreeObject;

    constructor() {


        this.testFiles = new FileTreeObject();
        this.testFiles.name = "Project";

        var f1 = new FileTreeObject();
        f1.name = "david.txt";

        var f2 = new FileTreeObject();
        f2.name = "hradek.txt";

        var f3 = new FileTreeObject();
        f3.name = "roman.txt";

        var f4 = new FileTreeObject();
        f4.name = "petr.txt";

        var f5 = new FileTreeObject();
        f5.name = "Slozka";
        f5.children = [f3, f4];

        var f6 = new FileTreeObject();
        f6.name = "xxx.txt";

        var f7 = new FileTreeObject();
        f7.name = "porn.txt";

        var f8 = new FileTreeObject();
        f8.name = "Slozka22";
        f8.children = [f7, f6];

        this.testFiles.children = [f1, f8, f2, f5];

    }

    openFilesOpenTab(index:number) {
            this.openFilesTabIndex = index;
    }

    openFilesCloseTab(file:CodeFile) {
        var i = this.openFiles.indexOf(file);
        if (i > -1) {
            this.openFiles.splice(i, 1);
            if (this.openFilesTabIndex >= this.openFiles.length) {
                this.openFilesTabIndex = (this.openFiles.length-1);
            }
        }
    }

    debug_addFile() {
        var filename = "nextOne"+Math.random();
        this.openFiles.push(new CodeFile(filename, "Testík2"));

    }

    debug_logFiles() {
        console.log(this.openFiles);
        console.log(this.testFiles);
    }
}
