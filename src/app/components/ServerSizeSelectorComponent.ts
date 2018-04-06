import { Component, Input, Output, EventEmitter, OnInit, Injector, ViewEncapsulation } from '@angular/core';
import { IServerRegistrationFormDataServerRegion, IServerRegistrationFormDataServerSize } from '../backend/TyrionAPI';

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
                <div class="row">
                    <div class="col-lg-5 col-md-4" >
                        <img *ngIf="server_region.name.indexOf('New York') !== -1" class="text-center" style="width: auto; height: 70%; box-shadow: 2px 2px 5px grey;" src="http://flags.fmcdn.net/data/flags/h80/us.png">
                        <img *ngIf="server_region.name.indexOf('London') !== -1" class="text-center" style="width: auto; height: 70%; box-shadow: 2px 2px 5px grey;" src="http://flags.fmcdn.net/data/flags/h80/gb.png">
                        <img *ngIf="server_region.name.indexOf('Frankfurt') !== -1" class="text-center" style="width: auto; height: 70%; box-shadow: 2px 2px 5px grey;" src="http://flags.fmcdn.net/data/flags/h80/de.png">
                        <img *ngIf="server_region.name.indexOf('Bangalore') !== -1" class="text-center" style="width: auto; height: 70%; box-shadow: 2px 2px 5px grey;" src="http://flags.fmcdn.net/data/flags/h80/in.png">
                        <img *ngIf="server_region.name.indexOf('Amsterdam') !== -1" class="text-center" style="width: auto; height: 70%; box-shadow: 2px 2px 5px grey;" src="http://flags.fmcdn.net/data/flags/h80/nl.png">
                        <img *ngIf="server_region.name.indexOf('Singapore') !== -1" class="text-center" style="width: auto; height: 70%; box-shadow: 2px 2px 5px grey;" src="http://flags.fmcdn.net/data/flags/h80/sg.png">
                        <img *ngIf="server_region.name.indexOf('San Francisco') !== -1" class="text-center" style="width: auto; height: 70%; box-shadow: 2px 2px 5px grey;" src="http://flags.fmcdn.net/data/flags/h80/us.png">
                        <img *ngIf="server_region.name.indexOf('Toronto') !== -1" class="text-center" style="width: auto; height: 70%; box-shadow: 2px 2px 5px grey;" src="http://flags.fmcdn.net/data/flags/h80/ca.png">
                    </div>
                    <div class="col-lg-7 col-md-8">
                        <h3 class="font-color-byzance-blue" [class.bold]="selected_slug && selected_slug.slug == server_region.slug">
                            {{server_region.name}}
                        </h3>
                        <p class="mt-card-desc font-grey-salsa">
                            <span *ngIf="server_region.name.indexOf('New York') !== -1">United States</span>
                            <span *ngIf="server_region.name.indexOf('San Francisco') !== -1">United States</span>
                            <span *ngIf="server_region.name.indexOf('Singapore') !== -1">Singapore</span>
                            <span *ngIf="server_region.name.indexOf('Frankfurt') !== -1">Germany</span>
                            <span *ngIf="server_region.name.indexOf('Toronto') !== -1">Canada</span>
                            <span *ngIf="server_region.name.indexOf('Amsterdam') !== -1">The Netherlands</span>
                            <span *ngIf="server_region.name.indexOf('Bangalore') !== -1">India</span>
                            <span *ngIf="server_region.name.indexOf('London') !== -1">United Kingdom</span>
                        </p>
                        <p class="mt-card-desc font-grey-salsa"></p>
                    </div>
                </div>
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
