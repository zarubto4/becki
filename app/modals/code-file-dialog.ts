/**
 * Created by davidhradek on 01.09.16.
 */

/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, OnInit} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {BackendService} from "../services/BackendService";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {ModalModel} from "../services/ModalService";
import {CodeDirectory} from "../components/CodeIDE";
import {FileTreeObject, FileTree} from "../components/FileTree";
import {BeckiValidators} from "../helpers/BeckiValidators";


export enum ModalsCodeFileDialogType {
    AddFile = 1,
    AddDirectory,
    MoveFile,
    MoveDirectory,
    RenameFile,
    RenameDirectory,
    RemoveFile,
    RemoveDirectory,
}

export class ModalsCodeFileDialogModel implements ModalModel {
    constructor(public type:ModalsCodeFileDialogType, public objectName:string = "", public directories:CodeDirectory[] = null, public selectedDirectory:CodeDirectory = null, public objectFullName:string = "") {
    }
}

@Component({
    selector: "modals-code-file-dialog",
    templateUrl: "app/modals/code-file-dialog.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput, FileTree]
})
export class ModalsCodeFileDialogComponent implements OnInit {

    @Input()
    modalModel:ModalsCodeFileDialogModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    rootFileTreeObject:FileTreeObject<CodeDirectory>;
    selectedFto:FileTreeObject<CodeDirectory>;

    neededName:boolean = false;
    neededDirectory:boolean = false;

    textTitle:string = "";
    textLabel:string = "";
    textSubmit:string = "Done";
    textCancel:string = "Cancel";

    constructor(private backendService:BackendService, private formBuilder:FormBuilder) {
    }

    ngOnInit() {

        switch (this.modalModel.type) {
            case ModalsCodeFileDialogType.AddFile:
                this.neededName = true;
                this.neededDirectory = true;
                this.textTitle = "Add file";
                this.textLabel = "File name";
                this.textSubmit = "Add";
                break;
            case ModalsCodeFileDialogType.AddDirectory:
                this.neededName = true;
                this.neededDirectory = true;
                this.textTitle = "Add directory";
                this.textLabel = "Directory name";
                this.textSubmit = "Add";
                break;
            case ModalsCodeFileDialogType.MoveFile:
                this.neededName = false;
                this.neededDirectory = true;
                this.textTitle = "Move file <b>"+this.modalModel.objectFullName+"</b>";
                this.textSubmit = "Move";
                break;
            case ModalsCodeFileDialogType.MoveDirectory:
                this.neededName = false;
                this.neededDirectory = true;
                this.textTitle = "Move directory <b>"+this.modalModel.objectFullName+"</b>";
                this.textSubmit = "Move";
                break;
            case ModalsCodeFileDialogType.RenameFile:
                this.neededName = true;
                this.neededDirectory = false;
                this.textTitle = "Rename file <b>"+this.modalModel.objectFullName+"</b>";
                this.textLabel = "File name";
                this.textSubmit = "Rename";
                break;
            case ModalsCodeFileDialogType.RenameDirectory:
                this.neededName = true;
                this.neededDirectory = false;
                this.textTitle = "Rename directory <b>"+this.modalModel.objectFullName+"</b>";
                this.textLabel = "Directory name";
                this.textSubmit = "Rename";
                break;
            case ModalsCodeFileDialogType.RemoveFile:
                this.neededName = false;
                this.neededDirectory = false;
                this.textTitle = "Really want remove file <b>"+this.modalModel.objectFullName+"</b> ?";
                this.textSubmit = "Yes";
                this.textCancel = "No";
                break;
            case ModalsCodeFileDialogType.RemoveDirectory:
                this.neededName = false;
                this.neededDirectory = false;
                this.textTitle = "Really want remove directory <b>"+this.modalModel.objectFullName+"</b> with all children ?";
                this.textSubmit = "Yes";
                this.textCancel = "No";
                break;
        }

        if (this.neededName) {
            this.form = this.formBuilder.group({
                "objectName": [this.modalModel.objectName, [Validators.required, Validators.minLength(1), BeckiValidators.filename]]
            });
        }

        if (this.neededDirectory) {

            var newRootFileTreeObject = new FileTreeObject<CodeDirectory>("/");
            newRootFileTreeObject.children = []; // make directory
            newRootFileTreeObject.color = "#ffc50d";
            newRootFileTreeObject.open = (this.rootFileTreeObject) ? this.rootFileTreeObject.open : true;

            this.selectedFto = newRootFileTreeObject;

            // initialize directories
            this.modalModel.directories.forEach((dir:CodeDirectory) => {
                var parts = dir.objectFullPath.split("/");
                var parentFto = newRootFileTreeObject;
                for (var i = 0; i < parts.length; i++) {
                    var partName = parts[i];
                    var newFto:FileTreeObject<CodeDirectory> = parentFto.childByName(partName, true);
                    if (!newFto) {
                        newFto = new FileTreeObject<CodeDirectory>(partName);
                        newFto.children = []; // make directory
                        parentFto.children.push(newFto);
                    }
                    parentFto = newFto;
                }
                parentFto.data = dir;
                if (this.modalModel.selectedDirectory == dir) {
                    this.selectedFto = parentFto;
                }
            });

            newRootFileTreeObject.sortChildren();
            this.rootFileTreeObject = newRootFileTreeObject;
            this.rootFileTreeObject.select(this.selectedFto);

        }

    }

    selectFto(fto:FileTreeObject<CodeDirectory>) {
        this.selectedFto = fto;
    }

    onSubmitClick():void {
        if (this.neededName) {
            this.modalModel.objectName = this.form.controls["objectName"].value;
        }
        if (this.neededDirectory) {
            if (this.selectedFto) {
                this.modalModel.selectedDirectory = this.selectedFto.data;
            } else {
                this.modalModel.selectedDirectory = null;
            }
        }
        this.modalClose.emit(true);
    }

    onCloseClick():void {
        this.modalClose.emit(false);
    }

    onCancelClick():void {
        this.modalClose.emit(false);
    }
}
