/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { TranslationService } from '../services/TranslationService';

@Component({
    selector: 'bk-tag-component',
/* tslint:disable:max-line-length */
    template: `        
        <span class="tag label label-info" (mouseover)="hoover(true)" (mouseleave)="hoover(false)">
             {{tag}} <span data-role="remove"><i *ngIf="hover && !readonly" class="fa fa-trash" style="width: 0.6em; text-align: center;" (click)="onRemoveClickEvent()"></i> </span>
        </span>
    `
/* tslint:enable */
})
export class TagComponent implements OnInit {

    // List of Tags Values
    @Input()
    tag: string = null;

    @Input()
    readonly: boolean = false;

    private hover: boolean = false;

    @Output()
    onRemoveClick: EventEmitter<string> = new EventEmitter<string>();

    constructor(public validatorErrorsService: ValidatorErrorsService, private formBuilder: FormBuilder, public translationService: TranslationService) {
    }

    hoover(s: boolean) {
        this.hover = s;
    }

    ngOnInit() {
    }

    onRemoveClickEvent() {
        this.onRemoveClick.emit(this.tag);
    }

}
