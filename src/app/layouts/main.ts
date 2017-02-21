/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Component, OnDestroy, OnInit, Input, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../services/BackendService';
import { BreadcrumbsService } from '../services/BreadcrumbsService';
import { TabMenuService } from '../services/TabMenuService';
import { LabeledLink } from '../helpers/LabeledLink';
import { NotificationService } from '../services/NotificationService';

declare const BECKI_VERSION: string;
declare const BECKI_VERSION_ID: number;
declare const BECKI_VERSION_DATE: string;

const BODY_CLASSES = ['page-header-fixed', 'page-container-bg-solid'];

@Component({
    selector: 'bk-layout-main',
    templateUrl: './main.html'
})
export class LayoutMainComponent implements OnInit, OnDestroy, OnChanges {

    @Input()
    title: string = '';

    @Input()
    subtitle: string = '';

    @Input()
    tabMenu: string = null;

    @Input()
    lastBreadName: string = '';

    tabMenuItems: LabeledLink[] = null;

    showUserMenu: boolean = false;
    showNotificationMenu: boolean = false;

    sidebarClosed: boolean = false;

    openTabMenuIndex: number = -1;

    versionString = 'Version: ' + BECKI_VERSION + ' id: ' + BECKI_VERSION_ID + ' date: ' + BECKI_VERSION_DATE;

    private notifMouseMoveSend: boolean = false;

    constructor(
        public notificationService: NotificationService,
        public backendService: BackendService,
        @Inject('navigation') private navigation: LabeledLink[],
        private breadcrumbsService: BreadcrumbsService,
        private tabMenuService: TabMenuService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['lastBreadName']) {
            this.breadcrumbsService.setLastBreadName(changes['lastBreadName'].currentValue);
        }
    }

    isRouterLinkActive(ll: LabeledLink): boolean {
        if (ll.options['items']) {
            let isActive = false;
            ll.options['items'].forEach((lll: LabeledLink) => {
                if (this.router.isActive(lll.link.join('/'), lll.options['linkActiveExact'])) {
                    isActive = true;
                }
            });
            return isActive;
        } else {
            return this.router.isActive(ll.link.join('/'), ll.options['linkActiveExact']);
        }
    }

    toggleTabMenu(index: number) {
        if (this.openTabMenuIndex === index) {
            this.openTabMenuIndex = -1;
        } else {
            this.openTabMenuIndex = index;
        }
    }

    // define function as property is needed to can set it as event listener (class methods is called with wrong this)
    mouseUpEvent = (e: MouseEvent) => {

        // ignore click on opened dropdowns menus
        let dropdowns = document.getElementsByClassName('dropdown-menu');
        let onSome = false;
        for (let i = 0; i < dropdowns.length; ++i) {
            if (onSome) {
                continue;
            }
            let item = dropdowns[i];
            let bcr = item.getBoundingClientRect();
            if (bcr.left <= e.clientX && e.clientX <= bcr.right && bcr.top <= e.clientY && e.clientY <= bcr.bottom) {
                onSome = true;
            }
        }
        if (onSome) {
            return;
        }

        let oldShowNotificationMenu = this.showNotificationMenu;
        let oldShowUserMenu = this.showUserMenu;
        let oldOpenTabMenuIndex = this.openTabMenuIndex;
        setTimeout(() => {
            if (oldShowNotificationMenu === this.showNotificationMenu) {
                this.showNotificationMenu = false;
            }
            if (oldShowUserMenu === this.showUserMenu) {
                this.showUserMenu = false;
            }
            if (oldOpenTabMenuIndex === this.openTabMenuIndex) {
                this.openTabMenuIndex = -1;
            }
        }, 1);
    }

    mouseMoveEvent = () => {
        if (this.notifMouseMoveSend) {
            return;
        }
        this.notifMouseMoveSend = true;
        setTimeout(() => {
            this.notifMouseMoveSend = false;
        }, 500);

        if (this.notificationService) {
            this.notificationService.mouseMove();
        }
    }

    ngOnInit(): void {
        this.openTabMenuIndex = -1;
        this.tabMenuItems = this.tabMenuService.getMenu(this.tabMenu);
        this.notifMouseMoveSend = false;

        this.initSidebarClosed();
        document.body.classList.add(...BODY_CLASSES);
        document.body.addEventListener('mouseup', this.mouseUpEvent);
        document.body.addEventListener('mousemove', this.mouseMoveEvent);
    }

    ngOnDestroy(): void {
        document.body.classList.remove(...BODY_CLASSES);
        document.body.removeEventListener('mouseup', this.mouseUpEvent);
        document.body.removeEventListener('mousemove', this.mouseMoveEvent);
    }

    initSidebarClosed() {
        this.sidebarClosed = localStorage.getItem('sidebarClosed') === 'true';
        if (this.sidebarClosed) {
            document.body.classList.add('page-sidebar-closed');
        } else {
            document.body.classList.remove('page-sidebar-closed');
        }
    }

    onSidebarToggleClick() {
        this.sidebarClosed = !this.sidebarClosed;
        localStorage.setItem('sidebarClosed', this.sidebarClosed ? 'true' : 'false');
        if (this.sidebarClosed) {
            document.body.classList.add('page-sidebar-closed');
        } else {
            document.body.classList.remove('page-sidebar-closed');
        }
    }

    onUserToggleClick() {
        this.showUserMenu = !this.showUserMenu;
        this.showNotificationMenu = false;
    }

    onNotificationToggleClick() {
        this.showNotificationMenu = !this.showNotificationMenu;
        this.showUserMenu = false;

        if (this.showNotificationMenu) {
            // delayed mark as read for animation in toolbar menu (CSS animation)
            setTimeout(() => {
                this.notificationService.markNotificationsRead(this.notificationService.toolbarNotifications);
            }, 1);
        }
    }

}
