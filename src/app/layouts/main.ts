/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Component, OnDestroy, OnInit, Input, Inject, OnChanges, SimpleChanges, NgZone, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TyrionBackendService } from '../services/BackendService';
import { BreadcrumbsService } from '../services/BreadcrumbsService';
import { TabMenuService } from '../services/TabMenuService';
import { LabeledLink } from '../helpers/LabeledLink';
import { NotificationService } from '../services/NotificationService';
import { Subscription } from 'rxjs';


declare const BECKI_VERSION: string;
declare const BECKI_VERSION_ID: number;
declare const BECKI_VERSION_DATE: string;

const BODY_CLASSES = ['page-header-fixed', 'page-content-white'];

@Component({
    selector: 'bk-layout-main',
    templateUrl: './main.html',
})
export class LayoutMainComponent implements OnInit, OnDestroy, OnChanges {

    @Input()
    title: string = '';

    @Input()
    subtitle: string = '';

    @Input()
    show_title: boolean = true;

    @Input()
    tabMenu: string = null;

    @Input()
    lastBreadName: string = '';

    tabMenuItems: LabeledLink[] = null;
    tabMenuDropped: string = '';

    showUserMenu: boolean = false;
    showNotificationMenu: boolean = false;

    sidebarClosed: boolean = false;
    sidebarMobileClosed: boolean = true;

    beckiBeta: boolean = false;

    openTabMenuIndex: number = -1;

    versionString = 'Version: ' + BECKI_VERSION + ' id: ' + BECKI_VERSION_ID + ' date: ' + BECKI_VERSION_DATE;

    private notifMouseMoveSend: boolean = false;

    breadcrumbsService: BreadcrumbsService = null;

    changeDetectionSubcsription: Subscription;

    constructor(
        public notificationService: NotificationService,
        public backendService: TyrionBackendService,
        @Inject('navigation') private navigation: LabeledLink[],
        breadcrumbsService: BreadcrumbsService,
        private tabMenuService: TabMenuService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private zone: NgZone,
        private cdRef: ChangeDetectorRef
    ) {
        this.breadcrumbsService = breadcrumbsService;
        this.beckiBeta = backendService.getBeckiBeta();
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
        } else if (ll.link) {
            return this.router.isActive(ll.link.join('/'), ll.options['linkActiveExact']);
        } else {
            return false;
        }
    }

    toggleTabMenu(index: number) {
        if (this.openTabMenuIndex === index) {
            this.openTabMenuIndex = -1;
        } else {
            this.openTabMenuIndex = index;
        }
    }


    onLogo() {
        this.router.navigate(['/dashboard']);
    }

    onLogOutClick() {
        this.router.navigate(['/logout']);
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

        this.zone.run(() => {
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
        });
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
        this.zone.runOutsideAngular(() => {
            document.body.addEventListener('mouseup', this.mouseUpEvent);
            document.body.addEventListener('mousemove', this.mouseMoveEvent);
        });

        this.changeDetectionSubcsription = this.backendService.changeDetectionEmitter.subscribe(() => {
            this.cdRef.detectChanges();
        });
    }

    ngOnDestroy(): void {
        document.body.classList.remove(...BODY_CLASSES);
        this.zone.runOutsideAngular(() => {
            document.body.removeEventListener('mouseup', this.mouseUpEvent);
            document.body.removeEventListener('mousemove', this.mouseMoveEvent);
        });

        this.changeDetectionSubcsription.unsubscribe();
    }

    openSubmanyItem(label: string) {
        this.tabMenuDropped = label;
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

    onMobileSidebarToggleClick() {
        this.sidebarMobileClosed = !this.sidebarMobileClosed;
        /*localStorage.setItem('sidebarClosed', this.sidebarMobileClosed ? 'true' : 'false');
        if (this.sidebarMobileClosed) {
            document.body.classList.add('page-sidebar-closed');
        } else {
            document.body.classList.remove('page-sidebar-closed');
        }*/
    }

    onUserToggleClick() {
        this.showUserMenu = !this.showUserMenu;
        this.showNotificationMenu = false;
    }

    onQRclick() {
        this.router.navigate(['/qr-reader-hardware']);

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
