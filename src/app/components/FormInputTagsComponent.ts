/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ValidatorErrorsService} from '../services/ValidatorErrorsService';
import {TranslationService} from '../services/TranslationService';
import {TagComponent} from "./TagComponent";
import {red} from "chalk";

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
                           <span *ngIf="i <= index_stop || index_stop == null" style="margin-right: 3px; padding-right: 3px !important;">
                                
                               <bk-tag-component [tag]="tag" 
                                                 [tag_color]="'label-info'"
                                                 [tag_popup_color]="tag_popup_selected_tag == tag"
                                                 [tag_faded]="tag_faded"
                                                 [readonly]="readonly"
                                                 (onRemoveClick)="onRemoveClick($event)">
                                </bk-tag-component>
                               
                           </span>
                       </span>
                        <span *ngIf="tag_length_for_read_only_max_size_already_counted > tag_length_for_read_only_max_size && readonly">
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

    @ViewChildren(TagComponent)
    tagComponents: QueryList<TagComponent>

    // List of tags
    private tags: string[] = [];
    private tag_length_for_read_only_max_size_already_counted: number = 0;
    private index_stop: number = null;
    private tag_popup_selected_tag: string = null;
    private tag_faded: boolean = false;

    constructor(public validatorErrorsService: ValidatorErrorsService, private formBuilder: FormBuilder, public translationService: TranslationService) {
    }

    ngOnInit() {

        this.private_form = this.formBuilder.group({
            'tag_label': [''],
        });

        if (this.control != null) {
            this.control.setValue([]);

        } else if(this.tags != null){

            this.tags = this.tags_without_form;

            for (let i = 0; i < this.tags.length; i++) {


                if (this.tags[i] !== null && !(this.tags[i] === 'undefined')) {


                    this.tag_length_for_read_only_max_size_already_counted = this.tag_length_for_read_only_max_size_already_counted + this.tags[i].length;

                    // console.info('Already counted: ', this.tag_length_for_read_only_max_size_already_counted);

                    if (this.tag_length_for_read_only_max_size_already_counted > this.tag_length_for_read_only_max_size) {
                        this.index_stop = i;

                        break;

                    }
                }
            }

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

            let temp = this.tagComponents.find((com) => {
                return com.tag === tag
            })

            if (temp) {
                temp.tag_faded = true;

                setTimeout(() => {
                    this.tag_popup_selected_tag = '';
                    temp.tag_faded = false;
                }, 500);
            }

            this.tag_popup_selected_tag = tag;
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

}
