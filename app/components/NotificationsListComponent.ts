/**
 * Created by davidhradek on 24.11.16.
 */

import {Component, OnDestroy, Input} from "@angular/core";
import {NotificationService, FlashMessage, Notification} from "../services/NotificationService";
import {INotificationElement, INotificationButton} from "../backend/TyrionAPI";

@Component({
    selector: "notifications-list-component",
    template: `
<ul class="notification-list {{classes}}">
    <li *ngFor="let notification of notificationService[listName]" class="notification n-{{notification.type}}" [class.n-unread]="!notification.wasRead">
        <i class="n-icon fa fa-{{notification.icon}}"></i>
        <span class="n-text" *ngIf="notification.htmlBody" [innerHTML]="notification.htmlBody"></span>
        <span class="n-text" *ngIf="notification.elementsBody"><template ngFor let-element="$implicit" [ngForOf]="notification.elementsBody"><span *ngIf="element.type == 'text'" [class.n-bold]="element.bold" [class.n-italic]="element.italic" [class.n-underline]="element.underline">{{element.text}}</span><a *ngIf="element.type == 'object'" (click)="onObjectClick(notification, element)" [class.n-bold]="element.bold" [class.n-italic]="element.italic" [class.n-underline]="element.underline">{{element.text}}</a><a *ngIf="element.type == 'link'" [href]="element.url" target="_blank" [class.n-bold]="element.bold" [class.n-italic]="element.italic" [class.n-underline]="element.underline">{{element.text}}</a></template></span>
        <span class="n-time">{{notification.relativeTime}}</span>
        <div class="n-buttons" *ngIf="notification.buttons && notification.buttons.length" [class.n-unconfirmed]="!notification.confirmed">
            <button *ngFor="let button of notification.buttons" class="btn btn-sm {{button.color}}" (click)="onButtonClick(notification, button)" [disabled]="notification.confirmed" [class.n-bold]="button.bold" [class.n-italic]="button.italic" [class.n-underline]="button.underline">{{button.text}}</button>
        </div>
        <div class="clearfix"></div>
    </li>
    <li *ngIf="notificationService[listName].length == 0" class="no-notifications"> No notifications </li>
</ul>
`
})
export class NotificationsListComponent {

    @Input("class")
    protected classes:string = "";

    @Input()
    protected listName:string = "notifications";

    constructor(protected notificationService: NotificationService) {
    }

    onObjectClick(n:Notification, e:INotificationElement) {
        this.notificationService.onObjectClick(n, e);
    }

    onButtonClick(n:Notification, b:INotificationButton) {
        this.notificationService.onButtonClick(n, b);
    }

}