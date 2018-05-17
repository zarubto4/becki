import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { FormSelectComponentOption } from './FormSelectComponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';

/* tslint:disable: */
@Component({
    selector: 'bk-filter-component',
    template: `

        <!-- Find and Select Program -->
        <div class="portlet light" style="padding: 0 0 0 0; margin: 0 0 0 0; min-height: 0px !important">
            <div class="portlet-title" style="min-height: 0px !important">
                <div class="caption" style="padding: 0 0 0 0;">
                    <i class="icon-equalizer hide"></i>
                    <span class="caption-subject bold uppercase">Filter </span>
                    <span class="caption-helper">Choose or not to choose, that is the question...</span>
                </div>
                <div class="tools" style="padding-bottom: 5px; padding-top: 5px;">
                    <a [class.collapse]="closed" [class.expand]="!closed"  data-original-title="" title="" (click)="onHide()"> </a>
                    <!-- <a data-toggle="modal" class="config" data-original-title="" title=""> </a> -->
                    <!-- <a href="" class="reload" data-original-title="" title=""> </a> -->
                    <!-- <a href="" class="remove" data-original-title="" title=""> </a> -->
                </div>
            </div>
            <div class="portlet-body" [style.display]="closed ? 'none': 'block'" style="margin-left: 10px; margin-right: 10px">

                <div class="filter-option row" *ngIf="filter_parameters">

                    <div class="col-center col-sm-{{ (12 / filter_parameters.length)}}" *ngFor="let component of filter_parameters; let i = index">

                        <!-- CHECK BOXS LIST-->
                        <div *ngIf="component.type == 'CHECKBOX_LIST'" [class.md-checkbox-list]="!component.content.horizontal" [class.md-checkbox-inline]="component.content.horizontal">
                            <div class="md-checkbox" *ngFor="let option of component.content.options; let j = index">
                                <input type="checkbox" id="{{option.key +'_' + j}}" class="md-check" [(ngModel)]="option.selected" (click)="onCHECKBOXClick(i, j)">
                                <label for="{{option.key + '_' + j}}">

                                    <span class="check"></span>
                                    <span class="box"></span>{{option.label}}</label>
                            </div>
                        </div>

                        <!-- Select One List -->
                        <div *ngIf="component.type === 'LIST_SELECT'">
                            <bk-form-select [control]="component.content.form.controls.list"
                                            [label]="component.content.label"
                                            [options]="component.content.optionForm"
                                            (valueChanged)="onSELECTLISTCHANGEClick($event, component.content.key)"></bk-form-select>

                        </div>


                        <!-- Select Multiple list -->


                        <!-- Write Tags -->
                        <div *ngIf="component.type === 'FIND_BY_TAG'">
                            <bk-form-tag-input [control]="component.content.form.controls.tags"
                                               [label]="'Optional Tags'"
                                               (valueChange)="onSELECT_TAGS_CHANGEClick($event, component.content.key)">
                            </bk-form-tag-input>
                        </div>

                        <!-- Write Name -->
                        <div *ngIf="component.type === 'FIND_BY_TEXT'">
                            <bk-form-input
                                [control]="component.content.form.controls.text"
                                [label]="component.content.label"
                                (valueChange)="onSELECTLISTCHANGEClick($event, component.content.key)">
                            </bk-form-input>
                        </div>

                        <!-- Set Date From To -->

                    </div>

                </div>
            </div>
        </div>


    `
})
/* tslint:enable */
export class FilterTableComponent implements OnInit {

    @Input()
    filter_parameters: Filter_parameter[] = null;

    @Output()
    onChange: EventEmitter<{key: string, value: any}> = new EventEmitter<{key: string, value: any}>();

    @Input()
    closed: boolean = false;


    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {}

    ngOnInit() {

        console.info('filter_parameters: ', this.filter_parameters);
        this.filter_parameters.forEach((parameter) => {

            if (parameter.type === 'LIST_SELECT') {

                (parameter.content as LIST_SELECT).form = this.formBuilder.group({
                    'list': ['', [Validators.required]]
                });

                (parameter.content as LIST_SELECT).optionForm = (parameter.content as LIST_SELECT).options.map((pv) => {
                    return {
                        label: pv.label,
                        value: pv.value
                    };
                });
            }

            if (parameter.type === 'FIND_BY_TEXT') {
                (parameter.content as LIST_SELECT).form = this.formBuilder.group({
                    'text': ['']
                });
            }

            if (parameter.type === 'FIND_BY_TAG') {
                (parameter.content as LIST_SELECT).form = this.formBuilder.group({
                    'tags': ['']
                });
            }

        });


    }

    onHide() {
        console.info('closed: ', this.closed);
        this.closed = !this.closed;
    }


    onCHECKBOXClick(filter_parameter_index: number, content_index: number) {
        setTimeout( () => {
            this.onChange.emit({
                key: (this.filter_parameters[filter_parameter_index].content as CHECKBOX_LIST_Interface).options[content_index].key,
                value: (this.filter_parameters[filter_parameter_index].content as CHECKBOX_LIST_Interface).options[content_index].selected
            });

        }, 50);
    }

    onSELECTLISTCHANGEClick(value: any, key: string) {
        setTimeout( () => {
            this.onChange.emit({
                key: key,
                value: value
            });
        }, 50);
    }


    onSELECT_TAGS_CHANGEClick(tags: string[], key: string) {
        setTimeout( () => {
            this.onChange.emit({
                key: key,
                value: tags
            });
        }, 50);
    }
}
/* tslint:disable */

interface Filter_parameter {
    type: ('CHECKBOX_LIST' | 'LIST_SELECT' | 'FIND_BY_TEXT' | 'FIND_BY_TAG');
    content: (CHECKBOX_LIST_Interface | LIST_SELECT | FIND_BY_TEXT | FIND_BY_TAG);
}

class CHECKBOX_LIST_Interface {
    options: {
        key: string,
        label: string,
        selected: boolean,
        color?: ('info' | 'error')
    }[];

    horizontal?: boolean; // Default is FALSE
}

class FIND_BY_TEXT {
    key: string;       // Type "HW_ID" "HW_NAME...."
    label: string;
    form: FormGroup;
}

class FIND_BY_TAG {
    tags: string[];
    label: string;
    form: FormGroup;
}

class LIST_SELECT {
    options: {
        label: string,
        value: string
    }[] = [];
    label: string;
    key: string;       // List Type "HW_LIST" "CODE_LIST"
    form: FormGroup;
    optionForm: FormSelectComponentOption[] = [];
}


/* tslint:enable  */
