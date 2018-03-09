/**
 * Created by Alexandr Tylš on 08.03.18.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponent, FormSelectComponentOption } from '../components/FormSelectComponent';

export class ModalsSelectVersionModel extends ModalModel {
    selectedId: string = null;
    options: FormSelectComponentOption[] = [];
    constructor(
        versions = []
    ) {
        super();

        this.options = versions.map((v) => {
            return {
                label: v.name,
                value: v.id
            };
        });
    }
}

@Component({
    selector: 'bk-modals-version-select',
    templateUrl: './version-select.html'
})
export class ModalsVersionSelectComponent implements OnInit {

    @Input()
    modalModel: ModalsSelectVersionModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    @ViewChild(FormSelectComponent)
    selector: FormSelectComponent;

    errorMessage: string = null;

    form: FormGroup;

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            id: ['', [Validators.required]]
        });
    }

    constructor(private formBuilder: FormBuilder) {
    }

    onValueChanged(versionId: string) {
        this.modalModel.selectedId = versionId;
    }

    onSubmitClick(): void {
        if (!this.modalModel.selectedId) {
            this.errorMessage = 'There is no version selected.'; // this.translationService.translate('label_no_version_selected', this);
        } else {
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
