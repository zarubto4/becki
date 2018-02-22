/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NotificationService, Notification } from '../services/NotificationService';
import { INotificationElement, INotificationButton } from '../backend/TyrionAPI';

@Component({
    selector: 'bk-filter-page-component',
/* tslint:disable */
    template: `        
    <div class="row">
        
        <div class="col-md-5 col-sm-12">
            <div class="dataTables_info" style="margin-left: 10px" role="status" aria-live="polite">Showing {{from  == 0 ? 1 : from }} to {{to}} of {{total}} entries</div>
        </div>
        
        <div class="col-md-7 col-sm-12">
            <div class="dataTables_paginate paging_bootstrap_number" id="sample_2_paginate">
                <ul class="pagination" style="visibility: visible;">
    
                    
                    <li class="prev" [class.disabled]="selectedPage <= 1"><a title="Prev" (click)="onPageClick(selectedPage-1)"><i class="fa fa-angle-left"></i></a></li>
                    
                    <li *ngFor="let page of pageList" class="mt-element-ribbon bg-grey-steel" [class.active]="selectedPage == page">
                        <a (click)="onPageClick(page)">{{page}}</a>
                    </li>
                    
                    <li  class="next" [class.disabled]="(totalPages + 1) <= selectedPage"><a title="Next" (click)="onPageClick(selectedPage+1)"><i class="fa fa-angle-right"></i></a></li>
                </ul>
            </div>
        </div>
    </div>
`
/* tslint:enable */
})
export class FilterPagerComponent implements OnInit {

    @Input()
    from: number = 1;

    @Input()
    to: number = 25;

    @Input()
    total: number = 25;

    @Input()
    totalPages: number = 0;

    selectedPage: number = 1;

    pageList: number[] = [];

    @Output()
    onSelect: EventEmitter<number> = new EventEmitter<number>();

    constructor(public notificationService: NotificationService) {}

    ngOnInit(): void {

        // Make Array - We are not support ES6 - So we have to used this shit

        let i: number = 1;
        while (this.pageList.push(i++) < this.totalPages + 1) {};
    }

    onPageClick(index: number) {

        if ( (this.totalPages + 2) <= index || index < 1) {
            return;
        }

        this.onSelect.emit(index);
        this.selectedPage = index;
    }

}
