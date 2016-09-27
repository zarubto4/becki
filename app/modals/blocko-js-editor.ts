/**
 * Created by davidhradek on 15.09.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Input, Output, EventEmitter, Component, OnInit} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {ModalModel} from "../services/ModalService";
import {Blocks} from "blocko";
import {AceEditor} from "../components/AceEditor";


export class ModalsBlockoJsEditorModel extends ModalModel {
    constructor(public jsBlock:Blocks.JSBlock) {
        super();
        this.modalWide = true;
    }
}

@Component({
    selector: "modals-blocko-js-editor",
    templateUrl: "app/modals/blocko-js-editor.html",
    directives: [CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, AceEditor]
})
export class ModalsBlockoJsEditorComponent implements OnInit {

    @Input()
    modalModel:ModalsBlockoJsEditorModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    jsCode:string;

    jsError:{ name:string, message:string };

    constructor() {
    }

    validate() {
        try {
            if (Blocks.JSBlock.validateJsCode(this.jsCode)) {
                this.jsError = null;
            } else {
                this.jsError = { name: "Error", message: "Unknown error" };
            }
        } catch (e) {

            var name = e.name || "Error";
            name = name.replace(/([A-Z])/g, ' $1').trim();

            var msg:string = e.message || e.toString();

            if (e instanceof Blocks.JSBlockError) {
                name = "JS Block Error";
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


            this.jsError = { name: name, message: msg };
        }
    }

    ngOnInit() {
        this.jsCode = this.modalModel.jsBlock.jsCode;
    }

    newJsCode(code:string) {
        this.jsCode = code;
    }

    onSubmitClick():void {
        this.validate();
        if (!this.jsError) {
            this.modalModel.jsBlock.setJsCode(this.jsCode);
            if (this.modalModel.jsBlock.controller) this.modalModel.jsBlock.controller._emitDataChanged();
            this.modalClose.emit(true);
        }
    }

    onCloseClick():void {
        this.modalClose.emit(false);
    }

    onCancelClick():void {
        this.modalClose.emit(false);
    }
}
