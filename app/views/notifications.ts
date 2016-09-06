/**
 * Created by dominikkrisztof on 23.08.16.
 */


import {Component, Injector, OnInit} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {NotificationService} from "../services/NotificationService";
import {BackendService} from "../services/BackendService";

@Component({
    selector: "view-notifications",
    directives: [LayoutMain],
    templateUrl: "app/views/notifications.html"
})
export class NotificationsComponent extends BaseMainComponent implements OnInit{

    constructor(injector:Injector,protected backendService:BackendService,protected notificationService:NotificationService) {super(injector)};


    ngOnInit(): void {
        //TODO s novým tyrionem zkontrolovat zda se všechny notifikace načítají správně
        this.notificationService.getRestApiNotifications();
    }
}
