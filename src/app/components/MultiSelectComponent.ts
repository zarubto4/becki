import { Component, Output, Input, EventEmitter, OnInit }  from '@angular/core';
import { FormSelectComponentOption } from './FormSelectComponent';

/* tslint:disable: */
@Component({
    selector: 'bk-multi-select',
    template: `

        <div class="bk-table-scrollable" [style.max-height]="tabHeight" *ngIf="items">
            <label *ngIf="labelComment" [innerHTML]="label"></label>
            <table class="table" style="border-collapse: separate;">
                <thead>
                <tr>
                    <th class="col col-lg-1" *ngFor="let field of additionalFields">{{field}}</th>
                </tr>
                </thead>
                <tbody *ngFor="let item of items">
                <tr class="bk-hover-pick" [class.bg-green-meadow]="selectedItems.indexOf(item) > -1"
                    (click)="itemSelected(item)">
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
/* tslint:enable */

export class MultiSelectComponent implements OnInit {

    selectedItems: FormSelectComponentOption[] = [];

    tabHeight: string = '300px';

    @Input()
    displayedItems: number = 4;

    @Input()
    label: string = 'Unknown label';

    @Input()
    labelComment: boolean = true;

    @Input()
    items: FormSelectComponentOption[];

    @Input()
    additionalFields: string[] = [];

    @Output()
    selected = new EventEmitter<FormSelectComponentOption[]>();

    ngOnInit() {
        this.tabHeight = this.displayedItems * 36 + 'px';
    }

    public getAndRemoveSelectedItems(): FormSelectComponentOption[] {
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

    itemSelected(item: FormSelectComponentOption) {
        let pickedItem = this.selectedItems.indexOf(item);
        if (pickedItem > -1) {
            this.selectedItems.splice(pickedItem, 1);
        } else {
            this.selectedItems.push(item);
        }
        this.selected.emit(this.selectedItems);
    }

}

