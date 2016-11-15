/**
 * Created by davidhradek on 08.08.16.
 */

import {Component, OnDestroy} from "@angular/core";
import {FlashMessagesService, FlashMessage} from "../services/FlashMessagesService";

@Component({
    selector: "flash-messages-component",
    template: `
<div class="flash-message fm-{{flashMessage.type}} {{flashMessage.visit()}}" *ngFor="let flashMessage of flashMessagesService.messages" [class.open]="flashMessage.open">
    <i class="fm-icon fa fa-{{flashMessage.icon}}"></i>
    <button type="button" class="fm-close" (click)="onCloseClick(flashMessage, $event)"><i class="fa fa-close"></i></button>
    <span class="fm-text" *ngIf="flashMessage.htmlBody" [innerHTML]="flashMessage.body"></span>
    <span class="fm-text" *ngIf="!flashMessage.htmlBody">{{flashMessage.body}}</span>
</div>
`
})
export class FlashMessagesComponent {

    constructor(protected flashMessagesService: FlashMessagesService) {
    }

    onCloseClick(fm: FlashMessage) {
        fm.close();
    }

}