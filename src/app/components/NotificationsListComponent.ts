/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Input } from '@angular/core';
import { NotificationService, Notification } from '../services/NotificationService';
import { INotificationElement, INotificationButton } from '../backend/TyrionAPI';

@Component({
    selector: 'bk-notifications-list',
    /* tslint:disable:max-line-length */
    template: `
        <ul class="notification-list {{classes}}">
            <li *ngFor="let notification of notificationService[listName]" class="notification n-{{notification.type}}"
                [class.n-unread]="!notification.wasRead">
                <i class="n-icon fa fa-{{notification.icon}}"></i>
                <span class="n-text" *ngIf="notification.htmlBody" [innerHTML]="notification.htmlBody"></span>


                <!-- Notification Parser-->
                <span class="n-text" *ngIf="notification.elementsBody">
            <template ngFor let-element="$implicit" [ngForOf]="notification.elementsBody">
                <span *ngIf="element.type == 'TEXT'" [class.n-bold]="element.bold" [class.n-italic]="element.italic"
                      [class.n-underline]="element.underline">{{element.text}}</span>
                <span *ngIf="element.type == 'DATE'" [class.n-bold]="element.bold" [class.n-italic]="element.italic"
                      [class.n-underline]="element.underline">{{element.text | bkUnixTimeToDate}}</span>
                <br *ngIf="element.type == 'NEWLINE'"><br *ngIf="element.type == 'newLine'">
                <!-- It is intentionally written twice - First for new line, second for new empty line-->
                <a *ngIf="element.type == 'OBJECT'" (click)="onObjectClick(notification, element)"
                   [class.n-bold]="element.bold" [class.n-italic]="element.italic"
                   [class.n-underline]="element.underline">{{element.text}}</a>
                <a *ngIf="element.type == 'LINK'" [href]="element.url" target="_blank" [class.n-bold]="element.bold"
                   [class.n-italic]="element.italic" [class.n-underline]="element.underline">{{element.text}}</a>
            </template>
        </span>


                <span class="n-time">
            {{notification.relativeTime}} <a class="btn btn-icon-only btn-small" (click)="onDeleteClick(notification)"> <i
                    class="icon-trash"></i></a>
        </span>
                <div class="n-buttons" *ngIf="notification.buttons && notification.buttons.length"
                     [class.n-unconfirmed]="!notification.confirmed">
                    <button *ngFor="let button of notification.buttons" class="btn btn-sm {{button.color}}"
                            (click)="onButtonClick(notification, button)" [disabled]="notification.confirmed"
                            [class.n-bold]="button.bold" [class.n-italic]="button.italic"
                            [class.n-underline]="button.underline">{{button.text}}
                    </button>
                </div>
                <div class="clearfix"></div>
            </li>
            <li *ngIf="notificationService[listName].length == 0" class="no-notifications">
                {{'label_no_notifications' | bkTranslate:this}}
            </li>
        </ul>
    `
    /* tslint:enable */
})
export class NotificationsListComponent {

    // tslint:disable-next-line:no-input-rename
    @Input('class')
    public classes: string = '';

    @Input()
    protected listName: string = 'notifications';

    constructor(public notificationService: NotificationService) {
    }

    onObjectClick(n: Notification, e: INotificationElement) {
        this.notificationService.onObjectClick(n, e);
    }

    onDeleteClick(n: Notification) {
        this.notificationService.onDeleteClick(n);
    }

    onButtonClick(n: Notification, b: INotificationButton) {
        this.notificationService.onButtonClick(n, b);
    }

}
