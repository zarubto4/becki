/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { TranslationService } from '../services/TranslationService';

@Component({
    selector: 'bk-tag-component',
/* tslint:disable:max-line-length */
    template: `        
        <span class="tag label" 
              (mouseover)="hoover(true)" 
              (mouseleave)="hoover(false)"
              [class.label-info]="tag_color == 'label-info' && !tag_popup_color"
              [class.label-danger]="tag_color == 'label-danger' || tag_popup_color"
              [class.label-warning]="tag_color == 'label-warning' && !tag_popup_color"
              [class.label-primary]="tag_color == 'label-primary' && !tag_popup_color"
              [class.label-success]="tag_color == 'label-success' && !tag_popup_color"
              [class.label-default]="tag_color == 'label-default' && !tag_popup_color"
              [class.fade_animation]="tag_faded == 'label-danger' || tag_popup_color"
        >
            {{tag}} <span data-role="remove"><i *ngIf="!readonly" class="fa fa-times" style="width: 0.6em; text-align: center;" (click)="onRemoveClickEvent()"></i> </span>
        </span>
    `
/* tslint:enable */
})
export class TagComponent implements OnInit {

    // List of Tags Values
    @Input()
    tag: string = null;

    @Input()
    tag_color: ('label-info' | 'label-warning' | 'label-primary' ) = 'label-info';

    @Input()
    tag_popup_color: boolean;

    @Input()
    readonly: boolean = false;

    @Input()
    tag_faded: boolean = false;

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
