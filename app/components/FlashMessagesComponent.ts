/**
 * Created by davidhradek on 08.08.16.
 */

import {Component, OnInit, OnDestroy, OnChanges} from "@angular/core";
import {FlashMessagesService, FlashMessage} from "../services/FlashMessagesService";

@Component({
    selector: "flash-messages-component",
    directives: [],
    template: `
<div class="alert alert-{{flashMessage.type}} alert-dismissable {{flashMessage.visit()}}" *ngFor="let flashMessage of flashMessagesService.messages">
    <i class="fa fa-{{flashMessage.icon}}"></i>
    <button type="button" class="close" (click)="onCloseClick(flashMessage, $event)"></button>
    <span *ngIf="flashMessage.htmlBody" [innerHTML]="flashMessage.body"></span>
    <span *ngIf="!flashMessage.htmlBody">{{flashMessage.body}}</span>
</div>
`
})
export class FlashMessagesComponent implements OnDestroy {

    constructor(protected flashMessagesService:FlashMessagesService) {}

    onCloseClick(fm:FlashMessage) {
        this.flashMessagesService.removeFlashMessage(fm);
    }

    ngOnDestroy():void {
        this.flashMessagesService.visitStop();
        this.flashMessagesService.flushVisited();
    }

}