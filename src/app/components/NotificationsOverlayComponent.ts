/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component } from '@angular/core';
import { NotificationService, Notification } from '../services/NotificationService';
import { INotificationElement, INotificationButton } from '../backend/TyrionAPI';

@Component({
    selector: 'bk-notifications-overlay',
/* tslint:disable:max-line-length */
    template: `
<div class="notification-holder">
    <div *ngIf="notificationService.highImportanceOverlay" [class.open]="notificationService.highImportanceOverlayOpen" class="notification-overlay"></div>
    <div class="notification {{notification.visit()}}" *ngFor="let notification of notificationService.overlayNotifications" [class.n-high-importance]="notification.highImportance" [class.n-state-open]="notification.opened" [class.n-state-close]="notification.closed">
        <div class="notification-inner n-{{notification.type}}" [class.n-state-over]="notification.overed" (mouseover)="onOver(notification)" (mouseout)="onOut(notification)">
            <i class="n-icon fa fa-{{notification.icon}}"></i>
            <button *ngIf="!notification.highImportance || !(notification.buttons && notification.buttons.length)" type="button" class="n-close" (click)="onCloseClick(notification, $event)"><i class="fa fa-close"></i></button>
            
            <span class="n-text" *ngIf="notification.htmlBody" [innerHTML]="notification.htmlBody"></span>
            
            <!-- Notification Parser-->
            <span class="n-text" *ngIf="notification.elementsBody">
                <template ngFor let-element="$implicit" [ngForOf]="notification.elementsBody">
                    <span *ngIf="element.type == 'TEXT'" [class.n-bold]="element.bold" [class.n-italic]="element.italic" [class.n-underline]="element.underline">{{element.text}}</span>
                    <span *ngIf="element.type == 'DATE'" [class.n-bold]="element.bold" [class.n-italic]="element.italic" [class.n-underline]="element.underline">{{element.text|bkUnixTimeToDate}}</span>
                    <a *ngIf="element.type == 'OBJECT'" (click)="onObjectClick(notification, element)" [class.n-bold]="element.bold" [class.n-italic]="element.italic" [class.n-underline]="element.underline">{{element.text}}</a>
                    <br *ngIf="element.type == 'NEWLINE'"><br *ngIf="element.type == 'newLine'"> <!-- It is intentionally written twice - First for new line, second for new empty line-->
                    <a *ngIf="element.type == 'LINK'" [href]="element.url" target="_blank" [class.n-bold]="element.bold" [class.n-italic]="element.italic" [class.n-underline]="element.underline">{{element.text}}</a>
                </template>
            </span>
            
            <div class="n-buttons" *ngIf="notification.buttons && notification.buttons.length">
                <button *ngFor="let button of notification.buttons" class="btn btn-sm {{button.color}}" (click)="onButtonClick(notification, button)" [disabled]="notification.confirmed" [class.n-bold]="button.bold" [class.n-italic]="button.italic" [class.n-underline]="button.underline">{{button.text}}</button>
            </div>
            <div class="n-progress" [style.width]="notification.closeProgressWidth()"></div>
        </div>
    </div>
</div>
`
/* tslint:enable */
})
export class NotificationsOverlayComponent {

    constructor(public notificationService: NotificationService) {
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

    onObjectClick(n: Notification, e: INotificationElement) {
        this.notificationService.onObjectClick(n, e);
    }

    onButtonClick(n: Notification, b: INotificationButton) {
        this.notificationService.onButtonClick(n, b);
    }

}
