/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Component, OnDestroy, OnInit, Input, Inject} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {ROUTER_DIRECTIVES, ActivatedRoute, Params} from "@angular/router";
import {BackendService} from "../services/BackendService";
import {FlashMessagesComponent} from "../components/FlashMessagesComponent";
import {Subscription} from "rxjs/Rx";
import {BreadcrumbsService} from "../services/BreadcrumbsService";
import {TabMenuService} from "../services/TabMenuService";
import {LabeledLink} from "../helpers/LabeledLink";
import {NotificationService} from "../services/NotificationService";


const BODY_CLASSES = ["page-header-fixed", "page-container-bg-solid"];

@Component({
    selector: "layout-main",
    templateUrl: "app/layouts/main.html",
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES, FlashMessagesComponent]
})
export class LayoutMain implements OnInit, OnDestroy {

    @Input()
    title:string = "";

    @Input()
    tabMenu:string = null;

    tabMenuItems:LabeledLink[] = null;

    showUserMenu:boolean = false;
    showNotificationMenu:boolean = false;

    sidebarClosed:boolean = false;

    constructor(protected notificationsService:NotificationService, private backendService:BackendService, @Inject("navigation") private navigation:LabeledLink[], private breadcrumbsService:BreadcrumbsService, private tabMenuService:TabMenuService, private activatedRoute:ActivatedRoute) {
    }

    // define function as property is needed to can set it as event listener (class methods is called with wrong this)
    mouseUpEvent = () => {
        this.showNotificationMenu = false;
        this.showUserMenu = false;
    };

    ngOnInit():void {
        this.tabMenuItems = this.tabMenuService.getMenu(this.tabMenu);

        this.initSidebarClosed();
        document.body.classList.add(...BODY_CLASSES);
        document.body.addEventListener("mouseup", this.mouseUpEvent);
    }

    ngOnDestroy():void {
        document.body.classList.remove(...BODY_CLASSES);
        document.body.removeEventListener("mouseup", this.mouseUpEvent);
    }

    initSidebarClosed() {
        this.sidebarClosed = localStorage.getItem('sidebarClosed') == "true";
        if (this.sidebarClosed) {
            document.body.classList.add("page-sidebar-closed");
        } else {
            document.body.classList.remove("page-sidebar-closed");
        }
    }

    onSidebarToggleClick() {
        this.sidebarClosed = !this.sidebarClosed;
        localStorage.setItem('sidebarClosed', this.sidebarClosed?"true":"false");
        if (this.sidebarClosed) {
            document.body.classList.add("page-sidebar-closed");
        } else {
            document.body.classList.remove("page-sidebar-closed");
        }
    }

    onUserToggleClick() {
        this.showUserMenu = !this.showUserMenu;
        this.showNotificationMenu = false;
    }

    onNotificationToggleClick() {
        this.notificationsService.wasReadedNotifications();
        this.showNotificationMenu = !this.showNotificationMenu;
        this.showUserMenu = false;
    }

}
