/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';

export interface IVersionItem {
    id: string;
    name: string;
    description: string;
    state?: boolean;
    delete_permission?: boolean;
    edit_permission?: boolean;
}

export interface IPageObject {
    content: IVersionItem[];
    from: number;
    pages: number[];
    to: number;
    total: number;
}

@Component({
    selector: 'bk-table-list',
    templateUrl: './TableListComponent.html'
})
export class TableListComponent implements OnInit {

    versions: IVersionItem[];


    @Input()
    title: string = 'Title';

    @Input()
    titleIcon: string = 'fa-code-fork';

    @Input()
    additionalFields: string[] = [];

    @Input()
    getData: ((page: number) => Promise<IPageObject>) = null;

    @Output()
    onVersionClick = new EventEmitter<IVersionItem>();

    @Output()
    onRemoveClick = new EventEmitter<IVersionItem>();

    @Output()
    onEditClick = new EventEmitter<IVersionItem>();

    currentPage: number = 1;

    pages: number[] = [];

    constructor() {
    }

    ngOnInit() {
        this.reload();
    }

    reload() {
        this.getData(this.currentPage)
            .then((page) => {
                this.versions = page.content;
                this.pages = page.pages;
            });
    }

    onClick(page: number) {
        this.currentPage = page;
        this.reload();
    }

    onProgramEditClick(item: IVersionItem): void {
        this.onRemoveClick.emit(item);
        this.reload();
    }

    onProgramRemoveClick(item: IVersionItem): void {
        this.onEditClick.emit(item);
        this.reload();
    }

    onProgramClick(item: IVersionItem): void {
        this.onVersionClick.emit(item);
        this.reload();
    }

}
