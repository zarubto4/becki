import { Component, Output, Input, EventEmitter, AfterViewInit, OnInit } from '@angular/core';
import { FormSelectComponentOption } from './FormSelectComponent';


@Component({
    selector: 'bk-multi-select',
    template: `

        <div class="portlet-title"> 
        </div> 
        <div *ngIf="items">
            <table  class="table table-condensed" style="border-collapse: separate;"> 
                <thead> 
                    <tr> 
                        <th class="col col-lg-1 m-grid-col-left">{{'table_label'|bkTranslate:this}}</th> 
                        <th class="col col-lg-1" *ngFor="let field of additionalFields">{{field|bkTranslate:this}}</th> 
                        </tr> 
                </thead> 
                <tbody *ngFor="let item of items"> 
            
                    <tr class="bk-hover-pick" [class.bg-green-meadow]="selectedItems.indexOf(item) > -1" (click)="itemSelected(item)"> 
                        <td class="vert-align no-wrap"> 
                           {{item.label}}
                        </td> 

                        <td class="vert-align" *ngFor="let field of additionalFields">
                            {{item[field]}}
                        </td> 
                    </tr> 
                </tbody> 
            </table> 
        </div> 
    `
})

export class MultiSelectComponent {

    selectedItems: MultiSelectComponentOption[] = [];

    @Input()
    items: MultiSelectComponentOption[];

    @Input()
    additionalFields: string[] = [];

    @Output()
    selected = new EventEmitter<MultiSelectComponentOption[]>();


    public getAndRemoveSelectedItems(): MultiSelectComponentOption[] {
        let c = this.items.filter(itemToDelete => {
            return this.selectedItems.indexOf(itemToDelete) === -1;
        });

        let send = this.selectedItems;
        this.selectedItems = [];
        this.items = c;

        return send;
    }

    public addItems(items: any[]) {
        items.map(item => this.items.push(item));
    }

    itemSelected(item: MultiSelectComponentOption) {
        let pickedItem = this.selectedItems.indexOf(item);
        if (pickedItem > -1) {
            this.selectedItems.splice(pickedItem, 1);
        } else {
            this.selectedItems.push(item);
        }
        this.selected.emit(this.selectedItems);
    }
}

export interface MultiSelectComponentOption {
    id: string;
    label: string;
}
