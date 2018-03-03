import { Component, Input, Output, EventEmitter, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import {IServerRegistrationFormDataServerRegion, IServerRegistrationFormDataServerSize} from '../backend/TyrionAPI';

@Component({
    selector: 'bk-server-size-componet',
    /* tslint:disable */
    template: `
        <div *ngIf="server_size" class="mt-card-item note" [class.byzance-note-selected]="selected_slug && selected_slug.slug == server_size.slug" (click)="onClickBox()">
            <div class="mt-card-content">
                <h3 class="font-color-byzance-blue" [class.bold]="selected_slug && selected_slug.slug == server_size.slug">
                    €{{server_size.price_monthly}}/mo<br>
                    <small>€{{server_size.price_hourly}}/hr</small>
                </h3>
         
                <p class="mt-card-desc font-grey-salsa">{{server_size.memory}} GB / {{server_size.vcpus}} vCPUs</p>
                <p class="mt-card-desc font-grey-salsa"></p>
            </div>
        </div>
    `
    /* tslint:enable */
})
export class ServerSizeSelectorComponent {

    @Input()
    server_size: IServerRegistrationFormDataServerSize = null;

    @Input()
    selected_slug: IServerRegistrationFormDataServerSize = null;

    @Output()
    onClick: EventEmitter<IServerRegistrationFormDataServerSize> = new EventEmitter<IServerRegistrationFormDataServerSize>();

    onClickBox() {
        this.onClick.emit(this.server_size);
    }
}


@Component({
    selector: 'bk-server-region-component',
    /* tslint:disable */
    template: `
        <div *ngIf="server_region" class="mt-card-item note" [class.byzance-note-selected]="selected_slug && selected_slug.slug == server_region.slug" (click)="onClickBox()">
            <div class="mt-card-content">
                <h3 class="font-color-byzance-blue" [class.bold]="selected_slug && selected_slug.slug == server_region.slug">
                    {{server_region.name}}
                </h3>
                <p class="mt-card-desc font-grey-salsa">.....</p>
                <p class="mt-card-desc font-grey-salsa"></p>
            </div>
        </div>
    `
    /* tslint:enable */
})
export class ServerRegionSelectorComponent {

    @Input()
    server_region: IServerRegistrationFormDataServerRegion = null;

    @Input()
    selected_slug: IServerRegistrationFormDataServerRegion = null;

    @Output()
    onClick: EventEmitter<IServerRegistrationFormDataServerRegion> = new EventEmitter<IServerRegistrationFormDataServerRegion>();

    onClickBox() {
        this.onClick.emit(this.server_region);
    }
}
