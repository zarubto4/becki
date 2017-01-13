/**
 * Created by davidhradek on 15.09.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, OnInit, ViewChild} from "@angular/core";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {ModalModel} from "../services/ModalService";
import {Blocks} from "blocko";
import {MonacoEditor} from "../components/MonacoEditor";


export class ModalsBlockoBlockCodeEditorModel extends ModalModel {
    constructor(public block: Blocks.JSBlock|Blocks.TSBlock) {
        super();
        this.modalWide = true;
    }
}

@Component({
    selector: "modals-blocko-block-code-editor",
    templateUrl: "app/modals/blocko-block-code-editor.html"
})
export class ModalsBlockoBlockCodeEditorComponent implements OnInit {

    @Input()
    modalModel: ModalsBlockoBlockCodeEditorModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    code: string;

    error: { name: string, message: string };

    blockForm: FormGroup = null;

    constructor(protected formBuilder: FormBuilder) {
        this.blockForm = this.formBuilder.group({
            "color": ["", [Validators.required]],
            "icon": ["", [Validators.required]],
            "description": [""]
        });
    }

    validate() {
        try {
            if (this.modalModel.block instanceof Blocks.JSBlock) {
                if (Blocks.JSBlock.validateCode(this.code)) {
                    this.error = null;
                } else {
                    this.error = {name: "Error", message: "Unknown error"};
                }
            } else if (this.modalModel.block instanceof Blocks.TSBlock) {
                if (Blocks.TSBlock.validateCode(this.code)) {
                    this.error = null;
                } else {
                    this.error = {name: "Error", message: "Unknown error"};
                }
            }
        } catch (e) {

            var name = e.name || "Error";
            name = name.replace(/([A-Z])/g, ' $1').trim();

            var msg: string = e.message || e.toString();

            if (e instanceof Blocks.JSBlockError) {
                name = "JS Block Error";
                msg = e.htmlMessage;
            } else if (e instanceof Blocks.TSBlockError) {
                name = "TS Block Error";
                msg = e.htmlMessage;
            }

            if (msg.indexOf("is not defined") > -1) {
                var index = msg.indexOf("is not defined");
                msg = "<b>" + msg.substr(0, index) + "</b>" + msg.substr(index);
            }

            if (msg.indexOf("is not a function") > -1) {
                var index = msg.indexOf("is not a function");
                msg = "<b>" + msg.substr(0, index) + "</b>" + msg.substr(index);
            }

            if (msg.indexOf("Unexpected token") == 0) {
                var len = "Unexpected token".length;
                msg = msg.substr(0, len) + "<b>" + msg.substr(len) + "</b>";
            }


            this.error = {name: name, message: msg};
        }
    }

    ngOnInit() {
        this.code = this.modalModel.block.code;
        var data = JSON.parse(this.modalModel.block.designJson);
        this.blockForm.controls["color"].setValue(data["backgroundColor"]);
        this.blockForm.controls["icon"].setValue(data["displayName"]);
        this.blockForm.controls["description"].setValue(data["description"]);
    }

    newCode(code: string) {
        this.code = code;
    }

    onSubmitClick(): void {
        this.validate();
        if (!this.error) {
            var designJson = JSON.stringify({
                backgroundColor: this.blockForm.controls["color"].value,
                displayName: this.blockForm.controls["icon"].value,
                description: this.blockForm.controls["description"].value
            });
            this.modalModel.block.setDesignJson(designJson);
            this.modalModel.block.setCode(this.code);
            if (this.modalModel.block.controller) this.modalModel.block.controller._emitDataChanged();
            this.modalClose.emit(true);
        }
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
