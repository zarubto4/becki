/**
 * Created by davidhradek on 21.11.16.
 */

import {Component, OnDestroy} from "@angular/core";
import {NotificationService, FlashMessage, Notification} from "../services/NotificationService";
import {INotificationElement} from "../backend/TyrionAPI";

@Component({
    selector: "notifications-overlay-component",
    template: `
<div class="notification-holder">
    <div *ngIf="notificationService.highImportanceOverlay" [class.open]="notificationService.highImportanceOverlayOpen" class="notification-overlay"></div>
    <div class="notification {{notification.visit()}}" *ngFor="let notification of notificationService.overlayNotifications" [class.n-high-importance]="notification.highImportance" [class.n-state-open]="notification.opened" [class.n-state-close]="notification.closed">
        <div class="notification-inner n-{{notification.type}}" [class.n-state-over]="notification.overed" (mouseover)="onOver(notification)" (mouseout)="onOut(notification)">
            <i class="n-icon fa fa-{{notification.icon}}"></i>
            <button type="button" class="n-close" (click)="onCloseClick(notification, $event)"><i class="fa fa-close"></i></button>
            <span class="n-text" *ngIf="notification.htmlBody" [innerHTML]="notification.htmlBody"></span>
            <span class="n-text" *ngIf="notification.elementsBody"><template ngFor let-element="$implicit" [ngForOf]="notification.elementsBody"><span *ngIf="element.type == 'text'" [class.n-bold]="element.bold" [class.n-italic]="element.italic" [class.n-underline]="element.underline">{{element.text}}</span><a *ngIf="element.type == 'object'" (click)="onObjectClick(notification, element)" [class.n-bold]="element.bold" [class.n-italic]="element.italic" [class.n-underline]="element.underline">{{element.text}}</a><a *ngIf="element.type == 'link'" [href]="element.url" target="_blank" [class.n-bold]="element.bold" [class.n-italic]="element.italic" [class.n-underline]="element.underline">{{element.text}}</a></template></span>
            <div class="n-progress" [style.width]="notification.closeProgressWidth()"></div>
        </div>
    </div>
</div>
`
})
export class NotificationsOverlayComponent {

    constructor(protected notificationService: NotificationService) {
    }

    onCloseClick(n: Notification) {
        n.close();
    }

    onOver(n: Notification) {
        n.over();
    }

    onOut(n: Notification) {
        n.out();
    }

    onObjectClick(n:Notification, e:INotificationElement) {
        console.log(e);
    }

}