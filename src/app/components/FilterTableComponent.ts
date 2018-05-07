import { Component, Output, Input, EventEmitter, AfterViewInit, OnInit } from '@angular/core';
import { FormSelectComponentOption } from './FormSelectComponent';

/* tslint:disable: */
@Component({
    selector: 'bk-filter-component',
    template: `

        <!-- Find and Select Program -->
        <div class="filter-option row">
            
            <div class="col-md-3">
                <div class="md-checkbox-list">
                    <div class="md-checkbox">
                        <input type="checkbox" id="checkbox1" class="md-check">
                        <label for="checkbox1">
                            <span class="inc"></span>
                            <span class="check"></span>
                            <span class="box"></span> Option 1 </label>
                    </div>
                    <div class="md-checkbox">
                        <input type="checkbox" id="checkbox2" class="md-check" checked="">
                        <label for="checkbox2">
                            <span></span>
                            <span class="check"></span>
                            <span class="box"></span> Option 2 </label>
                    </div>
                    <div class="md-checkbox">
                        <input type="checkbox" id="checkbox3" class="md-check">
                        <label for="checkbox3">
                            <span class="inc"></span>
                            <span class="check"></span>
                            <span class="box"></span> Option 3 </label>
                    </div>
                    <div class="md-checkbox">
                        <input type="checkbox" id="checkbox4" disabled="" class="md-check">
                        <label for="checkbox4">
                            <span class="inc"></span>
                            <span class="check"></span>
                            <span class="box"></span> Disabled </label>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="md-checkbox-inline">
                    <div class="md-checkbox">
                        <input type="checkbox" id="checkbox33" class="md-check">
                        <label for="checkbox33">
                            <span></span>
                            <span class="check"></span>
                            <span class="box"></span> Option 1 </label>
                    </div>
                    <div class="md-checkbox has-error">
                        <input type="checkbox" id="checkbox34" class="md-check" checked="">
                        <label for="checkbox34">
                            <span class="inc"></span>
                            <span class="check"></span>
                            <span class="box"></span> Option 2 </label>
                    </div>
                    <div class="md-checkbox has-info">
                        <input type="checkbox" id="checkbox35" class="md-check">
                        <label for="checkbox35">
                            <span class="inc"></span>
                            <span class="check"></span>
                            <span class="box"></span> Option 3 </label>
                    </div>
                </div>
            </div>
            
            
            
        </div>
    `
})
/* tslint:enable */

export class FilterTableComponent implements OnInit {

    @Input()
    displayedItems: number = 4;

    @Input()
    items: FormSelectComponentOption[];


    @Output()
    selected = new EventEmitter<FormSelectComponentOption[]>();

    ngOnInit() {

    }

}

