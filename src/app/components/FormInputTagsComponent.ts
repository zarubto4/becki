/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ValidatorErrorsService }  from '../services/ValidatorErrorsService';
import { TranslationService } from '../services/TranslationService';
import { TyrionBackendService } from '../services/BackendService';
import { IProject } from '../backend/TyrionAPI';

@Component({
    selector: 'bk-form-tag-input',
    /* tslint:disable */
    template: `
        <div>
            <div
                [class.has-success]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && control.valid)"
                [class.has-error]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && !control.pending && !control.valid)"
                [class.has-warning]="!readonly && (((!waitForTouch) || (control.dirty ||control.touched)) && control.pending)">
                <label *ngIf="showLabel">{{label}}</label>
                <div class="bootstrap-tagsinput">
                      <span *ngFor="let tag of existingTags; let i = index" [attr.data-index]="i"
                            style="display: inline-block; margin-bottom: 12px;">
                           <span *ngIf="i <= index_stop || index_stop == null"
                                 style="margin-right: 3px; padding-right: 3px !important;">
                               <bk-single-tag-template-component [tag]="tag"
                                                                 [tag_color]="'label-success'"
                                                                 [tag_popup_color]="tag_popup_selected_tag == tag"
                                                                 [tag_faded]="tag_faded"
                                                                 [readonly]="readonly"
                                                                 (onRemoveClick)="onRemoveClick($event)">
                                </bk-single-tag-template-component> 
                           </span>
                       </span>
                    <span *ngFor="let tag of tags; let i = index" [attr.data-index]="i"
                          style="display: inline-block; margin-bottom: 12px;">
                           <span *ngIf="i <= index_stop || index_stop == null"
                                 style="margin-right: 3px; padding-right: 3px !important; ">
                               <bk-single-tag-template-component [tag]="tag"
                                                                 [tag_color]="'label-info'"
                                                                 [tag_popup_color]="tag_popup_selected_tag == tag"
                                                                 [tag_faded]="tag_faded"
                                                                 [readonly]="readonly"
                                                                 (onRemoveClick)="onRemoveClick($event)">
                                </bk-single-tag-template-component>
                           </span>
                       </span>
                    <span
                        *ngIf="tag_length_for_read_only_max_size_already_counted > tag_length_for_read_only_max_size && readonly">
                           ...
                    </span>
                </div>
                <div *ngIf="!readonly" style="padding-top: 10px;">
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

    @Input()
    existingTags: string[];

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

    shared: string[];

    // List of tags
    private tags: string[] = [];
    private tag_length_for_read_only_max_size_already_counted: number = 0;
    private index_stop: number = null;
    private tag_popup_selected_tag: string = null;
    private tag_faded: boolean = false;

    constructor(public validatorErrorsService: ValidatorErrorsService, private formBuilder: FormBuilder, public translationService: TranslationService, private tyrionBackendService: TyrionBackendService) {
    }

    ngOnInit() {

        this.private_form = this.formBuilder.group({
            'tag_label': [''],
        });

        if (this.control != null) {
            this.control.setValue([]);

        } else if (this.tags != null) {

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

        // Not wait for touch if control.value is not null (for example edit)
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
        if (this.tags.indexOf(tag) > -1 || this.existingTags.indexOf(tag) > -1) {

            this.tag_faded = true;
            this.tag_popup_selected_tag = tag;

            let that = this;
            setTimeout(function () {
                that.tag_popup_selected_tag = '';
                that.tag_faded = false;
            }, 500);

            return;
        }

        // Set Tags
        this.tags.push(tag);
        this.onChange();

    }
    //
    // onRemoveTag(project: IProject): void {
    //     this.blockUI();
    //     this.tyrionBackendService.projectUntag(project.tag)
    //         .then(() => {
    //             this.unblockUI();
    //             this.refresh();
    //         })
    //         .catch(reason => {
    //             this.unblockUI();
    //             this.refresh();
    //         });
    // }

    onRemoveClick(tag: string) {
        for (let i = this.tags.length - 1; i >= 0; i--) {
            if (this.tags[i] === tag) {
                this.tags.splice(i, 1);
                this.onChange();
                break;
            }
        }
        // // TODO: find more pretty way to implement this.
        console.info();
        console.info('onRemoveClick function check my babe girl removing from existingTags ' + '\n\n');
        console.info('Exsting tags array before removing ' + this.existingTags.toString() + '\n\n');
        console.info('Tag to delete    ' + tag.toString());
        for (let j = this.existingTags.length - 1; j >= 0; j--) {
            if (this.existingTags[j] === tag) {
                this.existingTags.splice(j, 1);
                console.info('Existing Tags after removing   ' + this.existingTags.toString() + '\n\n');
                this.onChangeEx();
                break;
            }
        }
    }

    onChange() {
        this.control.setValue(this.tags);
        this.valueChange.emit(this.tags);
    }

    onChangeEx() {
        this.valueChange.emit(this.existingTags);
        console.info('Existing tags in Change function after emitting   ' + this.existingTags.toString() + '\n\n' );
    }
}
