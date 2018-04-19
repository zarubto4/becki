/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ValidatorErrorsService} from '../services/ValidatorErrorsService';
import {TranslationService} from '../services/TranslationService';
import {TagComponent} from "./TagComponent";

@Component({
    selector: 'bk-form-tag-input',
    /* tslint:disable:max-line-length */
    template: `
        <div>
            <div class="form-group"
                 [class.has-success]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)"
                 [class.has-error]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)"
                 [class.has-warning]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)">
                <label *ngIf="showLabel">{{label}}</label>
                <div>
                   <div class="bootstrap-tagsinput">
                       <span *ngFor="let tag of tags; let i = index" [attr.data-index]="i">
                           <span *ngIf=" i <= index_stop" class="tag label label-info" style="margin-right: 3px; padding-right: 3px !important;" >
                                <bk-tag-component [tag]="tag" [readonly]="readonly" (onRemoveClick)="onRemoveClick($event)"></bk-tag-component>
                           </span>
                       </span>
                       <span *ngIf=" 5 > 4">
                           ... 
                       </span>
                    </div>
                </div>
                <div *ngIf="!readonly" style="padding-top: 10px">
                    <bk-form-input (onEnterEvent)="onEnter($event)"
                                   [placeholder]="placeholder!==null ? placeholder:'label_place_holder'|bkTranslate:this"
                                   [control]="private_form.controls.tag_label" [showLabel]="false"
                                   [widthSize]="widthSize"></bk-form-input>
                </div>
            </div>
        </div>
    `
    /* tslint:enable */
})
export class FormInputTagsComponent implements OnInit {

    // List of Tags Values
    @Input()
    control: AbstractControl = null;

    // If we are not using control!!!!
    @Input()
    tags_without_form: string[] = null;

    @Input()
    tag_length_for_read_only_max_size: number = 30;

    // General Label Description
    @Input()
    label: string = 'Unknown label';

    // General PlaceHolder
    @Input()
    placeholder: string = null;

    @Input()
    readonly: boolean = false;

    @Input()
    waitForTouch: boolean = true;

    @Input()
    widthSize: ('small' | 'medium' | 'large' | 'fluid') = 'fluid';  // Fluid - from left to right 100% content

    @Output()
    valueChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    // Private Form for Label Reader & Enter Action
    private_form: FormGroup;

    // List of tags
    private tags: string[] = [];
    private tag_length_for_read_only_max_size_already_counted: number = 0;
    private index_stop: number = null;

    constructor(public validatorErrorsService: ValidatorErrorsService, private formBuilder: FormBuilder, public translationService: TranslationService) {
    }

    ngOnInit() {

        this.private_form = this.formBuilder.group({
            'tag_label': [''],
        });

        if (this.control != null && this.control.value == null) {
            this.control.setValue([]);

        } else {

            //for cyklus s indexami relativne indexu delat  osetrovat te tagy
            this.tags = this.tags_without_form;
        }

        // Not wait for tuch if control.value is not null (for example edit)
        if (this.waitForTouch) {
            if (this.control !== null && this.control.value !== null && this.control.value !== '') {
                this.waitForTouch = false;
            }
        }
    }

    onEnter() {
        let tag: string = this.private_form.controls['tag_label'].value;
        // Ignore empty or illegal values
        if (tag === '' || tag === null) {
            return;
        }

        // Clear Value from Label
        (<FormControl>(this.private_form.controls['tag_label'] )).setValue('');


        // Add Tag to Array if array not contains this Tag

        if (this.tags.indexOf(tag) > -1) {
            return;
        }

        // Set Tags
        this.tags.push(tag);
        this.onChange();
    }

    onRemoveClick(tag: string) {
        for (let i = this.tags.length - 1; i >= 0; i--) {
            if (this.tags[i] === tag) {
                this.tags.splice(i, 1);
                this.onChange();
                break;
            }
        }
    }

    onChange() {
        this.control.setValue(this.tags);
        this.valueChange.emit(this.tags);
    }

    can_write_more(tag?: string): boolean {

        console.info('Type of tag', typeof tag);

        if (typeof tag === 'undefined' && this.tag_length_for_read_only_max_size_already_counted < this.tag_length_for_read_only_max_size) {
            return true;
        } else if(typeof tag === 'undefined'){
            return false;
        }

        console.info('Sum of all chars in one tag:', tag.length);
        console.info('Sum of all chars in ALL tags:', this.tag_length_for_read_only_max_size_already_counted);

        if(this.tag_length_for_read_only_max_size_already_counted > this.tag_length_for_read_only_max_size) {
            return false;
        }

        if (tag != null ) {
            console.info('Podminka pro scitani splnna');
            this.tag_length_for_read_only_max_size_already_counted = this.tag_length_for_read_only_max_size_already_counted  + tag.length;
        }

        console.info('Sum of all chars in ALL tags:', this.tag_length_for_read_only_max_size_already_counted);


        if (this.tag_length_for_read_only_max_size_already_counted < this.tag_length_for_read_only_max_size) {
            return true;
        } else {
            return false;
        }

    }
}
