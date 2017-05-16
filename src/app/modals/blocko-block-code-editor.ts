/**
 * Created by davidhradek on 15.09.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit, ViewChild, NgZone } from '@angular/core';
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

    constructor(protected formBuilder: FormBuilder, protected zone: NgZone) {
        this.blockForm = this.formBuilder.group({
            'color': ['', [Validators.required]],
            'icon': ['', [Validators.required]],
            'description': ['']
        });
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
        this.zone.runOutsideAngular(() => {
            let designJson = JSON.stringify({
                backgroundColor: this.blockForm.controls['color'].value,
                displayName: this.blockForm.controls['icon'].value,
                description: this.blockForm.controls['description'].value,
                type_of_block: this.modalModel.block.typeOfBlock,
                blockVersion: null
            });
            this.modalModel.block.setDesignJson(designJson);
            this.modalModel.block.setCode(this.code);
            /*if (this.modalModel.block.controller) {
                this.modalModel.block.controller._emitDataChanged();
            }*/
        });
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
