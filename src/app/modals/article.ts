/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import {FormSelectComponentOption} from "../components/FormSelectComponent";

export class ModalsArticleModel extends ModalModel {
    constructor(
        public edit: boolean = false,
        public name: string = '',
        public description: string = '',
        public mark_down_text: string = 'Hello word, \nI am root!',
        public tag: string = 'general',
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-article',
    templateUrl: './article.html'
})
export class ModalsArticleComponent implements OnInit {

    @Input()
    modalModel: ModalsArticleModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;
    article_options: FormSelectComponentOption[] = [
        {
          value: 'general',
          label: 'General'
        },
        {
            value: 'hardware',
            label: 'Hardware'
        },
        {
            value: 'code',
            label: 'Code'
        },
        {
            value: 'blocko',
            label: 'Blocko'
        },
        {
            value: 'grid',
            label: 'Grid'
        },
        {
            value: 'cloud',
            label: 'Cloud'
        }
    ];

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {

        this.form = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
            'description': ['', [Validators.maxLength(255)]],
            'tag': ['', []],
            'mark_down_text': ['', [Validators.required]],
        });
    }

    ngOnInit() {
        (<FormControl>(this.form.controls['name'])).setValue(this.modalModel.name);
        (<FormControl>(this.form.controls['description'])).setValue(this.modalModel.description);
        (<FormControl>(this.form.controls['tag'])).setValue(this.modalModel.tag);
        (<FormControl>(this.form.controls['mark_down_text'])).setValue(this.modalModel.mark_down_text);
    }

    onSubmitClick(): void {
        this.modalModel.name = this.form.controls['name'].value;
        this.modalModel.description = this.form.controls['description'].value;
        this.modalModel.tag = this.form.controls['tag'].value;
        this.modalModel.mark_down_text = this.form.controls['mark_down_text'].value;

        // console.info('ModalsArticleComponent: tags:', this.modalModel.tags);
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
