/**
 * Created by davidhradek on 15.09.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalModel } from '../services/ModalService';
import { Blocks } from 'blocko';
import { MonacoEditorComponent } from '../components/MonacoEditorComponent';


export class ModalsBlockoBlockCodeEditorModel extends ModalModel {
    constructor(public block: Blocks.TSBlock) {
        super();
        this.modalWide = true;
    }
}

@Component({
    selector: 'bk-modals-blocko-block-code-editor',
    templateUrl: './blocko-block-code-editor.html'
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
            'color': ['', [Validators.required]],
            'icon': ['', [Validators.required]],
            'description': ['']
        });
    }

    validate() {

        /*

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

         */
    }

    ngOnInit() {
        this.code = this.modalModel.block.code;
        let data = JSON.parse(this.modalModel.block.designJson);
        this.blockForm.controls['color'].setValue(data['backgroundColor']);
        this.blockForm.controls['icon'].setValue(data['displayName']);
        this.blockForm.controls['description'].setValue(data['description']);
    }

    newCode(code: string) {
        this.code = code;
    }

    onSubmitClick(): void {
        this.validate();
        if (!this.error) {
            let designJson = JSON.stringify({
                backgroundColor: this.blockForm.controls['color'].value,
                displayName: this.blockForm.controls['icon'].value,
                description: this.blockForm.controls['description'].value
            });
            this.modalModel.block.setDesignJson(designJson);
            this.modalModel.block.setCode(this.code);
            /*if (this.modalModel.block.controller) {
                this.modalModel.block.controller._emitDataChanged();
            }*/
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
